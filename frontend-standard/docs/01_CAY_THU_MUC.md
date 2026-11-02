# Cây thư mục và nơi đặt code

Đây là kiến trúc **một repo, hai ứng dụng**. Mỗi app chạy/build độc lập; workspace dùng chung kiểu dữ liệu và hạ tầng gọi API. Các thư mục `pages/screens/components/hooks` có README hoặc code mẫu; thư mục chưa làm không có CRUD giả.

```text
PTITHCM_HDV_Agriculture_FE/
├── ui-reference-v5/                                 # toàn bộ mẫu HTML/CSS/JS, assets và preview V5
├── .github/workflows/frontend-standard.yml           # CI cho workspace
└── frontend-standard/
    ├── README.md
    ├── docs/                                         # chuẩn nhóm + bàn giao
    ├── reference/contracts/                          # snapshot nghiệp vụ/OpenAPI
    ├── templates/                                    # mẫu issue/feature/PR
    ├── package.json                                  # npm workspaces + lệnh chung
    ├── package-lock.json                             # duy nhất một lockfile
    ├── tsconfig.base.json
    ├── eslint.config.mjs, .prettierrc.json
    ├── vitest.config.ts
    ├── apps/
    │   ├── web/
    │   │   ├── package.json, vite.config.ts, index.html, .env.example
    │   │   └── src/
    │   │       ├── main.tsx                           # mount React DOM
    │   │       ├── app/App.tsx                        # providers + routes theo role
    │   │       ├── pages/DashboardPage.tsx            # tổng hợp nhiều domain
    │   │       ├── features/
    │   │       │   ├── users/{pages,components,hooks}
    │   │       │   ├── farming/{pages,components,hooks}
    │   │       │   ├── trading/{pages,components,hooks}
    │   │       │   ├── chat/{pages,components,hooks}
    │   │       │   ├── payments/{pages,components,hooks}
    │   │       │   ├── notifications/{pages,components,hooks}
    │   │       │   └── admin/{pages,components,hooks}
    │   │       ├── shared/
    │   │       │   ├── api/runtime.ts                 # tạo client/cache cho web
    │   │       │   ├── config/env.ts                  # chỉ đọc VITE_* tại đây
    │   │       │   ├── layouts/WebLayout.tsx          # sidebar/header/outlet
    │   │       │   └── ui/                            # Button, Modal... không nghiệp vụ
    │   │       └── styles/global.css                  # token CSS + base styles
    │   └── mobile/
    │       ├── package.json                           # main: expo-router/entry
    │       ├── app.json, eas.json, metro.config.cjs, .env.example
    │       └── src/
    │           ├── app/                               # chỉ route files của Expo Router
    │           │   ├── _layout.tsx                    # providers + auth guard
    │           │   ├── login.tsx
    │           │   └── (protected)/                  # native stack sau đăng nhập
    │           │       ├── _layout.tsx, index.tsx
    │           │       └── feature/[moduleId].tsx
    │           ├── screens/HomeScreen.tsx            # home tổng hợp module
    │           ├── features/
    │           │   ├── users/{screens,components,hooks}
    │           │   ├── farming/{screens,components,hooks}
    │           │   ├── trading/{screens,components,hooks}
    │           │   ├── chat/{screens,components,hooks}
    │           │   ├── payments/{screens,components,hooks}
    │           │   ├── notifications/{screens,components,hooks}
    │           │   └── admin/{screens,components,hooks}
    │           └── shared/{api,config,ui}             # thành phần native dùng chung
    └── packages/
        ├── contracts/src/                            # schema/DTO/status/role
        ├── api-client/src/                           # http/auth/trading/mock/session
        └── design-tokens/src/                        # giá trị thuần TS, không DOM/RN
```

## Một file mới phải nằm ở đâu?

| Bạn định viết                          | Đặt tại                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Trang danh sách ruộng trên trình duyệt | `apps/web/src/features/farming/pages/PlotListPage.tsx`                                                   |
| Màn danh sách ruộng trên điện thoại    | `apps/mobile/src/features/farming/screens/PlotListScreen.tsx`                                            |
| Thẻ ruộng web/native                   | `features/farming/components/PlotCard.tsx` trong từng app                                                |
| usePlots lấy và cache dữ liệu          | `features/farming/hooks/usePlots.ts` trong từng app                                                      |
| PlotDto, CreatePlotRequest, schema     | `packages/contracts/src/farming.ts` rồi export trong index.ts                                            |
| Lời gọi /api/v1/plots                  | `packages/api-client/src/farming.ts` rồi export, không gọi fetch ở page                                  |
| Button/Dialog không biết Plot/Offer    | `shared/ui` trong app tương ứng                                                                          |
| Card hợp đồng trong Chat               | Payment sở hữu DTO/logic; UI card có thể ở payments/components, Chat import public component đó có chủ ý |
| Màu dùng ở cả hai nền tảng             | `packages/design-tokens`; web map sang CSS variables, native StyleSheet                                  |
| Số liệu dashboard tổng hợp             | `pages` web / `screens` mobile; không cho shared/ui gọi nhiều API                                        |

## Quy tắc phụ thuộc

`app → page/screen → feature component/hook → api-client → contracts`.

- `shared/ui` không import feature. `packages` không import app hay biến VITE/EXPO.
- Hai app không import lẫn nhau. Không share JSX/HTML/CSS sang native.
- Code DTO không phụ thuộc React. API client không phụ thuộc Expo Router, React Router hay browser storage.
- Feature không tùy tiện chọc vào hook/state nội bộ feature khác. Dashboard được tổng hợp qua API/hook công khai.
- Không dựng micro frontend/sáu app FE tương ứng sáu service. Hai client cùng gọi một Gateway; backend tự định tuyến.

Trong `payments`, có thể thêm thư mục con `contracts/`, `deposits/`, `disputes/` khi module lớn lên. Không tạo một app hay backend Contract Service mới. Cấu trúc này là baseline để bắt đầu, không bắt nhóm tạo hàng chục file rỗng trước khi làm một màn hình.
