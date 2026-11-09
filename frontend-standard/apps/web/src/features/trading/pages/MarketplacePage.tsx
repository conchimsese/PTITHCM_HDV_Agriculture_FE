export function MarketplacePage() {
  return (
    <div className="trading-page">
      <div className="page-header">
        <div>
          <h1>Thị trường lúa</h1>
          <p className="page-subtitle">Khám phá sản phẩm nông nghiệp và kết nối với nhà nông</p>
        </div>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon">🛒</span>
        <h3>Sàn giao dịch nông sản</h3>
        <p>Danh sách các bài đăng bán lúa gần bạn với tính năng sắp xếp vị trí GPS.</p>
        <p className="status-tag">Đang chuẩn bị hiển thị (Giai đoạn 3)</p>
      </div>
    </div>
  );
}
