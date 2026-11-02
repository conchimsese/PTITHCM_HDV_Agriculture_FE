# Giao tiếp backend, auth và realtime

## Gateway và dữ liệu

Client chỉ gọi Gateway `/api/v1/**`; không gọi các cổng service 8081… trực tiếp, không gọi `/internal/**`, không biết Kafka/database/service key. Request JWT dùng `Authorization: Bearer`, `credentials: omit`. Không gửi x-user-id/x-user-role làm bằng chứng quyền. Gateway/backend kiểm JWT + ACTIVE + ownership là nguồn quyết định.

- UUID string xuyên API; JSON camelCase. UI được dịch nhãn nhưng giữ nguyên enum/API field.
- Success trả DTO trực tiếp; 204 không parse JSON. Error `{timestamp,status,code,message,path,traceId?}`.
- Page-based `{items,page,size,totalElements,totalPages}`, page bắt đầu 0; size<=100. Feed chỉ lat/lng/radius/page/size.
- Chat/Payment endpoint cursor giữ cursor opaque; không tự đổi thành page hoặc lấy mẫu CursorPage dùng cho mọi endpoint. Kiểm OpenAPI từng response.
- UTC ISO8601 từ backend, hiển thị theo Asia/Ho_Chi_Minh. Gửi lại ISO có offset/UTC, không cắt chuỗi mất timezone.
- Tiền là decimal string, ví dụ `"4600000.00"`, VND; backend tính cọc 5% và làm tròn. Không tự ghi ACTIVE/RELEASABLE dựa trên phép tính client.

## Auth hiện có

`createAuthApi` có login `{username,password}` và logout `{refreshToken}`. TokenPair được Zod validate, giữ trong memory store; UI role từ response. Demo session không có JWT và chỉ xuất hiện ở mock mode. Reload/hủy app cần login lại. Không dùng localStorage/sessionStorage/cookie/AsyncStorage cho token ở baseline.

`401` ở protected request: runtime xóa phiên/cache, trở lại Login. Không tự refresh ở bộ khung này. Đây là lựa chọn đơn giản để ví dụ chạy rõ ràng, **chưa hoàn thành yêu cầu refresh single-flight** của contract. Issue User cần bổ sung:

1. Một promise refresh dùng chung trong mỗi app, POST `/api/v1/auth/refresh` body refreshToken.
2. Rotate toàn bộ TokenPair trong RAM sau thành công; bỏ kết quả nếu account đã logout/đổi phiên.
3. GET có thể retry một lần sau refresh; mutation cần endpoint/idempotency rõ ràng trước khi retry, không nạp cọc hai lần.
4. Refresh lỗi thì clear session/cache/socket. Reconnect Chat bằng token mới.

Không log token/password/OTP; không đưa chúng vào URL, route params hay thông báo lỗi. Logout server lỗi vẫn xóa phiên local và báo chưa xác nhận thu hồi; refresh token phía server chưa chắc đã bị revoke.

## Mã lỗi phải xử lý

| HTTP    | FE cần làm                                                                                 |
| ------- | ------------------------------------------------------------------------------------------ |
| 400     | validation/form field; không retry vô hạn                                                  |
| 401     | login/refresh theo policy ở trên                                                           |
| 403     | báo không có quyền/account chưa ACTIVE; không chuyển vai trò để vượt                       |
| 404     | không tìm thấy/không được phép biết resource; không lộ dữ liệu cache                       |
| 409     | refetch resource, hiển thị state conflict; không tự coi thành công                         |
| 413/415 | ảnh quá dung lượng/không đúng định dạng                                                    |
| 429     | tôn trọng Retry-After khi hoàn thiện OTP/login, không auto retry liên tục                  |
| 503     | dependency/access-state chưa xác định, hiển thị có thể thử lại; không fallback dữ liệu giả |

Client mẫu chưa chuẩn hóa UI countdown Retry-After, upload binary hay timeout mặc định; cần triển khai ở issue tương ứng. Query có tối đa một retry cho lỗi ngoài danh sách 401/403/404/409/429; mutation không retry tự động.

## Upload riêng tư — cần làm ở module tương ứng

MVP ảnh JPEG/PNG/WebP <=5 MiB, tối đa 20 MP backend kiểm. Upload `FormData`, **không set Content-Type multipart thủ công** để runtime tự thêm boundary. Mẫu `http.ts` hiện chỉ JSON: bổ sung method upload/download riêng, không truyền FormData qua JSON.stringify.

- Avatar: `/api/v1/users/me/avatar`; Chat: conversations/{id}/media; evidence: Payment dispute API đúng OpenAPI.
- Download private dùng Bearer. Web fetch blob → URL.createObjectURL → revoke lúc unmount/logout; native chọn cơ chế image loader/temporary file có header theo thư viện dùng thực tế.
- Không gắn JWT trong URL ảnh; không chấp nhận URL ngoài tùy ý làm attachment hợp lệ. IMAGE message chỉ gửi reference upload Chat trả về, đúng conversation/uploader.
- Snapshot OpenAPI và contract có thể khác tên field evidence URL; xem docs/09, đối chiếu BE trước khi viết adapter.

## Realtime Chat — chưa có client trong scaffold

Backend Chat dùng STOMP/WebSocket tại `/ws/chat`, Bearer ở **CONNECT frame**, không query URL. FE cần đối chiếu destination SUBSCRIBE/SEND và các event trong OpenAPI/source Chat trước khi code; không tự phát minh topic.

Luồng: load room history REST → CONNECT/SUBSCRIBE room hợp lệ → nhận message/read/contract update → merge theo messageId (dedup) → cập nhật cache/badge. Cursor lịch sử khác thứ tự render: API mới nhất trước, UI cần kiểm thứ tự theo createdAt/ID. Reconnect/token hết hạn phải xác thực lại, hủy subscribe/socket khi logout hoặc đổi account. Đồng bộ lại history khi mất kết nối để không bỏ sót tin.

Chat unread lấy Chat API/read events; Notification unread lấy Notification API. Không cộng lẫn hai badge. REST gửi text/image giữ schema riêng theo backend thực tế; không suy `/messages/image` giống POST text. Admin không mặc nhiên được xem Chat participant.
