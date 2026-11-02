# Chạy hai nền tảng và cấu hình môi trường

## Cài và chạy

Từ `frontend-standard`: `npm ci`. Dùng Node 22.13+ / Node 24 LTS. Chỉ dùng npm để giữ lockfile thống nhất.

| Mục tiêu            | Lệnh                           | Kết quả                             |
| ------------------- | ------------------------------ | ----------------------------------- |
| Web dev             | `npm run dev:web`              | Trình duyệt localhost:5173          |
| Web production      | `npm run build:web`            | `apps/web/dist`                     |
| Xem web đã build    | `npm run preview -w @agri/web` | localhost:4173, chỉ để xem local    |
| Mobile Metro        | `npm run dev:mobile`           | QR Expo, app native trên điện thoại |
| Android Emulator    | `npm run dev:android`          | Expo mở trên emulator đang chạy     |
| Kiểm bundle Android | `npm run export:android`       | `apps/mobile/dist`; không phải APK  |

Expo SDK/RN/React được pin theo template chính thức và lockfile. Kiểm phiên bản bằng `npx expo install --check` tại `apps/mobile`. Không upgrade từng package Expo một cách rời rạc.

## Chuyển từ mock sang backend

1. Copy `.env.example` thành `.env` **trong từng app**.
2. Web: đặt `VITE_DATA_SOURCE=api`, `VITE_GATEWAY_URL=http://localhost:8080`.
3. Mobile: đặt `EXPO_PUBLIC_DATA_SOURCE=api`, URL Gateway đúng thiết bị bên dưới.
4. Restart Vite; với Expo có thể chạy `npx expo start --clear` sau khi sửa env.
5. Đăng nhập tài khoản ACTIVE thật qua màn Login. Không còn nút chọn role demo trong api mode. Role lấy từ TokenPair, backend vẫn kiểm quyền từng request.

| Nơi chạy client                   | Gateway trong lúc dev                                           |
| --------------------------------- | --------------------------------------------------------------- |
| Trình duyệt trên máy chạy backend | `http://localhost:8080`                                         |
| Android Emulator tiêu chuẩn       | `http://10.0.2.2:8080`                                          |
| Điện thoại Android thật cùng LAN  | `http://<IPv4-LAN-máy-backend>:8080`                            |
| Máy khác qua mạng                 | URL backend có thể truy cập từ máy đó                           |
| Deploy web                        | Cùng HTTPS origin; có thể `VITE_GATEWAY_URL=` để dùng `/api/v1` |
| Deploy mobile                     | HTTPS Gateway public thực tế, cấu hình trước khi build          |

Điện thoại dùng `localhost` là trỏ chính điện thoại. Tìm IPv4 Wi-Fi/Ethernet bằng `ipconfig`, không lấy IP adapter Docker/VPN. Máy backend cần bind đúng interface và Windows Firewall cho phép cổng cần dùng trong mạng tin cậy. Expo tunnel chỉ giúp tới Metro, không tự đưa Gateway lên internet. Native không dùng CORS trình duyệt; web dev Gateway cần allowlist đúng `http://localhost:5173`.

`VITE_*` và `EXPO_PUBLIC_*` được đưa vào bundle, chỉ chứa URL/chế độ public. Không đặt JWT private key, service key, mật khẩu DB hay tài khoản Admin trong env frontend. Không commit `.env`.

## Thêm thư viện

- Web: tại root `npm install <package> -w @agri/web`.
- Native package cần SDK tương thích: `cd apps/mobile`, `npx expo install <package>`. Commit lockfile root.
- DTO/runtime dùng chung: `npm install <package> -w @agri/contracts` hoặc `@agri/api-client`.
- Tool phát triển chung: `npm install -D <package>` tại root.

## Tạo APK để nộp môn

Repo đã có `apps/mobile/eas.json` profile preview tạo APK. Khi sẵn sàng, người phụ trách build cấu hình tài khoản Expo/EAS và Android signing, rồi tại app mobile chạy:

```powershell
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

Đây là bước build sau khi nhóm có tài khoản/cấu hình và kiểm app trên thiết bị; scaffold chưa tạo APK, chưa upload store, chưa tạo tài khoản Expo. EAS có thể yêu cầu quota/gói tài khoản tùy dịch vụ. Có thể build Android local bằng Android SDK/JDK và hướng dẫn Expo. Build native iOS local cần macOS/Xcode; với môi trường Windows của nhóm, ưu tiên demo **web trên PC + app Android trên điện thoại/emulator** để chứng minh hai platform.

Tham khảo: [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [Expo Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/), [APK build](https://docs.expo.dev/build-reference/apk/).
