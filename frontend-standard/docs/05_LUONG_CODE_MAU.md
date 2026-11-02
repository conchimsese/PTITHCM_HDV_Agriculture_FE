# Một ví dụ code xuyên từ UI tới API

Ví dụ được viết sẵn: **Thương lái xem Listing Feed theo GPS**. Đây là mẫu để cả nhóm bắt chước cách tổ chức code, chưa có gửi Offer hay chi tiết Listing vì scope ví dụ chỉ là danh sách.

## Các file thật cần mở

| Bước             | Web                                                       | Mobile                                                           | Dùng chung                           |
| ---------------- | --------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| Màn hình         | `apps/web/src/features/trading/pages/MarketplacePage.tsx` | `apps/mobile/src/features/trading/screens/MarketplaceScreen.tsx` | —                                    |
| Thẻ dữ liệu      | `.../components/ListingCard.tsx`                          | `.../components/ListingCard.tsx`                                 | DTO ListingFeedItem                  |
| Lấy dữ liệu      | `.../hooks/useListingFeed.ts`                             | `.../hooks/useListingFeed.ts`                                    | params cùng FeedParams               |
| Chọn client      | `apps/web/src/shared/api/runtime.ts`                      | `apps/mobile/src/shared/api/runtime.ts`                          | factory API                          |
| Request thật     | —                                                         | —                                                                | `packages/api-client/src/trading.ts` |
| Fetch/auth/error | —                                                         | —                                                                | `packages/api-client/src/http.ts`    |
| DTO/validate     | —                                                         | —                                                                | `packages/contracts/src/trading.ts`  |
| Dữ liệu giả      | —                                                         | —                                                                | `packages/api-client/src/mock.ts`    |

Luồng đọc: form GPS → validate FeedParams → hook → Query key có accountId/filter → TradingApi → mock hoặc GET `/api/v1/listings/feed` → Zod parse → UI. Backend errors trở thành ApiError, UI báo lỗi và có retry. Request cũ có AbortSignal khi filter đổi. Component không biết nguồn mock/API.

## Thử tay nhanh

1. Chọn Thương lái ở web và mobile, mở Thị trường. Vị trí mẫu `10.125,106.45`, radius `15` thấy hai ruộng gần nhất; radius `50` thấy ba, size=2 để thử Trang sau.
2. Đổi vĩ độ thành `0`, kinh độ `0`, radius `1`: empty-state.
3. Nhập radius bằng `0`/âm/không phải số: validation chặn trước request.
4. Mở Farmer: không có mục Thị trường. Web gõ `#/marketplace` không mở được; API thật vẫn cần backend kiểm role.
5. Đăng xuất, chọn Admin: cache của Trader bị clear; chỉ xem Feed theo quyền đọc, không tự có quyền Chat.
6. Chuyển api mode và backend tắt: Login/Feed báo network error, không hiện dữ liệu mẫu.

## Nhân bản cho tính năng danh sách ruộng

1. Tạo `packages/contracts/src/farming.ts` chứa PlotDto schema + Page, dựa Swagger/response đã xác minh.
2. Tạo `packages/api-client/src/farming.ts` với `createFarmingApi(http).getPlots(params,signal)`, export qua index.ts. Không copy URL host vào feature.
3. Thêm `farmingApi` trong runtime của từng app, mock riêng tuân cùng interface.
4. Tạo `features/farming/hooks/usePlots.ts`; key `['farming','plots',accountId,params]`.
5. Web tạo `pages/PlotListPage.tsx`; mobile tạo `screens/PlotListScreen.tsx` dùng FlatList. Mỗi app có PlotCard riêng.
6. Thay placeholder `plots` tại routes/navigator bằng màn mới. Thêm typed params nếu mở detail.
7. Kiểm không có ruộng/loading/error/retry/pagination/403 trước PR. Sau đó mới thêm create/edit.

Trong ví dụ, hai hook nhỏ giống nhau có chủ ý vì mỗi app có vòng đời/cache/env riêng. Khi nhiều hook thực sự giống nhau, nhóm có thể tạo package hooks; chưa cần chia abstraction trước khi có nhu cầu. Không copy DTO/API thành hai bản vì đây là nơi rất dễ sai khi backend thay đổi.
