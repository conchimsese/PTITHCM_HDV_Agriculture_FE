import { Link } from 'react-router-dom';

export function MyListingsPage() {
  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <h1>Bài đăng của tôi</h1>
          <p className="page-subtitle">Quản lý các sản phẩm lúa bạn đã đăng bán trên thị trường</p>
        </div>
        <Link to="/bai-dang/tao-moi" className="header-action-btn primary">
          + Đăng bài mới
        </Link>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">🌾</span>
        <h3>Danh sách bài đăng</h3>
        <p>Theo dõi trạng thái: Đang mở (OPEN), Đã cọc (LOCKED), Đã bán (SOLD).</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 4)</p>
      </div>
    </div>
  );
}

