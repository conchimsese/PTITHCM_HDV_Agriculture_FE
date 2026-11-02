import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { modulesForRole } from '@agri/contracts';
import { queryClient } from '../shared/api/runtime';
import { useSession } from '../features/users/hooks/useSession';
import { LoginPage } from '../features/users/pages/LoginPage';
import { MarketplacePage } from '../features/trading/pages/MarketplacePage';
import { DashboardPage } from '../pages/DashboardPage';
import { WebLayout } from '../shared/layouts/WebLayout';
import { FeaturePlaceholder } from '../shared/ui/FeaturePlaceholder';
function AppRoutes() {
  const session = useSession();
  if (!session)
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        {modulesForRole(session.role).map((item) => (
          <Route
            key={item.id}
            path={`/${item.id}`}
            element={
              item.id === 'dashboard' ? (
                <DashboardPage />
              ) : item.id === 'marketplace' ? (
                <MarketplacePage />
              ) : (
                <FeaturePlaceholder label={item.label} owner={item.owner} />
              )
            }
          />
        ))}
        <Route
          path="*"
          element={
            <section className="card">
              <h1>Không tìm thấy trang hoặc bạn chưa có quyền xem.</h1>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </QueryClientProvider>
  );
}
