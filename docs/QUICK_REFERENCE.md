# 🔐 Authentication System - Quick Reference

## 📂 File Structure
```
src/
├── views/auth/
│   ├── Login.vue              ← Trang đăng nhập
│   └── ForgotPassword.vue     ← Trang quên mật khẩu (3 bước)
├── router/
│   ├── index.ts               ← Có route guard
│   └── route.config.ts        ← Có 3 auth routes
└── layouts/components/
    └── RightHeader.vue        ← Có logout
```

## 🔑 Routes & Endpoints

| Route | File | Public | Desc |
|-------|------|--------|------|
| `/login` | `Login.vue` | ✅ | Đăng nhập |
| `/forgot-password` | `ForgotPassword.vue` | ✅ | Quên MK |
| `/signup` | `Login.vue` | ✅ | Đăng ký |
| `/dashboard/**` | Various | ❌ | Yêu cầu auth |
| `/form/**` | Various | ❌ | Yêu cầu auth |
| `/list/**` | Various | ❌ | Yêu cầu auth |

## 🎯 Key Features

### ✅ Login Page
```
- Email/Username input với validation
- Password input (min 6 chars)
- Remember me checkbox
- Forgot password link
- Social login (GitHub/Google) - skeleton
- Sign up link
```

### ✅ Forgot Password (3 Steps)
```
Step 1: Email verification
  Input: Email address
  Output: Send OTP code

Step 2: OTP verification  
  Input: 6-digit code
  Output: Proceed to password reset

Step 3: Password reset
  Input: New password + confirmation
  Output: Success message + redirect to login
```

### ✅ Logout
```
Header → Avatar → Menu → Đăng xuất
- Clear authToken from localStorage
- Clear rememberMe
- Redirect to /login
```

## 💾 localStorage Keys

```javascript
// Save after login
localStorage.authToken         // "token_123456789"
localStorage.rememberMe        // {"username":"user@example.com"}

// Clear on logout
localStorage.removeItem('authToken')
localStorage.removeItem('rememberMe')
```

## 🔄 Authentication Flow

```
START
  ↓
Is user authenticated?
  ├─ NO
  │   ├─ Accessing /login, /forgot-password, /signup → ✅ ALLOW
  │   ├─ Accessing /dashboard, /form, /list → ❌ REDIRECT TO /LOGIN
  │   
  └─ YES (authToken exists)
      ├─ Accessing /login, /forgot-password, /signup → ❌ REDIRECT TO /DASHBOARD
      ├─ Accessing /dashboard, /form, /list → ✅ ALLOW
```

## 🎨 UI Components Used

```
┌─ a-form
│  ├─ a-form-item
│  ├─ a-input / a-input-password
│  ├─ a-button
│  ├─ a-checkbox
│  └─ a-steps (forgot password only)
├─ a-dropdown / a-menu
├─ a-badge (notification counter)
├─ a-avatar
└─ router-link (navigation)
```

## 📋 Form Validation Rules

### Login Form
```
username: [required, email or username format]
password: [required, min 6 chars]
```

### Forgot Password
```
Step 1 - email: [required, valid email]
Step 2 - code:  [required, exactly 6 digits]
Step 3 - password: [required, min 6 chars]
        - confirm: [required, must match password]
```

## 🚀 How to Test

### 1. Test Login
```
1. Go to http://localhost:5173/login
2. Enter username: test
3. Enter password: 123456
4. Click "Đăng nhập"
5. Should redirect to /dashboard
6. Check localStorage for authToken
```

### 2. Test Forgot Password
```
1. Go to http://localhost:5173/forgot-password
2. Step 1: Enter email → test@example.com
3. Step 2: Enter OTP → 123456
4. Step 3: Enter password → 123456
5. Confirm password → 123456
6. Click "Đặt lại mật khẩu"
7. See success message → redirect to login
```

### 3. Test Logout
```
1. Login to application
2. Click avatar top-right
3. Select "Đăng xuất"
4. Should redirect to login
5. Check localStorage is cleared
```

### 4. Test Route Guard
```
1. Clear authToken from localStorage manually
2. Try to access /dashboard
3. Should redirect to /login
```

## 🔐 Security Notes

⚠️ **Current**: Uses localStorage (for demo)
✅ **Production**: Should use:
- HttpOnly cookies
- Secure flag
- SameSite attribute
- CSRF tokens
- Refresh token rotation

## 📝 Code Examples

### Check if user is logged in
```typescript
const isLoggedIn = !!localStorage.getItem('authToken');
```

### Logout programmatically
```typescript
localStorage.removeItem('authToken');
localStorage.removeItem('rememberMe');
router.push('/login');
```

### Redirect after login
```typescript
localStorage.setItem('authToken', response.token);
router.push('/dashboard/workplace');
```

## 🎯 Component Props & Emits

### Login.vue
```
Props: (none)
Emits: (none - uses router.push)
Data:
  - formState: { username, password, remember }
  - loading: boolean
```

### ForgotPassword.vue
```
Props: (none)
Emits: (none - uses router.push)
Data:
  - currentStep: 0-3
  - emailForm: { email }
  - codeForm: { code }
  - resetForm: { newPassword, confirmPassword }
  - countdown: number (60s)
```

### RightHeader.vue
```
Props: (none)
Emits: (none)
Methods:
  - onUserMenuClick(logout)
  - onLanguageChange
  - handleNotification
```

## 🔗 Related Files
- **AUTH_GUIDE.md** - Detailed documentation
- **SUMMARY.md** - Features overview

## ✅ Status
- [x] Login page created
- [x] Forgot password page (3 steps)
- [x] Form validation
- [x] Route guards
- [x] Auth token management
- [x] Logout functionality
- [x] Remember me feature
- [x] Responsive design

## 🚀 Next Implementation
1. Connect to real API
2. Add refresh token logic
3. Implement i18n translations
4. Add social login handlers
5. Add user profile page
6. Add two-factor authentication

