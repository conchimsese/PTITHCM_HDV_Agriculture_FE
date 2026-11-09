import { Link } from 'react-router-dom';

export function MyOffersPage() {
  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <h1>Báo giá của tôi</h1>
          <p className="page-subtitle">Theo dõi các đề xuất mua bạn đã gửi cho nhà nông</p>
        </div>
        <Link to="/thi-truong" className="header-action-btn secondary">
          🛒 Xem thị trường
        </Link>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">📋</span>
        <h3>Lịch sử gửi báo giá</h3>
        <p>Kiểm tra trạng thái phản hồi: Đang chờ (PENDING) hoặc Đã duyệt (ACCEPTED).</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 5)</p>
      </div>
    </div>
  );
}

