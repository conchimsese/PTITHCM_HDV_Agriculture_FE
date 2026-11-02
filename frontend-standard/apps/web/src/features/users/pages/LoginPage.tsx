import { useState, type FormEvent } from 'react';
import { createDemoSession, setSession, setTokenPair } from '@agri/api-client';
import { roleLabels, type Role } from '@agri/contracts';
import { env } from '../../../shared/config/env';
import { authApi, queryClient } from '../../../shared/api/runtime';
export function LoginPage() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const tokens = await authApi.login({
        username: String(fields.get('username')).trim(),
        password: String(fields.get('password')),
      });
      queryClient.clear();
      setTokenPair(tokens);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng nhập thất bại.');
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="login">
      <span className="eyebrow">RUỘNG LÚA VIỆT / WEB</span>
      <h1>
        Cùng một mùa vụ.
        <br />
        Kết nối nhiều cơ hội.
      </h1>
      <p>Bộ khung phát triển frontend của nhóm · React + TypeScript</p>
      {env.dataSource === 'mock' ? (
        <section className="card">
          <h2>Chọn vai trò để xem mẫu</h2>
          <p>Chế độ dữ liệu giả. Không xác thực hay thực hiện giao dịch.</p>
          <div className="actions">
            {(['FARMER', 'TRADER', 'ADMIN'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  queryClient.clear();
                  setSession(createDemoSession(role));
                }}
              >
                {roleLabels[role]}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <form className="card form" onSubmit={submit}>
          <h2>Đăng nhập</h2>
          <label>
            Tên đăng nhập
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            Mật khẩu
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {error && <p role="alert">{error}</p>}
          <button disabled={pending}>{pending ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        </form>
      )}
    </main>
  );
}
