<template>
  <div class="right-header-wrapper">
    <!-- Notification Icon -->
    <a-badge :count="5" :offset="[-8, 8]" class="notification-badge">
      <a-button
          type="text"
          shape="circle"
          size="large"
          class="icon-button"
          @click="handleNotification"
          title="Thông báo"
      >
        <BellOutlined />
      </a-button>
    </a-badge>

    <!-- Language Dropdown -->
    <a-dropdown :trigger="['click']" placement="bottomRight">
      <template #overlay>
        <a-menu @click="onLanguageChange" :selected-keys="[currentLanguage]">
          <a-menu-item key="en-US">
            <span>English</span>
          </a-menu-item>
          <a-menu-item key="vi-VN">
            <span>Tiếng Việt</span>
          </a-menu-item>
        </a-menu>
      </template>
      <a-button
          type="text"
          shape="circle"
          size="large"
          class="icon-button"
          title="Chuyển đổi ngôn ngữ"
      >
        <GlobalOutlined />
      </a-button>
    </a-dropdown>

    <!-- Divider -->
<!--    <a-divider type="vertical" style="margin: 0 8px; height: 32px" />-->

    <!-- User Dropdown -->
    <a-dropdown :trigger="['click']" placement="bottomRight">
      <template #overlay>
        <a-menu @click="onUserMenuClick" :selected-keys="[]">
          <a-menu-item key="profile">
            <UserOutlined />
            <span> Hồ sơ</span>
          </a-menu-item>
          <a-menu-item key="settings">
            <SettingOutlined />
            <span> Cài đặt</span>
          </a-menu-item>
          <a-divider style="margin: 8px 0" />
          <a-menu-item key="logout">
            <LogoutOutlined />
            <span> Đăng xuất</span>
          </a-menu-item>
        </a-menu>
      </template>

      <span class="user-info">
        <a-avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            alt="User Avatar"
        />
        <span class="user-name">Khang Kaiser</span>
      </span>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  GlobalOutlined,
} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const router = useRouter();
const currentLanguage = ref<string>('en-US');

const onUserMenuClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on user menu item ${key}`);
  if (key === 'logout') {
    // Remove auth token
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    message.success('Đã đăng xuất');
    // Redirect to login
    router.push('/login');
  } else if (key === 'profile') {
    // Navigate to profile page
    console.log('Navigate to profile');
  } else if (key === 'settings') {
    // Navigate to settings page
    console.log('Navigate to settings');
  }
};

const onLanguageChange: MenuProps['onClick'] = ({ key }) => {
  currentLanguage.value = key as string;
  console.log(`Language changed to ${key}`);
};

const handleNotification = () => {
  console.log('Notification clicked');
};
</script>

<style scoped>
.right-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  height: 100%;
  margin-left: auto;
  padding-right: 16px;
}

.icon-button {
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-button:hover {
  color: #1890ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-name {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.notification-badge {
  cursor: pointer;
}

:deep(.ant-badge-count) {
  background-color: #ff4d4f;
  font-size: 11px;
  height: 18px;
  line-height: 18px;
  min-width: 18px;
  padding: 0 4px;
}
</style>

