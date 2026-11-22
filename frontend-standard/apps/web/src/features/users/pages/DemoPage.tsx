import { useState } from 'react';
import { load, selectedPlot, selectedPlotKey } from '../../farming/demo';
import { Link } from 'react-router-dom';
import { useSession } from '../../../shared/hooks/useAuth';
import './dashboard.css';
export function DashboardPage() {
  const session = useSession();
  if (!session) return null;
  const farmer = session.role === 'FARMER',
    trader = session.role === 'TRADER';
  if (farmer) return <FarmerDashboard demo={Boolean(session.isDemo)} />;
  return (
    <div className="dashboard">
      <div className="dash-heading">
        <div>
          <p className="dash-kicker">RUỘNG LÚA VIỆT · TỔNG QUAN</p>
          <h1>Chào {trader ? 'thương lái' : 'quản trị viên'}!</h1>
          <p>Theo dõi công việc và kết nối trong từng mùa vụ.</p>
        </div>
        <span className="dash-badge">{session.isDemo ? 'DỮ LIỆU MẪU' : 'TÀI KHOẢN CỦA BẠN'}</span>
      </div>
      {session.isDemo && (
        <p className="dash-notice">
          Bạn đang xem dữ liệu minh họa. Chat, hợp đồng và tài khoản cần backend để sử dụng.
        </p>
      )}
      <div className="dash-grid">
        <section className="dash-card dash-feature">
          <span className="dash-kicker">BẮT ĐẦU TỪ ĐÂY</span>
          <h2>
            {farmer
              ? 'Quản lý bài đăng của bạn'
              : trader
                ? 'Khám phá thị trường lúa'
                : 'Quản lý hệ thống'}
          </h2>
          <p>
            {farmer
              ? 'Xem bài bán lúa và các đề nghị từ thương lái.'
              : trader
                ? 'Tìm nguồn lúa và theo dõi báo giá của bạn.'
                : 'Theo dõi tài khoản và các hoạt động cần xử lý.'}
          </p>
          {session.isDemo && !farmer && !trader ? (
            <span>Chức năng quản trị cần backend</span>
          ) : (
            <Link
              className="dash-action"
              to={farmer ? '/bai-dang' : trader ? '/thi-truong' : '/quan-ly-tai-khoan'}
            >
              {farmer ? 'Xem bài đăng' : trader ? 'Xem thị trường' : 'Quản lý tài khoản'} →
            </Link>
          )}
        </section>
        <section className="dash-card">
          <span className="dash-kicker">KẾT NỐI</span>
          <h2>Trao đổi & hợp đồng</h2>
          <p>Giữ nội dung trao đổi và điều khoản giao dịch ở cùng một nơi.</p>
          {session.isDemo ? (
            <small>Cần backend để sử dụng</small>
          ) : (
            <>
              <Link to="/chat">Tin nhắn →</Link> <Link to="/payments">Hợp đồng & cọc →</Link>
            </>
          )}
        </section>
        <section className="dash-card">
          <span className="dash-kicker">THEO DÕI</span>
          <h2>Thông báo</h2>
          <p>Cập nhật khi có hoạt động mới liên quan đến tài khoản của bạn.</p>
          {session.isDemo ? (
            <small>Chưa có dữ liệu mẫu</small>
          ) : (
            <Link to="/thong-bao">Xem thông báo →</Link>
          )}
        </section>
      </div>
      <p className="dash-footer">Cùng nhau xây dựng một mùa vụ bền vững.</p>
    </div>
  );
}

const farmingActions = [
  { to: '/nhat-ky', label: 'Ghi việc đã làm', icon: '▤' },
  { to: '/chi-phi', label: 'Ghi chi phí', icon: '₫' },
  { to: '/ruong-vu', label: 'Xem ruộng lúa', icon: '♧' },
  { to: '/bai-dang/tao-moi', label: 'Đăng bán lúa', icon: '+' },
];

function FarmerDashboard({ demo }: { demo: boolean }) {
  const [data] = useState(() => (demo ? load() : undefined));
  const [plotId, setPlotId] = useState(() => data && selectedPlot(data)?.id);
  const plot = data?.plots.find((item) => item.id === plotId);
  const logs = data?.journal
    .filter((item) => item.plotId === plotId && item.season === plot?.season)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  return (
    <div className="season-dashboard">
      <div className="season-dashboard-main">
        <header>
          <p className="dash-kicker">BẢNG TIN MÙA VỤ</p>
          <h1>Hôm nay ruộng lúa thế nào?</h1>
          <p>Theo dõi công việc và ghi chép theo từng mùa vụ.</p>
        </header>

        <section className="dash-card season-hero">
          <p className="season-chip">{demo ? 'Mùa vụ minh họa' : 'Mùa vụ của bạn'}</p>
          <h2>
            {plot ? [plot.season || 'Chưa có mùa vụ', plot.name].join(' · ') : 'Ruộng và mùa vụ'}
          </h2>
          {plot && <p>{[plot.crop, plot.area].filter(Boolean).join(' · ')}</p>}
          <div className="season-links">
            <Link className="season-primary" to="/ruong-vu">
              Xem mùa vụ →
            </Link>
            <Link to="/nhat-ky">Ghi nhật ký</Link>
          </div>
        </section>

        <section className="dash-card">
          <h2>Hôm nay bà con muốn làm gì?</h2>
          <div className="season-actions">
            {farmingActions.map(({ to, label, icon }) => (
              <Link key={to} to={to}>
                <span aria-hidden="true">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="dash-card">
          <h2>Nhật ký canh tác</h2>
          <div className="season-timeline">
            {logs?.length ? (
              logs.map((item) => (
                <article key={item.id}>
                  <strong>{item.detail}</strong>
                  <small>
                    {item.date} · {plot?.name}
                  </small>
                </article>
              ))
            ) : (
              <p>Chưa có công việc được hiển thị cho mùa vụ này.</p>
            )}
          </div>
          <Link to="/nhat-ky">Xem nhật ký →</Link>
        </section>
      </div>

      <aside className="season-dashboard-aside" aria-label="Thông tin mùa vụ">
        <section className="dash-card">
          <h2>Ruộng đang theo dõi</h2>
          {data && (
            <label className="season-switch">
              Ruộng đang chọn
              <select
                value={plotId}
                onChange={(event) => {
                  sessionStorage.setItem(selectedPlotKey, event.target.value);
                  setPlotId(event.target.value);
                }}
              >
                {data.plots.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.area}
                  </option>
                ))}
              </select>
            </label>
          )}
          <p>{plot?.season || 'Chọn ruộng để xem mùa vụ.'}</p>
          <Link to="/ruong-vu">Xem danh sách ruộng →</Link>
        </section>
        <section className="dash-card">
          <h2>Công việc liên quan</h2>
          <div className="season-related">
            <Link to="/chi-phi">Chi phí canh tác →</Link>
            <Link to="/bai-dang">Bài đăng bán lúa →</Link>
          </div>
        </section>
      </aside>
    </div>
  );
}
