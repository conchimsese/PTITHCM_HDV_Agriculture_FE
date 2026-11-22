import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';

const rooms = [
  {
    id: 'demo-st25',
    crop: 'ST25',
    offer: 'BG-01',
    opening: 'Mình trao đổi về lịch thu hoạch ST25 nhé.',
  },
  {
    id: 'demo-om18',
    crop: 'OM18',
    offer: 'BG-02',
    opening: 'Ruộng OM18 dự kiến thu hoạch khi nào?',
  },
];

export function DemoChat({ accountId }: { accountId: string }) {
  const { conversationId } = useParams();
  const room = rooms.find((item) => item.id === conversationId);
  return (
    <>
      <h1>Tin nhắn</h1>
      <p className="muted">Cuộc trò chuyện mẫu · Tin nhắn được lưu trong phiên trình duyệt.</p>
      <div className={room ? 'messenger has-room' : 'messenger'}>
        <aside className="panel messenger-list">
          <h2>Cuộc trò chuyện</h2>
          {rooms.map((item) => (
            <NavLink className="room-link" key={item.id} to={'/chat/' + item.id}>
              Lúa {item.crop}
              <small>Báo giá {item.offer}</small>
            </NavLink>
          ))}
        </aside>
        {room ? (
          <>
            <DemoThread
              key={accountId + room.id}
              storageKey={'agri-demo-chat:' + accountId + ':' + room.id}
              room={room}
            />
            <aside className="panel messenger-details">
              <h2>Thông tin trao đổi</h2>
              <p>Giống lúa · {room.crop}</p>
              <p>Báo giá {room.offer} · Đã chấp nhận</p>
            </aside>
          </>
        ) : (
          <section className="panel messenger-empty">
            <h2>{conversationId ? 'Không tìm thấy phòng mẫu' : 'Chọn cuộc trò chuyện'}</h2>
          </section>
        )}
      </div>
    </>
  );
}

function DemoThread({ storageKey, room }: { storageKey: string; room: (typeof rooms)[number] }) {
  const [messages, setMessages] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
      return Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState('');
  return (
    <section className="panel messenger-thread">
      <Link className="messenger-back" to="/chat">
        ← Cuộc trò chuyện
      </Link>
      <h2>Trao đổi về lúa {room.crop}</h2>
      <div className="messages" role="log">
        <article className="bubble">{room.opening}</article>
        {messages.map((message, i) => (
          <article key={i} className="bubble mine">
            {message}
          </article>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          const next = [...messages, draft.trim()];
          sessionStorage.setItem(storageKey, JSON.stringify(next));
          setMessages(next);
          setDraft('');
        }}
      >
        <label>
          Tin nhắn
          <textarea
            maxLength={2000}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
        <button disabled={!draft.trim()}>Gửi tin nhắn</button>
      </form>
    </section>
  );
}
