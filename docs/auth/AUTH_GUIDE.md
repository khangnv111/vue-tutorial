# Hướng dẫn sử dụng tính năng Authentication

## Tổng quan
Đã thêm 2 page hoàn chỉnh cho xác thực người dùng:
- **Login Page** (`/login`) - Đăng nhập
- **Forgot Password Page** (`/forgot-password`) - Quên mật khẩu

## 1. Login Page (`/src/views/auth/Login.vue`)

### Tính năng:
- ✅ Đăng nhập bằng tên đăng nhập hoặc email
- ✅ Xác thực form
- ✅ Ghi nhớ tên đăng nhập
- ✅ Link "Quên mật khẩu"
- ✅ Đăng nhập bằng GitHub/Google (skeleton)
- ✅ Link chuyển hướng đến trang đăng ký

### Quy trình:
1. Người dùng nhập tên đăng nhập và mật khẩu
2. Form sẽ validate:
   - Tên đăng nhập: Bắt buộc
   - Mật khẩu: Bắt buộc, tối thiểu 6 ký tự
3. Khi đăng nhập thành công:
   - Lưu `authToken` vào localStorage
   - Lưu `rememberMe` nếu user chọn
   - Chuyển hướng đến `/dashboard/workplace`

### Lưu trữ dữ liệu:
```javascript
localStorage.setItem('authToken', 'token_' + Date.now());
localStorage.setItem('rememberMe', JSON.stringify({
    username: 'username'
}));
```

## 2. Forgot Password Page (`/src/views/auth/ForgotPassword.vue`)

### Tính năng:
- ✅ 3 bước xác thực
- ✅ Xác minh email
- ✅ Nhập mã xác minh (OTP)
- ✅ Đặt lại mật khẩu mới
- ✅ Đếm ngược thời gian gửi lại mã

### Quy trình (3 bước):

#### Bước 1: Xác minh Email
- Người dùng nhập email
- Hệ thống gửi mã xác minh

#### Bước 2: Xác minh OTP
- Người dùng nhập 6 chữ số mã xác minh
- Có tùy chọn gửi lại mã (sau 60 giây)
- Khi xác minh thành công → chuyển sang bước 3

#### Bước 3: Đặt lại Mật khẩu
- Người dùng nhập mật khẩu mới
- Xác nhận mật khẩu (phải khớp)
- Khi hoàn thành → hiển thị thông báo thành công
- User có thể quay lại trang đăng nhập

## 3. Route Guard (Authentication)

### Cấu hình trong `/src/router/index.ts`:

```typescript
// Routes không cần xác thực
const publicRoutes = ['/login', '/forgot-password', '/signup'];

// Kiểm tra token từ localStorage
const authToken = localStorage.getItem('authToken');

// Logic:
// - Nếu route yêu cầu auth mà không có token → chuyển hướng đến /login
// - Nếu user đã auth mà cố truy cập /login → chuyển hướng đến /dashboard
```

## 4. Logout Functionality

### Vị trí: 
Menu dropdown ở header bên phải (`RightHeader.vue`)

### Quy trình:
1. Click vào avatar ở bên phải header
2. Chọn "Đăng xuất"
3. Hệ thống sẽ:
   - Xóa `authToken` từ localStorage
   - Xóa `rememberMe` từ localStorage
   - Hiển thị thông báo "Đã đăng xuất"
   - Chuyển hướng đến `/login`

## 5. Cấu trúc File Mới

```
src/
├── views/
│   └── auth/
│       ├── Login.vue                 # Trang đăng nhập
│       └── ForgotPassword.vue        # Trang quên mật khẩu
├── router/
│   ├── index.ts                      # Có thêm route guard
│   └── route.config.ts               # Có thêm auth routes
└── layouts/
    └── components/
        └── RightHeader.vue           # Cập nhật logout
```

## 6. Các Tuyến Đường (Routes)

| Route | Component | Yêu cầu Auth |
|-------|-----------|-------------|
| `/login` | Login.vue | Không |
| `/forgot-password` | ForgotPassword.vue | Không |
| `/signup` | Login.vue (reuse) | Không |
| `/dashboard/**` | Various | Có |
| `/form/**` | Various | Có |
| `/list/**` | Various | Có |

## 7. Testing/Demo

### Để test login:
1. Truy cập `http://localhost:5173/login`
2. Nhập bất kỳ username và password (min 6 ký tự)
3. Click "Đăng nhập"
4. Sẽ được chuyển hướng đến dashboard
5. Check localStorage để xem `authToken`

### Để test forgot password:
1. Từ login page, click "Quên mật khẩu?"
2. Nhập email bất kỳ
3. Click "Gửi mã xác minh"
4. Nhập mã xác minh (bất kỳ 6 chữ số)
5. Nhập mật khẩu mới
6. Quay lại login page

### Để test logout:
1. Đăng nhập thành công
2. Click vào avatar ở bên phải header
3. Chọn "Đăng xuất"
4. Sẽ được chuyển hướng đến login

## 8. Customize

### Để thêm real API:
Thay thế code trong hàm `onFinish` của Login.vue:
```typescript
// Thay vì:
await new Promise(resolve => setTimeout(resolve, 1500));

// Thay thành:
const response = await api.login({
    username: formState.username,
    password: formState.password
});
localStorage.setItem('authToken', response.token);
```

### Để thêm i18n (đa ngôn ngữ):
Các label và message đã sử dụng hardcoded tiếng Việt. Nếu cần i18n:
```typescript
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// Sử dụng: t('login.title')
```

## 9. Ghi chú bảo mật

⚠️ **Lưu ý**: Đây là demo/skeleton. Để production, cần:
- ✅ Sử dụng HTTPS
- ✅ Lưu token trong HttpOnly cookie thay vì localStorage
- ✅ Implement refresh token mechanism
- ✅ Validate password requirements
- ✅ Implement rate limiting
- ✅ Sử dụng CSRF protection
- ✅ Encrypt sensitive data

## 10. Thành phần Ant Design được sử dụng

- `a-form` - Form validation
- `a-form-item` - Form fields
- `a-input` - Text input
- `a-input-password` - Password input
- `a-button` - Buttons
- `a-checkbox` - Checkbox
- `a-dropdown` - Dropdown menu
- `a-menu` - Menu items
- `a-badge` - Badge với số đếm
- `a-steps` - Step indicator
- `a-divider` - Divider line
- `a-avatar` - Avatar image

