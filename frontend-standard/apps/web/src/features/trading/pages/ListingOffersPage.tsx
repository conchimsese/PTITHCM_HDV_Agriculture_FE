import { Link, useParams } from 'react-router-dom';

export function ListingOffersPage() {
  const { listingId } = useParams<{ listingId: string }>();

  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb-nav">
            <Link to="/bai-dang">Bài đăng</Link>
            <span>/</span>
            <Link to={`/bai-dang/${listingId}`}>Chi tiết</Link>
            <span>/</span>
            <span>Báo giá đã nhận</span>
          </nav>
          <h1>Báo giá nhận được</h1>
          <p className="page-subtitle">
            Xem các đề xuất mua từ thương lái cho bài đăng {listingId}
          </p>
        </div>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">🏷️</span>
        <h3>Danh sách báo giá</h3>
        <p>Xem xét báo giá và chấp nhận đề xuất để bắt đầu trao đổi qua tin nhắn.</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 5)</p>
      </div>
    </div>
  );
}
