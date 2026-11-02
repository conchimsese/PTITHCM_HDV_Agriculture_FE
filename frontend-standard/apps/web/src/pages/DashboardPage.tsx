import { Link } from 'react-router-dom';
import { modulesForRole, roleLabels } from '@agri/contracts';
import { useSession } from '../features/users/hooks/useSession';
export function DashboardPage() {
  const session = useSession();
  if (!session) return null;
  return (
    <>
      <span className="eyebrow">BẮT ĐẦU TỪ MỘT LUỒNG NHỎ</span>
      <h1>Không gian {roleLabels[session.role].toLowerCase()}</h1>
      <p className="lead">
        Mỗi nghiệp vụ có chỗ riêng. Web và mobile cùng kết nối một hệ thống dịch vụ.
      </p>
      <section className="card accent">
        <h2>Luồng mẫu đã có code</h2>
        <p>Thương lái → Thị trường → lọc GPS → danh sách → phân trang. Có adapter mock và API.</p>
        {session.role !== 'FARMER' && (
          <Link className="button" to="/marketplace">
            Mở thị trường
          </Link>
        )}
        <p>Các module còn lại là vị trí bàn giao để nhóm triển khai, chưa nối API.</p>
      </section>
      <div className="module-grid">
        {modulesForRole(session.role)
          .filter((m) => m.id !== 'dashboard')
          .map((item) => (
            <Link className="card module" to={`/${item.id}`} key={item.id}>
              <small>{item.owner}</small>
              <h2>{item.label}</h2>
              <span>
                {item.id === 'marketplace' ? 'Mở ví dụ chạy được →' : 'Xem phạm vi cần làm →'}
              </span>
            </Link>
          ))}
      </div>
    </>
  );
}
