import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateListing } from '../hooks/useCreateListing';
import { formatVND } from '../../../shared/utils/formatters';

// Sample plots/seasons for convenient testing and pre-filling
const SAMPLE_PLOTS = [
  {
    name: 'Ruộng ST25 Mỹ Xuyên (Sóc Trăng)',
    plotId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    cropSeasonId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    defaultPrice: '4500000.00',
    desc: 'Diện tích 1,2 ha · Dự kiến thu hoạch 5 tấn lúa giống ST25',
  },
  {
    name: 'Ruộng OM18 Thoại Sơn (An Giang)',
    plotId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    cropSeasonId: '7c9e6679-7425-40de-944b-e07fc1f90ae8',
    defaultPrice: '3800000.00',
    desc: 'Diện tích 1,5 ha · Dự kiến thu hoạch 6 tấn lúa OM18',
  },
  {
    name: 'Ruộng Đài Thơm 8 Tháp Mười (Đồng Tháp)',
    plotId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    cropSeasonId: '7c9e6679-7425-40de-944b-e07fc1f90ae9',
    defaultPrice: '4200000.00',
    desc: 'Diện tích 1,0 ha · Dự kiến thu hoạch 4,5 tấn Đài Thơm 8',
  },
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function CreateListingForm() {
  const [plotId, setPlotId] = useState('');
  const [cropSeasonId, setCropSeasonId] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const createListingMutation = useCreateListing();

  const handleSelectSample = (sample: (typeof SAMPLE_PLOTS)[0]) => {
    setPlotId(sample.plotId);
    setCropSeasonId(sample.cropSeasonId);
    setPriceInput(sample.defaultPrice);
    setValidationError(null);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setPriceInput(raw);
    setValidationError(null);
  };

  const handlePriceBlur = () => {
    if (!priceInput) return;
    const num = parseFloat(priceInput);
    if (!isNaN(num) && num > 0) {
      setPriceInput(num.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanPlotId = plotId.trim();
    const cleanCropSeasonId = cropSeasonId.trim();
    let cleanPrice = priceInput.trim();

    if (!UUID_REGEX.test(cleanPlotId)) {
      setValidationError('Mã thửa ruộng (plotId) phải là định dạng UUID hợp lệ.');
      return;
    }

    if (!UUID_REGEX.test(cleanCropSeasonId)) {
      setValidationError('Mã mùa vụ canh tác (cropSeasonId) phải là định dạng UUID hợp lệ.');
      return;
    }

    const numericPrice = parseFloat(cleanPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setValidationError('Giá mong muốn phải là số tiền dương.');
      return;
    }

    if (!cleanPrice.includes('.')) {
      cleanPrice = `${cleanPrice}.00`;
    }

    createListingMutation.mutate({
      plotId: cleanPlotId,
      cropSeasonId: cleanCropSeasonId,
      expectedPrice: cleanPrice,
    });
  };

  const errorMessage =
    validationError ||
    (createListingMutation.error
      ? createListingMutation.error.message.includes('SNAPSHOT_INCOMPLETE')
        ? 'Mùa vụ canh tác này chưa hoàn thiện thông tin (giống lúa, sản lượng hoặc tọa độ ruộng). Vui lòng bổ sung dữ liệu canh tác trước khi đăng bài.'
        : createListingMutation.error.message.includes('DEPENDENCY_UNAVAILABLE')
          ? 'Không kết nối được dịch vụ canh tác. Vui lòng kiểm tra lại sau.'
          : createListingMutation.error.message
      : null);

  return (
    <div className="create-listing-card">
      {/* Sample Quick Select Box */}
      <div className="sample-plots-box">
        <span className="sample-plots-title">💡 Chọn mẫu thử nhanh từ ruộng của bạn:</span>
        <div className="sample-plots-list">
          {SAMPLE_PLOTS.map((sample) => (
            <button
              key={sample.plotId}
              type="button"
              className={`sample-plot-btn ${plotId === sample.plotId ? 'selected' : ''}`}
              onClick={() => handleSelectSample(sample)}
            >
              <span className="sample-plot-name">{sample.name}</span>
              <span className="sample-plot-desc">{sample.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="listing-form">
        <fieldset disabled={createListingMutation.isPending} className="form-fieldset">
          {/* Plot ID */}
          <label className="form-field">
            <span className="field-label">
              Mã thửa ruộng (plotId) <span className="required">*</span>
            </span>
            <input
              type="text"
              name="plotId"
              value={plotId}
              onChange={(e) => {
                setPlotId(e.target.value);
                setValidationError(null);
              }}
              placeholder="Ví dụ: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              required
              className="form-input monospace"
            />
            <span className="field-hint">
              Mã định danh duy nhất (UUID) của thửa ruộng trong hệ thống canh tác.
            </span>
          </label>

          {/* Crop Season ID */}
          <label className="form-field">
            <span className="field-label">
              Mã mùa vụ thu hoạch (cropSeasonId) <span className="required">*</span>
            </span>
            <input
              type="text"
              name="cropSeasonId"
              value={cropSeasonId}
              onChange={(e) => {
                setCropSeasonId(e.target.value);
                setValidationError(null);
              }}
              placeholder="Ví dụ: 7c9e6679-7425-40de-944b-e07fc1f90ae7"
              required
              className="form-input monospace"
            />
            <span className="field-hint">
              Hệ thống sẽ tự động đồng bộ giống lúa, sản lượng dự kiến và tọa độ GPS từ mùa vụ này.
            </span>
          </label>

          {/* Expected Price */}
          <label className="form-field">
            <span className="field-label">
              Giá mong muốn toàn bộ sản lượng (VND) <span className="required">*</span>
            </span>
            <div className="price-input-wrapper">
              <input
                type="text"
                name="expectedPrice"
                value={priceInput}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                placeholder="Ví dụ: 4500000.00"
                required
                className="form-input"
              />
              <span className="currency-suffix">VND</span>
            </div>
            {priceInput && (
              <div className="price-preview-pill">
                Hiển thị trên thị trường: <strong>{formatVND(priceInput)}</strong>
              </div>
            )}
            <span className="field-hint">
              Nhập số tiền theo định dạng số thực dương (ví dụ: 4500000.00).
            </span>
          </label>

          <div className="info-banner">
            <span className="info-icon" aria-hidden="true">
              ℹ️
            </span>
            <span>
              Theo quy chuẩn hệ thống, bài đăng sau khi tạo sẽ ở trạng thái <strong>OPEN</strong> để
              nhận báo giá từ thương lái. Nông dân có thể chấp nhận nhiều báo giá để cùng trao đổi,
              và chỉ khóa độc quyền khi thương lái đặt cọc thành công.
            </span>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button submit-btn"
              disabled={createListingMutation.isPending}
            >
              {createListingMutation.isPending
                ? 'Đang tạo bài đăng…'
                : 'Xác nhận đăng bài bán lúa →'}
            </button>
            <Link to="/bai-dang" className="secondary-button cancel-btn">
              Hủy bỏ
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
