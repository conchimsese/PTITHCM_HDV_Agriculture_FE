import { ServiceLayout } from '../shared/ui/ServiceLayout';
import { ChatPage } from '../features/chat/pages/ChatPage';
import {
  PaymentsPage,
  ContractPage,
  CreateContractPage,
  DisputePage,
} from '../features/payments/pages/PaymentsPage';
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
          <Route element={<ServiceLayout />}>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/new" element={<CreateContractPage />} />
            <Route path="/payments/contracts/:contractId" element={<ContractPage />} />
            <Route path="/payments/disputes/:disputeId" element={<DisputePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
