# 🧪 Testing Guide - Authentication System

## ✅ Pre-requisites
- Application đang chạy: `npm run dev`
- Browser developer tools mở (F12)
- Console tab active để xem logs

## 📌 Test Cases

### 🔴 Test 1: Access Login Page

**Precondition**: localStorage không có `authToken`

**Steps**:
1. Navigate to: `http://localhost:5173/login`
2. Observe: Login form displays

**Expected Result**: ✅
- Login page renders correctly
- All form fields visible
- Links work properly

**Evidence**:
```
- Email/Username input field
- Password input field  
- "Ghi nhớ tôi" checkbox
- "Quên mật khẩu?" link
- "Đăng nhập" button
- Social login buttons
- "Đăng ký" link
```

---

### 🔴 Test 2: Form Validation - Missing Username

**Steps**:
1. Leave username empty
2. Fill password: `test123456`
3. Click "Đăng nhập"

**Expected Result**: ✅
```
Error message appears:
"Vui lòng nhập tên đăng nhập"
Form does NOT submit
```

---

### 🔴 Test 3: Form Validation - Missing Password

**Steps**:
1. Fill username: `testuser`
2. Leave password empty
3. Click "Đăng nhập"

**Expected Result**: ✅
```
Error message appears:
"Vui lòng nhập mật khẩu"
Form does NOT submit
```

---

### 🔴 Test 4: Form Validation - Password Too Short

**Steps**:
1. Fill username: `testuser`
2. Fill password: `12345` (only 5 chars)
3. Click "Đăng nhập"

**Expected Result**: ✅
```
Error message appears:
"Mật khẩu tối thiểu 6 ký tự"
Form does NOT submit
```

---

### 🔴 Test 5: Successful Login

**Steps**:
1. Fill username: `testuser` (any value)
2. Fill password: `test123456` (min 6 chars)
3. Uncheck "Ghi nhớ tôi"
4. Click "Đăng nhập"

**Expected Result**: ✅
- Loading spinner appears (1.5 seconds)
- Success message: "Đăng nhập thành công!"
- Redirects to: `/dashboard/workplace`
- localStorage contains:
  ```
  authToken: "token_1234567890"
  ```

**Verification**:
```javascript
// In browser console:
localStorage.getItem('authToken')  // Should show token
localStorage.getItem('rememberMe')  // Should be null
```

---

### 🔴 Test 6: Remember Me Functionality

**Steps**:
1. Fill username: `myemail@example.com`
2. Fill password: `test123456`
3. ✅ Check "Ghi nhớ tôi"
4. Click "Đăng nhập"

**Expected Result**: ✅
- Login succeeds
- localStorage contains:
  ```json
  {
    "authToken": "token_xxx",
    "rememberMe": {
      "username": "myemail@example.com"
    }
  }
  ```

**Verification**:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('rememberMe'))
// Should show: { username: "myemail@example.com" }
```

---

### 🔴 Test 7: Forgot Password Link

**Steps**:
1. On login page
2. Click "Quên mật khẩu?" link

**Expected Result**: ✅
- Navigates to: `/forgot-password`
- Forgot password form displays

---

### 🔴 Test 8: Forgot Password - Step 1 (Email)

**Steps**:
1. Navigate to: `http://localhost:5173/forgot-password`
2. Observe step indicator shows Step 1 active
3. Fill email: `test@example.com`
4. Click "Gửi mã xác minh"

**Expected Result**: ✅
- Email is validated
- Loading spinner shows
- Success message: "Mã xác minh đã được gửi!"
- Step indicator moves to Step 2
- Shows message: "Mã xác minh đã được gửi đến test@example.com"

---

### 🔴 Test 9: Forgot Password - Step 2 (OTP)

**Steps**:
1. Continue from previous test
2. Fill OTP: `123456` (6 digits)
3. Note: "Gửi lại sau 60s" countdown appears
4. Click "Xác minh"

**Expected Result**: ✅
- OTP validated (exactly 6 digits)
- Success message: "Mã xác minh hợp lệ!"
- Step indicator moves to Step 3
- Countdown timer active (60 seconds)

---

### 🔴 Test 10: Forgot Password - Step 3 (New Password)

**Steps**:
1. Continue from previous test
2. Fill new password: `newpass123`
3. Fill confirm password: `newpass123`
4. Click "Đặt lại mật khẩu"

**Expected Result**: ✅
- Passwords must match (validation error if not)
- Loading spinner shows
- Success message: "Mật khẩu đã được đặt lại!"
- Step 4 displays (success screen)
- Shows checkmark icon ✓
- "Quay lại trang đăng nhập" button available

---

### 🔴 Test 11: Forgot Password - Success

**Steps**:
1. Complete all 3 steps successfully
2. Click "Quay lại trang đăng nhập"

**Expected Result**: ✅
- Redirects to `/login`
- Login form is ready to use

---

### 🔴 Test 12: Resend OTP Code

**Steps**:
1. On Forgot Password Step 2
2. Wait for countdown to complete (60 seconds)
3. Once countdown reaches 0, "Gửi lại mã" link appears
4. Click "Gửi lại mã"

**Expected Result**: ✅
- New message: "Mã xác minh mới đã được gửi!"
- Countdown restarts at 60 seconds
- Counter ticks down

---

### 🔴 Test 13: Password Confirmation Mismatch

**Steps**:
1. On Forgot Password Step 3
2. Fill new password: `newpass123`
3. Fill confirm password: `different456`
4. Click "Đặt lại mật khẩu"

**Expected Result**: ✅
```
Error message appears:
"Mật khẩu xác nhận không khớp"
Form does NOT submit
```

---

### 🔴 Test 14: Logout Functionality

**Precondition**: User is logged in (authToken exists)

**Steps**:
1. Login successfully (Test 5)
2. Click avatar in top-right corner
3. Dropdown menu appears
4. Select "Đăng xuất"

**Expected Result**: ✅
- Success message: "Đã đăng xuất"
- Redirects to: `/login`
- localStorage is cleared:
  ```javascript
  localStorage.getItem('authToken')    // null
  localStorage.getItem('rememberMe')   // null
  ```

**Verification**:
```javascript
// In browser console after logout:
localStorage  // Should only show 'length: 0'
```

---

### 🔴 Test 15: Route Guard - Protect Dashboard

**Precondition**: localStorage does NOT have authToken

**Steps**:
1. Clear localStorage: 
   ```javascript
   localStorage.clear()
   ```
2. Try to access: `http://localhost:5173/dashboard`

**Expected Result**: ✅
- Automatically redirects to: `/login`
- Route guard prevents unauthorized access

---

### 🔴 Test 16: Route Guard - Logged In User

**Precondition**: authToken exists in localStorage

**Steps**:
1. Login successfully
2. Try to navigate to: `/login`

**Expected Result**: ✅
- Automatically redirects to: `/dashboard/workplace`
- Cannot access login page while authenticated

---

### 🔴 Test 17: Responsive Design - Mobile

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 (375px width)
4. Navigate to login page

**Expected Result**: ✅
- Login form is visible and usable on mobile
- Cards have proper padding
- Buttons are full width
- Text is readable

---

### 🔴 Test 18: Sign Up Link

**Steps**:
1. On login page
2. Scroll to bottom
3. Click "Đăng ký ngay"

**Expected Result**: ✅
- Navigates to: `/signup`
- Currently shows login form (can be customized later)

---

### 🔴 Test 19: Social Login Buttons

**Steps**:
1. On login page
2. Observe social login section
3. Click GitHub or Google buttons

**Expected Result**: ✅
- Buttons are visible and clickable
- (Functionality not implemented - skeleton for now)

---

### 🔴 Test 20: Browser Back Button After Login

**Steps**:
1. Login successfully
2. Click browser back button
3. Try to go back to login page

**Expected Result**: ✅
- Back button works
- Navigates through history normally
- Route guard handles unauthorized access appropriately

---

## 📊 Test Summary Sheet

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 1 | Access Login Page | ⚪ | |
| 2 | Validation - Missing Username | ⚪ | |
| 3 | Validation - Missing Password | ⚪ | |
| 4 | Validation - Short Password | ⚪ | |
| 5 | Successful Login | ⚪ | |
| 6 | Remember Me | ⚪ | |
| 7 | Forgot Password Link | ⚪ | |
| 8 | FP Step 1 - Email | ⚪ | |
| 9 | FP Step 2 - OTP | ⚪ | |
| 10 | FP Step 3 - Password | ⚪ | |
| 11 | FP Success Screen | ⚪ | |
| 12 | Resend OTP | ⚪ | |
| 13 | Password Mismatch | ⚪ | |
| 14 | Logout | ⚪ | |
| 15 | Route Guard - Dashboard | ⚪ | |
| 16 | Route Guard - Login Page | ⚪ | |
| 17 | Responsive - Mobile | ⚪ | |
| 18 | Sign Up Link | ⚪ | |
| 19 | Social Buttons | ⚪ | |
| 20 | Browser Back Button | ⚪ | |

**Legend**: ✅ Pass | ❌ Fail | ⚪ Not tested

---

## 🐛 Debug Tips

### Check Authentication Status
```javascript
// In browser console:
localStorage.getItem('authToken')      // Shows token or null
localStorage.getItem('rememberMe')     // Shows saved username or null
```

### Monitor Route Guards
```javascript
// Add to src/router/index.ts for debugging:
router.beforeEach((to, from, next) => {
  console.log(`Navigating from ${from.path} to ${to.path}`);
  console.log(`Auth token exists: ${!!localStorage.getItem('authToken')}`);
  // ... rest of guard logic
});
```

### Form Validation Debug
```javascript
// In Vue DevTools:
// Select Login component → Inspect formState
// Check validation state in console
```

### Network Simulation
```javascript
// Simulate slow network in DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Test login (should see loading state)
```

---

## ✅ Test Execution

**Date**: _______________
**Tester**: _____________
**Environment**: Dev/Staging/Production
**Browser**: Chrome/Firefox/Safari
**Resolution**: 1920x1080

**Overall Result**: 
- [ ] ✅ All tests passed
- [ ] ⚠️ Some tests failed
- [ ] ❌ Critical failures

**Notes**:
_________________________________
_________________________________
_________________________________

