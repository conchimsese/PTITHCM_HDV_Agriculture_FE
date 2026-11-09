import { Link, useParams } from 'react-router-dom';

export function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();

  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb-nav">
            <Link to="/bai-dang">Bài đăng</Link>
            <span>/</span>
            <span>Chi tiết</span>
          </nav>
          <h1>Chi tiết bài đăng</h1>
          <p className="page-subtitle">Mã sản phẩm: {listingId}</p>
        </div>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">🔍</span>
        <h3>Thông tin mùa vụ & nông sản</h3>
        <p>Chi tiết giống lúa, sản lượng dự kiến, diện tích canh tác và giá chào bán.</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 4)</p>
      </div>
    </div>
  );
}

