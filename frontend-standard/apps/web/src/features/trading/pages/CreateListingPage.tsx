import { Link } from 'react-router-dom';

export function CreateListingPage() {
  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb-nav">
            <Link to="/bai-dang">Bài đăng của tôi</Link>
            <span>/</span>
            <span>Tạo bài đăng</span>
          </nav>
          <h1>Đăng bài bán lúa</h1>
          <p className="page-subtitle">Chọn thửa ruộng và mùa vụ thu hoạch để chào bán nông sản</p>
        </div>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">📝</span>
        <h3>Biểu mẫu tạo bài đăng</h3>
        <p>Nhập thông tin Ruộng, Mùa vụ và Giá mong muốn (VND).</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 4)</p>
      </div>
    </div>
  );
}

