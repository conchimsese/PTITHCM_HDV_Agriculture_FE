export function FeaturePlaceholder({ label, owner }: { label: string; owner: string }) {
  return (
    <section className="card">
      <span className="eyebrow">CHƯA TRIỂN KHAI</span>
      <h1>{label}</h1>
      <p>Backend owner: {owner}. Đây là chỗ để nhóm phát triển màn hình, chưa có dữ liệu/API.</p>
      <ol>
        <li>Đọc docs/04_MODULES_VA_CHIA_VIEC.md.</li>
        <li>Chốt request/response với backend owner.</li>
        <li>Đặt page, components và hook trong features của app này.</li>
        <li>Thêm DTO và adapter vào packages dùng chung.</li>
      </ol>
    </section>
  );
}
