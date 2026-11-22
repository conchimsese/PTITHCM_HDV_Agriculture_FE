import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/runtime';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../features/users/pages/AuthPage';
import { ProfilePage, PublicProfilePage } from '../features/users/pages/ProfilePage';
import { AccountsPage } from '../features/users/pages/AccountsPage';
import { VerifyEmailPage } from '../features/users/pages/VerifyEmailPage';
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/xac-minh-email" element={<VerifyEmailPage />} />
          <Route path="/tai-khoan" element={<ProfilePage />} />
          <Route path="/nguoi-dung/:accountId" element={<PublicProfilePage />} />
          <Route path="/quan-ly-tai-khoan" element={<AccountsPage />} />
          <Route path="/dang-nhap" element={<AuthPage mode="login" />} />
          <Route path="/dang-ky" element={<AuthPage mode="register" />} />
          <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
