# Kiểm thử và bàn giao

`npm run test:web` chạy hai kịch bản trình duyệt tự động bằng Playwright. Lần đầu cần `npx playwright install chromium`; test tự mở Vite mock tại cổng 5183 rồi đóng server, không cần chạy dev server trước. Đây là test **web**, không phải kiểm native mobile. Ảnh chụp/test artifacts nằm trong folder bị gitignore.

## Tự động

`npm run check`: typecheck từng workspace, ESLint, test chung, production build web. `npm run format:check` kiểm format. `npm run export:android` tạo native JS bundle; không build binary/khởi chạy emulator.

Test tập trung ở API client/contract để bắt lỗi thật: Authorization/credentials, chặn đường dẫn internal, 204, schema không khớp, lỗi HTTP/network, validation query, mock lọc/phân trang. Không viết test chỉ để kiểm các folder rỗng có tồn tại.

CI `.github/workflows/frontend-standard.yml` chạy npm ci + checks + format + Android export. Kiểm native trước nộp vẫn cần thiết bị/emulator vì JS bundle không phát hiện mọi lỗi native runtime, bàn phím và permission.

## Các kịch bản nhóm phải kiểm trên hai nền tảng

| Luồng                             | Kết quả cần đạt                                                          |
| --------------------------------- | ------------------------------------------------------------------------ |
| Mock Trader → Feed                | danh sách/filter/pagination/empty đúng                                   |
| Mock Farmer gõ URL Feed           | bị chặn trên UI; backend kiểm tiếp trong api mode                        |
| Logout/đổi role/account           | không giữ dữ liệu/cache/socket của account cũ                            |
| API Login/invalid password/LOCKED | hiển thị lỗi đúng, không có demo role switch                             |
| Feed 401/403/503                  | login lại hoặc báo lỗi; không fallback mock                              |
| Response sai schema/ID            | hiện lỗi contract thay vì crash hoặc hiện dữ liệu sai                    |
| Hai app đọc cùng API              | field/status/format tiền/UTC thống nhất                                  |
| Android thật                      | safe area, keyboard, back, font scaling, mạng LAN                        |
| Web                               | desktop/tablet, focus bàn phím, zoom, navigation                         |
| Toàn nghiệp vụ sau khi hoàn thiện | Farming → Listing → Offer → Chat → Contract → Deposit → Complete/Release |
| Conflict hai Trader               | backend chỉ một winner, FE refetch/hiển thị 409                          |
| Dispute đang mở                   | không cho client tự rút dựa đồng hồ máy                                  |

## Trạng thái xác minh của lần dựng khung

Kết quả lệnh và giới hạn kiểm tra được ghi trong `VERIFICATION.md` sau khi chạy. Không coi việc có doc/OpenAPI là toàn hệ thống đã triển khai; không đánh dấu APK/thiết bị/backend end-to-end đã pass nếu chưa chạy thực tế.
