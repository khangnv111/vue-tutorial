<template>
  <div class="forgot-container">
    <div class="forgot-wrapper">
      <div class="forgot-card">
        <!-- Header -->
        <div class="forgot-header">
          <router-link to="/login" class="back-link">
            <ArrowLeftOutlined />
            Quay lại
          </router-link>
          <h1>Quên mật khẩu</h1>
          <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>

        <!-- Step Indicator -->
        <a-steps :current="currentStep" class="forgot-steps">
          <a-step title="Xác minh email" />
          <a-step title="Đặt lại mật khẩu" />
          <a-step title="Hoàn tất" />
        </a-steps>

        <!-- Step 1: Email Verification -->
        <div v-if="currentStep === 0" class="step-content">
          <a-form
              ref="emailFormRef"
              :model="emailForm"
              :rules="emailRules"
              layout="vertical"
              @finish="onEmailSubmit"
          >
            <a-form-item name="email" label="Địa chỉ email">
              <a-input
                  v-model:value="emailForm.email"
                  placeholder="Nhập địa chỉ email của bạn"
                  size="large"
                  type="email"
              >
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="loading"
              >
                Gửi mã xác minh
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 2: Verify Code -->
        <div v-if="currentStep === 1" class="step-content">
          <a-form
              ref="codeFormRef"
              :model="codeForm"
              :rules="codeRules"
              layout="vertical"
              @finish="onCodeSubmit"
          >
            <div class="code-info">
              <p>Mã xác minh đã được gửi đến</p>
              <p class="email-highlight">{{ emailForm.email }}</p>
            </div>

            <a-form-item name="code" label="Mã xác minh">
              <a-input
                  v-model:value="codeForm.code"
                  placeholder="Nhập 6 chữ số"
                  size="large"
                  maxlength="6"
              >
                <template #prefix>
                  <ScanOutlined />
                </template>
              </a-input>
            </a-form-item>

            <div class="resend-section">
              <span v-if="countdown > 0" class="countdown">
                Gửi lại sau {{ countdown }}s
              </span>
              <a-button
                  v-else
                  type="link"
                  size="small"
                  @click="resendCode"
              >
                Gửi lại mã
              </a-button>
            </div>

            <a-form-item>
              <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="loading"
              >
                Xác minh
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 3: Reset Password -->
        <div v-if="currentStep === 2" class="step-content">
          <a-form
              ref="resetFormRef"
              :model="resetForm"
              :rules="resetRules"
              layout="vertical"
              @finish="onResetSubmit"
          >
            <a-form-item name="newPassword" label="Mật khẩu mới">
              <a-input-password
                  v-model:value="resetForm.newPassword"
                  placeholder="Nhập mật khẩu mới"
                  size="large"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="confirmPassword" label="Xác nhận mật khẩu">
              <a-input-password
                  v-model:value="resetForm.confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  size="large"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="loading"
              >
                Đặt lại mật khẩu
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Step 4: Success -->
        <div v-if="currentStep === 3" class="step-content success-content">
          <div class="success-icon">
            <CheckCircleOutlined />
          </div>
          <h2>Đặt lại mật khẩu thành công!</h2>
          <p>Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập với mật khẩu mới.</p>
          <a-button
              type="primary"
              size="large"
              block
              @click="$router.push('/login')"
          >
            Quay lại trang đăng nhập
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  ArrowLeftOutlined,
  MailOutlined,
  ScanOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';

const emailFormRef = ref<FormInstance>();
const codeFormRef = ref<FormInstance>();
const resetFormRef = ref<FormInstance>();

const currentStep = ref(0);
const loading = ref(false);
const countdown = ref(0);

// Email Form
const emailForm = reactive({
  email: '',
});

const emailRules = {
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'change' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'change' },
  ],
};

// Code Form
const codeForm = reactive({
  code: '',
});

const codeRules = {
  code: [
    { required: true, message: 'Vui lòng nhập mã xác minh', trigger: 'change' },
    { len: 6, message: 'Mã xác minh phải 6 chữ số', trigger: 'change' },
  ],
};

// Reset Form
const resetForm = reactive({
  newPassword: '',
  confirmPassword: '',
});

const validatePasswordMatch = (_: any, value: string) => {
  if (value === '') {
    return Promise.reject(new Error('Vui lòng xác nhận mật khẩu'));
  } else if (value !== resetForm.newPassword) {
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
  } else {
    return Promise.resolve();
  }
};

const resetRules = {
  newPassword: [
    { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'change' },
    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự', trigger: 'change' },
  ],
  confirmPassword: [
    { validator: validatePasswordMatch, trigger: 'change' },
  ],
};

// Event Handlers
const onEmailSubmit = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('Mã xác minh đã được gửi!');
    currentStep.value = 1;
    startCountdown();
  } catch (error) {
    message.error('Gửi mã thất bại. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};

const onCodeSubmit = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('Mã xác minh hợp lệ!');
    currentStep.value = 2;
  } catch (error) {
    message.error('Mã xác minh không hợp lệ. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};

const onResetSubmit = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('Mật khẩu đã được đặt lại!');
    currentStep.value = 3;
  } catch (error) {
    message.error('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('Mã xác minh mới đã được gửi!');
    startCountdown();
  } catch (error) {
    message.error('Gửi lại mã thất bại. Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
</script>

<style scoped>
.forgot-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.forgot-wrapper {
  width: 100%;
  max-width: 500px;
}

.forgot-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 40px 32px;
}

.forgot-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.3s;
  font-size: 14px;
}

.back-link:hover {
  color: #40a9ff;
}

.forgot-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 8px 0;
}

.forgot-header p {
  color: #8c8c8c;
  font-size: 14px;
  margin: 0;
}

.forgot-steps {
  margin-bottom: 32px;
}

.step-content {
  min-height: 250px;
}

.code-info {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.code-info p {
  margin: 0 0 8px;
  color: #8c8c8c;
  font-size: 14px;
}

.email-highlight {
  color: #1f1f1f;
  font-weight: 600;
  font-size: 16px;
}

.resend-section {
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

.countdown {
  color: #ff4d4f;
}

.success-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

.success-content h2 {
  font-size: 24px;
  color: #1f1f1f;
  margin: 16px 0 8px;
}

.success-content p {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 24px;
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

:deep(.ant-steps) {
  font-size: 12px;
}

@media (max-width: 576px) {
  .forgot-card {
    padding: 24px 16px;
  }

  .forgot-header h1 {
    font-size: 24px;
  }
}
</style>

