# Kết quả kiểm tra bộ khung

Ngày: **02/11/2026**, môi trường Windows, Node **24.18.0**, npm **12.0.1**.

| Kiểm tra                                                               | Kết quả                     |
| ---------------------------------------------------------------------- | --------------------------- |
| TypeScript — web, mobile, ba package shared                            | Pass                        |
| ESLint                                                                 | Pass                        |
| Vitest API/contract                                                    | **19/19 pass**              |
| Production build Vite                                                  | Pass                        |
| Playwright web: GPS filter/pagination/empty, chặn Farmer truy cập Feed | **2/2 pass**                |
| Prettier                                                               | Pass                        |
| Expo Android JS/Hermes bundle                                          | Pass, Expo Router entry     |
| Expo Doctor                                                            | **20/20 checks pass**       |
| Expo SDK dependency compatibility                                      | Dependencies are up to date |

Đã xem ảnh chụp màn Thị trường web ở viewport 1440×1000; không có pageerror trong kịch bản Feed. Test scope là starter/mock và API client giả lập response, chưa xác nhận backend thực tế.

Chưa kiểm: app chạy trên Android thật/emulator, native iOS, APK/signing/EAS, toàn luồng với Gateway/services của nhóm, upload/STOMP/refresh tự động. `expo export` tạo bundle, không tạo APK và không chứng minh native runtime đã pass.

`npm audit` còn cảnh báo mức moderate ở dependency tooling/transitive (glob/minimatch, lan qua Expo/ESLint); lần kiểm tra không có high/critical. Chưa áp dụng `audit fix --force` vì đề xuất downgrade khác major/SDK. Trước triển khai cần rà soát bản vá tương thích, không coi scaffold đã đạt kiểm toán bảo mật.

CI nằm ở `.github/workflows/frontend-standard.yml`: npm ci, checks, format, hai test web, bundle Android. Kết quả chạy trên GitHub xem trực tiếp ở PR/Actions; bảng trên là các lệnh đã chạy local.
