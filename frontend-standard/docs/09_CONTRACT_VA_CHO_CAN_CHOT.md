# Nguồn chuẩn và các điểm phải xác minh

## Nguồn dùng để dựng bộ khung

- Repo GitHub tại commit `068cf515a651bbd8bbc082ac24354680f44b51bb`: UI reference V5, không có package.json/app React trước thay đổi này.
- `project/docs/CONTRACT_CHUNG_MVP_v1.md` tuy tên v1 nhưng nội dung **MVP v2.1**: UUID, Gateway, Payment chứa Contract, Kafka, token trong RAM, quyền/state đã chốt.
- `code/docs/specs/01-trading-service.md`, `04-users-service.md`, `03-notification-service.md`: endpoint/DTO User, Feed, Offer và Notification.
- OpenAPI Chat/Payment và các spec liên quan được copy vào `reference/contracts/`; xem provenance để biết snapshot. Tài liệu là baseline, chưa phải bằng chứng service đã chạy đúng.
- `CONTRACT_IMPACT.md` + design-tokens V5 ở root repo: hướng thiết kế và giới hạn API của prototype.

Không lấy `PROJECT_CONTEXT_HE_THONG_QUAN_LY_CAY_TRONG.md` cũ làm chuẩn khi mâu thuẫn: bản đó còn Long ID/Contract Service riêng/RabbitMQ/quy tắc chỉ một Offer accept/không reputation. Baseline mới có UUID, Payment module, Kafka, có thể accept nhiều Offer, reputation nội bộ và xử lý dispute.

## Các quy tắc đã chốt phải giữ

1. Farmer tạo Plot/Season/Listing; Trader không đăng Listing. Một Plot chỉ một Listing OPEN theo contract. Snapshot từ Farming, không tin owner/GPS client khai.
2. Farmer có thể accept nhiều Offer. Chỉ OFFER_ACCEPTED mới tạo phòng; POST Offer chưa có Chat.
3. Trader tạo Contract; Farmer accept. Chỉ sau cọc **mô phỏng 5%** và backend chốt độc quyền mới ACTIVE/LOCKED.
4. Tiền mua lúa thanh toán ngoài app. App không có logistics/shipper/tracking hay thanh toán toàn bộ tiền lúa.
5. deliveryDate+24h không tự complete/cộng điểm; rút còn điều kiện dispute/state backend.
6. Không public reputation/rating/review/contact riêng hoặc badge chưa được duyệt. Admin có quyền xử lý theo endpoint, không tự đọc mọi phòng Chat.
7. Contract enum hiện tại CREATED, PENDING_DEPOSIT, ACTIVE, COMPLETED, CANCELLED; không dùng DRAFT/PENDING_FARMER_ACCEPT trong prototype cũ làm payload.

## Điểm còn thiếu/chưa đủ căn cứ để code API

| Điểm                                                   | Bộ khung hiện làm                                            | Người cần xác minh                           |
| ------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------- |
| Bán kính Feed request dùng km hay mét                  | Mock ghi rõ km; api mode không gắn nhãn đơn vị đoán          | Trading BE, kiểm Swagger/implementation      |
| Feed DTO không có giá/ảnh/status                       | Card chỉ hiện seedType, vị trí, farmer, distance             | Trading nếu muốn mở rộng DTO                 |
| expectedPrice / Offer.price là đơn vị kinh tế gì       | Không hiển thị /kg và chưa làm form Offer                    | Nhóm BA + Trading/Payment                    |
| Listing list/detail và Farmer public feed              | Chỉ placeholder MyListings, không gọi endpoint chưa xác minh | Trading BE                                   |
| Media/caption Listing                                  | Chưa làm upload Listing                                      | BA + Trading, không lấy Chat upload dùng lại |
| OpenAPI evidence path/field có thể khác baseline prose | Chỉ lưu snapshot, chưa tạo Payment API adapter               | Hưng + Gateway, đối chiếu controller/runtime |
| STOMP destination và event payload cụ thể              | Chưa viết socket client                                      | Hưng + Gateway                               |
| User refresh, OTP và Retry-After                       | Chưa làm đầy đủ; 401 hiện về Login                           | User owner                                   |
| Gateway thực tế và deployment URL                      | .env.example chỉ local, không giả URL production             | Gateway/deployment owner                     |

Issue API nên có: method/path + role/ownership + query/body/schema + ví dụ success + lỗi + page/cursor + nguồn Swagger/commit. Khi thay contract, cập nhật **một package shared**, kiểm lại cả hai app. Không chờ các điểm trên để code UI/layout độc lập; chỉ dừng lời gọi API bị thiếu contract.
