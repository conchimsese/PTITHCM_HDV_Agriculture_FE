import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { ListingDTO, OfferDTO } from '@agri/contracts';
import { tradingApi } from '../../../shared/api/runtime';
import { formatArea, formatVND, formatYield } from '../../../shared/utils/formatters';

interface QuickOfferModalProps {
  listing: ListingDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (offer: OfferDTO) => void;
}

export function QuickOfferModal({ listing, isOpen, onClose, onSuccess }: QuickOfferModalProps) {
  const queryClient = useQueryClient();
  const [createdOffer, setCreatedOffer] = useState<OfferDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const offerMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const idempotencyKey = crypto.randomUUID();
      return tradingApi.createOffer({ listingId }, idempotencyKey);
    },
    onSuccess: (offer) => {
      setCreatedOffer(offer);
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      onSuccess?.(offer);
    },
    onError: (err: Error) => {
      if (err.message.includes('SELF_OFFER_NOT_ALLOWED')) {
        setErrorMessage('Bạn không thể gửi báo giá cho bài đăng của chính mình.');
      } else if (err.message.includes('LISTING_NOT_OPEN')) {
        setErrorMessage('Bài đăng hiện không còn mở nhận báo giá (đã cọc hoặc đã bán).');
      } else {
        setErrorMessage(err.message || 'Không thể gửi báo giá. Vui lòng thử lại sau.');
      }
    },
  });

  if (!isOpen || !listing) return null;

  const handleClose = () => {
    setCreatedOffer(null);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    offerMutation.mutate(listing.listingId);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} aria-hidden="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Đóng hộp thoại"
        >
          ✕
        </button>

        {createdOffer ? (
          <div className="offer-success-view">
            <span className="success-icon" aria-hidden="true">
              🎉
            </span>
            <h3 id="modal-title">Gửi báo giá thành công!</h3>
            <p className="success-message">
              Đề xuất quan tâm thu mua lúa <strong>{listing.seedType}</strong> đã được gửi tới nông
              dân. Khi nông dân chấp nhận, phòng trò chuyện sẽ tự động được mở để hai bên thương
              lượng.
            </p>
            <div className="offer-summary-card">
              <div className="summary-row">
                <span>Mã báo giá:</span>
                <code>{createdOffer.offerId.slice(0, 8)}…</code>
              </div>
              <div className="summary-row">
                <span>Trạng thái:</span>
                <span className="status-badge pending">Đang chờ nông dân duyệt (PENDING)</span>
              </div>
            </div>
            <div className="modal-actions">
              <Link to="/bao-gia" className="modal-btn primary" onClick={handleClose}>
                Xem danh sách báo giá của tôi →
              </Link>
              <button type="button" className="modal-btn secondary" onClick={handleClose}>
                Tiếp tục xem thị trường
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="offer-form">
            <div className="modal-header">
              <span className="modal-leaf" aria-hidden="true">
                🌾
              </span>
              <div>
                <h3 id="modal-title">Gửi báo giá thu mua lúa</h3>
                <p className="modal-desc">
                  Bày tỏ ý định thu mua sản phẩm từ nông dân theo thông tin chào bán
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="alert alert-error" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Produce Information Card */}
            <div className="produce-recap-card">
              <div className="recap-header">
                <span className="recap-title">{listing.seedType}</span>
                <span className="recap-price">{formatVND(listing.expectedPrice)}</span>
              </div>
              <div className="recap-details">
                <div className="detail-item">
                  <span className="detail-label">Sản lượng dự kiến:</span>
                  <span className="detail-val">{formatYield(listing.estimatedYield)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Diện tích canh tác:</span>
                  <span className="detail-val">{formatArea(listing.area)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tọa độ ruộng:</span>
                  <span className="detail-val">
                    {listing.latitude.toFixed(4)}, {listing.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <p className="form-note">
              ℹ️ Sau khi gửi, nông dân sẽ nhận được thông báo về đề xuất thu mua của bạn. Báo giá
              bắt đầu ở trạng thái <strong>PENDING</strong> không cần đặt cọc trước. Tiền cọc 5% sẽ
              được xác lập sau khi hai bên chốt hợp đồng.
            </p>

            <div className="modal-actions">
              <button
                type="submit"
                className="modal-btn primary"
                disabled={offerMutation.isPending}
              >
                {offerMutation.isPending ? 'Đang gửi đề xuất…' : 'Xác nhận gửi báo giá'}
              </button>
              <button
                type="button"
                className="modal-btn secondary"
                onClick={handleClose}
                disabled={offerMutation.isPending}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
