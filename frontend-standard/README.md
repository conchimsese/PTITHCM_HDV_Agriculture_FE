# Chuẩn frontend nhóm — Ruộng Lúa Việt

**Bắt đầu ở folder này.** Repo gốc đang là mẫu HTML/CSS/JS V5. Folder `frontend-standard/` là bộ khung để phát triển sản phẩm: **web React/Vite** và **ứng dụng mobile React Native/Expo** độc lập, dùng chung backend SOA qua API Gateway. Mobile là native app, không phải trang web responsive hay WebView bọc HTML.

## 1. Chạy thử ngay

Cài Node.js 22.13+ (khuyến nghị Node 24 LTS), npm đi kèm. Mở terminal tại `frontend-standard`:

```powershell
npm ci
npm run dev:web
```

Web: `http://localhost:5173`. Chọn **Thương lái → Thị trường** để xem luồng mẫu có lọc, phân trang, loading/error/empty. Mặc định dùng dữ liệu giả, không cần backend, không nhập tài khoản thật.

Mở terminal thứ hai, vẫn ở `frontend-standard`:

```powershell
npm run dev:mobile
```

Dùng Expo Go tương thích SDK trong `apps/mobile/package.json` và quét QR trên điện thoại cùng mạng LAN. Hoặc mở Android Emulator rồi chạy `npm run dev:android`. Nếu Expo Go báo SDK không tương thích, cập nhật Expo Go phù hợp hoặc dùng development build theo docs/02; không tự nâng riêng React Native.

Không chạy `npm install` riêng từng app; cả nhóm dùng **một package-lock.json ở root folder này**. Hai app có thể chạy song song, mobile dùng Metro riêng.

## 2. Đọc theo thứ tự

| File                                                                  | Dùng để làm gì                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| [00_BAT_DAU.md](docs/00_BAT_DAU.md)                                   | Hướng dẫn 30 phút đầu cho thành viên mới              |
| [01_CAY_THU_MUC.md](docs/01_CAY_THU_MUC.md)                           | Cây thư mục, trách nhiệm từng tầng, file phải đặt đâu |
| [02_CHAY_WEB_MOBILE.md](docs/02_CHAY_WEB_MOBILE.md)                   | Web, Android, điện thoại thật, env, APK               |
| [03_QUY_UOC_CODE.md](docs/03_QUY_UOC_CODE.md)                         | Cách viết page/screen, component, hook, API, state    |
| [04_MODULES_VA_CHIA_VIEC.md](docs/04_MODULES_VA_CHIA_VIEC.md)         | Module/màn hình theo vai trò, ownership, thứ tự làm   |
| [05_LUONG_CODE_MAU.md](docs/05_LUONG_CODE_MAU.md)                     | Lần theo một ví dụ thật trên cả hai nền tảng          |
| [06_API_AUTH_REALTIME.md](docs/06_API_AUTH_REALTIME.md)               | Gateway, auth, lỗi, tiền, upload, WebSocket           |
| [07_GIT_PR_CHECKLIST.md](docs/07_GIT_PR_CHECKLIST.md)                 | Nhánh, commit, PR, tiêu chí hoàn thành                |
| [08_CHUYEN_MAU_V5.md](docs/08_CHUYEN_MAU_V5.md)                       | Tách prototype V5 thành code sản phẩm từng bước       |
| [09_CONTRACT_VA_CHO_CAN_CHOT.md](docs/09_CONTRACT_VA_CHO_CAN_CHOT.md) | Nguồn chuẩn và những API chưa rõ, tránh tự đoán       |
| [10_KIEM_THU_VA_BAN_GIAO.md](docs/10_KIEM_THU_VA_BAN_GIAO.md)         | Kịch bản kiểm tra và giới hạn đã xác minh             |

## 3. Đã làm và chưa làm

**Đã có code:** hai app riêng; login demo theo vai trò; adapter login/logout API; phiên/token trong RAM; menu theo role; màn thị trường trên web và native; DTO Zod kiểm response; API client dùng chung; mock GPS; cache theo account; cấu hình TypeScript/ESLint/Prettier; test API client; CI.

**Chưa triển khai:** CRUD Farming, Listing/Offer, chat/STOMP, hợp đồng/cọc/tranh chấp, Notification/Profile/Admin thật; OTP/register/refresh tự động; upload; bản APK đã ký. Menu các module này mở màn **CHƯA TRIỂN KHAI**, không giả vờ đã có dữ liệu thật. API mode chưa được kiểm với backend nhóm.

Mobile scaffold có đủ entry point/navigator/native screen để tiếp tục phát triển. `expo export` chỉ kiểm bundle JavaScript Android; không thay kiểm trên thiết bị và không tạo APK.

## 4. Quyết định kiến trúc

- Web UI: React DOM + CSS, React Router. Mobile UI: View/Text/FlatList + StyleSheet, Expo Router native stack. Không import UI web vào native.
- Dùng chung `packages/contracts` (DTO/validation), `packages/api-client` (fetch/auth/mock), `packages/design-tokens` (màu/khoảng cách). Mỗi app có cấu hình env và hook cache riêng.
- Feature theo nghiệp vụ, cùng cách đặt tên ở hai app: `users`, `farming`, `trading`, `chat`, `payments`, `notifications`, `admin`. **Contract/Deposit/Dispute nằm trong payments.**
- Nguồn nghiệp vụ: Contract chung MVP v2.1 trong `reference/contracts/`, không lấy hành vi demo V5 làm API contract.
- Giữ mẫu V5 ở `ui-reference-v5/` để đối chiếu UI; code mới nằm trong folder này. Khi nhóm chuyển hoàn toàn, có thể chuyển workspace này lên root trong PR riêng.

## 5. Lệnh kiểm tra

```powershell
npm run check
npm run format:check
npm run test:web
npm run export:android
```

Tham chiếu kỹ thuật chính thức: [Expo monorepo](https://docs.expo.dev/guides/monorepos/), [Expo Router](https://docs.expo.dev/router/introduction/), [Vite](https://vite.dev/guide/), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/quick-start).
