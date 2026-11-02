# Thành viên mới bắt đầu từ đây

1. Clone repo, checkout nhánh có `frontend-standard`, vào folder này và chạy `npm ci`.
2. Chạy web và mobile theo README. Xem cùng luồng Thương lái → Thị trường trên hai app.
3. Đọc cây thư mục và ví dụ code. Mở `apps/web/src/features/trading` cạnh `apps/mobile/src/features/trading` để thấy phần UI khác nhau.
4. Nhận một module và một lát nghiệp vụ nhỏ từ bảng chia việc; ghi tên owner vào issue. Chưa có dữ liệu phân công đầy đủ nên tài liệu không tự gán Phong hay thành viên khác.
5. Đối chiếu request/response với owner backend. Có thiếu endpoint thì ghi vào issue trước; chưa nối API thì vẫn có thể làm UI bằng mock riêng, ghi rõ đang mock.
6. Tạo nhánh `feat/<module>-<noi-dung>`, làm DTO/API dùng chung trước, rồi web, rồi mobile. Có thể chia hai người làm UI sau khi thống nhất DTO.
7. Kiểm tra quyền, loading/error/empty/success, chạy checks, mở PR với ảnh web và mobile.

Ví dụ công việc đầu tiên: **danh sách ruộng của Farmer**, chưa nhận cả Farming. Kết quả cần có API/DTO đã đối chiếu, web page, native screen, phân trang, lỗi, màn không có ruộng. Xong phần danh sách mới nhận tạo/sửa ruộng, rồi mùa vụ.

Không copy toàn bộ `app.js` V5 vào App.tsx hoặc App.tsx mobile. Không sửa code ở `node_modules`. Chỉ sửa lockfile bằng npm. Nếu thêm thư viện native, dùng `npx expo install` tại app mobile để chọn bản phù hợp SDK.
