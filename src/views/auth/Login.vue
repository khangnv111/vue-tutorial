<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Logo/Title -->
        <div class="login-header">
          <h1>Khang Kaiser</h1>
          <p>Hệ thống quản lý ứng dụng</p>
        </div>

        <!-- Login Form -->
        <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
          <!-- Email/Username -->
          <a-form-item name="username" label="Tên đăng nhập">
            <a-input
                v-model:value="formState.username"
                placeholder="Nhập tên đăng nhập hoặc email"
                size="large"
                prefix-icon="user"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <!-- Password -->
          <a-form-item name="password" label="Mật khẩu">
            <a-input-password
                v-model:value="formState.password"
                placeholder="Nhập mật khẩu"
                size="large"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Remember Me & Forgot Password -->
          <div class="login-options">
            <a-checkbox v-model:checked="formState.remember">
              Ghi nhớ tôi
            </a-checkbox>
            <router-link to="/forgot-password" class="forgot-link">
              Quên mật khẩu?
            </router-link>
          </div>

          <!-- Submit Button -->
          <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="loading"
            >
              Đăng nhập
            </a-button>
          </a-form-item>

          <!-- Sign Up Link -->
          <div class="sign-up-section">
            <span>Chưa có tài khoản? </span>
            <router-link to="/signup" class="signup-link">Đăng ký ngay</router-link>
          </div>
        </a-form>

        <!-- Social Login -->
        <div class="social-login">
          <p>Hoặc đăng nhập bằng</p>
          <div class="social-buttons">
            <a-button type="default" size="large" shape="round">
              <template #icon>
                <GithubOutlined />
              </template>
              GitHub
            </a-button>
            <a-button type="default" size="large" shape="round">
              <template #icon>
                <GoogleOutlined />
              </template>
              Google
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  GithubOutlined,
  GoogleOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
  remember: false,
});

const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'change' },
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'change' },
    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự', trigger: 'change' },
  ],
};

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    // Simulate login API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('Đăng nhập thành công!');

    // Save auth token
    localStorage.setItem('authToken', 'token_' + Date.now());

    // Store remember me preference
    if (formState.remember) {
      localStorage.setItem('rememberMe', JSON.stringify({
        username: formState.username,
      }));
    }
    // Redirect to dashboard
    router.push('/dashboard/workplace');
  } catch (error) {
    message.error('Đăng nhập thất bại. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// Load remembered username
const loadRememberedUsername = () => {
  const remembered = localStorage.getItem('rememberMe');
  if (remembered) {
    const data = JSON.parse(remembered);
    formState.username = data.username;
    formState.remember = true;
  }
};

// Initialize on component mount
loadRememberedUsername();
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 40px 32px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px;
}

.login-header p {
  color: #8c8c8c;
  font-size: 14px;
  margin: 0;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.forgot-link {
  color: #1890ff;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #40a9ff;
}

.sign-up-section {
  text-align: center;
  color: #595959;
  font-size: 14px;
  margin-top: 16px;
}

.signup-link {
  color: #1890ff;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;
}

.signup-link:hover {
  color: #40a9ff;
}

.social-login {
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.social-login p {
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 16px;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 4px;
}

:deep(.ant-btn-primary) {
  background-color: #667eea;
  border-color: #667eea;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.ant-btn-primary:hover) {
  background-color: #5568d3;
  border-color: #5568d3;
}

@media (max-width: 576px) {
  .login-card {
    padding: 24px 16px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }
}
</style>

