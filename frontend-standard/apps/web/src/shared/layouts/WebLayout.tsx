import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { modulesForRole, roleLabels } from '@agri/contracts';
import { useSession, logout } from '../../features/users/hooks/useSession';
export function WebLayout() {
  const session = useSession();
  const [error, setError] = useState('');
  if (!session) return null;
  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#/dashboard">
          Ruộng Lúa Việt<span>WEB WORKSPACE</span>
        </a>
        <p>{roleLabels[session.role]}</p>
        <nav aria-label="Điều hướng chính">
          {modulesForRole(session.role).map((item) => (
            <NavLink key={item.id} to={`/${item.id}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="secondary"
          onClick={() =>
            logout().catch(() =>
              setError('Đã xóa phiên trên máy; máy chủ chưa xác nhận thu hồi token.'),
            )
          }
        >
          Đăng xuất
        </button>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Đồ án Hướng dịch vụ</span>
          <span className="badge">{session.isDemo ? 'Dữ liệu mẫu' : 'Kết nối Gateway'}</span>
        </header>
        {error && <p role="alert">{error}</p>}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
