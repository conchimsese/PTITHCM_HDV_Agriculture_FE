import { useState, type FormEvent } from 'react';
import { feedParamsSchema } from '@agri/contracts';
import { useListingFeed } from '../hooks/useListingFeed';
import { ListingCard } from '../components/ListingCard';
import { env } from '../../../shared/config/env';
export function MarketplacePage() {
  const [params, setParams] = useState({ lat: 10.125, lng: 106.45, radius: 15, page: 0, size: 2 });
  const [validation, setValidation] = useState('');
  const query = useListingFeed(params);
  function filter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = feedParamsSchema.safeParse({
      ...params,
      lat: Number(data.get('lat')),
      lng: Number(data.get('lng')),
      radius: Number(data.get('radius')),
      page: 0,
    });
    if (!parsed.success) {
      setValidation('Kiểm tra vĩ độ, kinh độ và bán kính lớn hơn 0.');
      return;
    }
    setValidation('');
    setParams(parsed.data);
  }
  return (
    <>
      <span className="eyebrow">TRADING / VÍ DỤ CODE CHUẨN</span>
      <h1>Nguồn lúa gần bạn</h1>
      <p className="lead">
        Tìm ruộng theo vị trí. Giao diện web riêng, dùng chung API client với ứng dụng mobile.
      </p>
      <form className="card filters" onSubmit={filter}>
        <label>
          Vĩ độ
          <input
            name="lat"
            type="number"
            step="any"
            min="-90"
            max="90"
            defaultValue={params.lat}
            required
          />
        </label>
        <label>
          Kinh độ
          <input
            name="lng"
            type="number"
            step="any"
            min="-180"
            max="180"
            defaultValue={params.lng}
            required
          />
        </label>
        <label>
          Bán kính {env.dataSource === 'mock' ? '(km mẫu)' : '(đơn vị backend)'}
          <input
            name="radius"
            type="number"
            step="any"
            min="0.001"
            defaultValue={params.radius}
            required
          />
        </label>
        <button>Áp dụng bộ lọc</button>
      </form>
      {validation && <p role="alert">{validation}</p>}
      {query.isPending ? (
        <p role="status">Đang tải nguồn hàng…</p>
      ) : query.isError ? (
        <section className="card" role="alert">
          <p>{query.error.message}</p>
          <button onClick={() => void query.refetch()}>Thử lại</button>
        </section>
      ) : (
        <>
          <p aria-live="polite">
            {query.data.totalElements} bài đăng · Trang {params.page + 1}
          </p>
          {query.data.items.length ? (
            <div className="listing-grid">
              {query.data.items.map((row) => (
                <ListingCard key={row.listingId} listing={row} />
              ))}
            </div>
          ) : (
            <section className="card">
              Chưa có nguồn hàng trong bán kính này. Thử mở rộng bộ lọc.
            </section>
          )}
          <div className="actions pagination">
            <button
              disabled={params.page === 0}
              onClick={() => setParams({ ...params, page: params.page - 1 })}
            >
              Trang trước
            </button>
            <button
              disabled={params.page + 1 >= query.data.totalPages}
              onClick={() => setParams({ ...params, page: params.page + 1 })}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </>
  );
}
