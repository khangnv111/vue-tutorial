<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="onClick" class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item key="1">
          <UserOutlined />
          1st menu item
        </a-menu-item>
        <a-menu-item key="2">
          <SettingOutlined />
          2nd menu item
        </a-menu-item>
        <a-menu-item key="3">
          <LogoutOutlined />
          Logout
        </a-menu-item>

      </a-menu>
    </template>

    <span>
      <a-avatar
          size="small"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar"
      >
      </a-avatar>
      <span>Khang Kaiser</span>
    </span>


  </a-dropdown>
</template>

<script lang="ts" setup>
import {UserOutlined, DownOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on item ${key}`);
};
</script>

<style scoped>
#components-dropdown-demo-placement .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>