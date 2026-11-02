# Nguồn snapshot nghiệp vụ

Ngày sao chép: 02/11/2026 (Asia/Ho_Chi_Minh). Đây là tài liệu nội bộ nhóm, không phải secret/env.

| File trong folder này | Nguồn tương đối từ workspace môn học | SHA-256 |
|---|---|---|
| CONTRACT_CHUNG_MVP_v2.1.md | `project/docs/CONTRACT_CHUNG_MVP_v1.md` | `ec6deda82eb6add983f99ab2650b71ca1b66dce3821eb8eb0ee7bff825b141b9` |
| 01-trading-service.md | `code/docs/specs/01-trading-service.md` | `4dc5f1ef6c00445edcdbcf477a2fb532afc4c73c4f1ab3cc5b8473f7a72fc5e5` |
| 04-users-service.md | `code/docs/specs/04-users-service.md` | `a8846322edcf82f836b434237f79ca287e15fa96558121b9bba862a4c993d06f` |
| 03-notification-service.md | `code/docs/specs/03-notification-service.md` | `6b63388371cf37f4289532bc0ead324d98f57f6e1d75ebd9f3f6277e272374aa` |
| openapi-chat.yaml | `code/docs/specs/openapi-chat.yaml` | `7ecc729d1a666c2322bcaf0f64fd3704aa9b202403e3281f849c76fd8e54e625` |
| openapi-payment.yaml | `code/docs/specs/openapi-payment.yaml` | `d7e59c8c6836a1cd09990d5b456cba7fb8e1404147b9f6bc635b54c475e050b1` |

Snapshot được giữ nguyên nội dung, trừ tên file Contract chung để phản ánh đúng v2.1. Khi backend đổi API, cập nhật snapshot và adapter ở PR cùng scope. Spec prose cũ có thể có đoạn lịch sử; ưu tiên baseline v2.1 và implementation/OpenAPI đã xác minh. Các tài liệu reference không bị Prettier sửa để giữ hash.
