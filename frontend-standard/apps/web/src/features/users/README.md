# Tài khoản / Web

Chạy `npm run dev:web` tại `frontend-standard`. Route `/dang-nhap`, `/dang-ky`; route gốc chuyển đến đăng nhập. Có form responsive, chọn FARMER/TRADER, kiểm tra mật khẩu, OTP email và gửi lại mã với cooldown 60 giây. Token chỉ lưu trong bộ nhớ; reload cần đăng nhập lại. Có trạng thái đăng nhập thành công và đăng xuất, chưa có dashboard nghiệp vụ.

## Đăng nhập bằng số điện thoại hoặc email

FE chuẩn hóa số Việt Nam (+84 hoặc 0) về 0xxxxxxxxx; email trim/lowercase. Gửi `{ username: số điện thoại hoặc email, password }` tới endpoint login hiện có. Đăng ký gửi số điện thoại làm username và profile.phone, email riêng, tên profile theo role.

**Contract hiện chỉ xác nhận login qua username. Backend cần bổ sung tra cứu username HOẶC email để đăng nhập bằng Gmail/email hoạt động.** Tài khoản mới có username bằng số điện thoại nên dùng được với contract. Tài khoản cũ có username khác phone cần backend hỗ trợ tìm theo phone và xử lý số trùng. FE chưa xác nhận các khả năng này trên backend thực tế.

## Google

Sao chép `apps/web/.env.example` thành `.env.local`, cấu hình `VITE_GOOGLE_CLIENT_ID` và `VITE_GOOGLE_LOGIN_PATH`. Đường dẫn phải là endpoint Gateway `/api/v1/...` đã thống nhất với backend. Thêm origin frontend vào Authorized JavaScript origins của Google Cloud OAuth Web client. Không đặt client secret trong frontend.

Component dùng nút Google Identity Services chính thức, POST `{ credential: Google ID token }` đến endpoint đã cấu hình. Backend phải xác minh chữ ký, issuer, audience, thời hạn, trạng thái tài khoản và trả TokenPair theo schema chung. Không dùng Google ID token làm access token ứng dụng. Luồng tạo/liên kết tài khoản Google mới và chọn role cần backend quyết định, FE không tự gán role.

**Google chưa có trong contract hiện tại.** Thiếu cấu hình thì nút báo chưa kích hoạt, không giả lập thành công. SDK: https://developers.google.com/identity/gsi/web/reference/js-reference
