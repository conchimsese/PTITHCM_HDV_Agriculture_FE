import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/runtime';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../features/users/pages/AuthPage';
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/dang-nhap" element={<AuthPage mode="login" />} />
          <Route path="/dang-ky" element={<AuthPage mode="register" />} />
          <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
