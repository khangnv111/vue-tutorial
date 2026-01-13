<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar
          size="small"
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          class="antd-pro-global-header-index-avatar"
      />
      <span>{{ currentUser.name }}</span>
    </span>

    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <UserOutlined />
          {{ t('menu.account.center') }}
        </a-menu-item>

        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <SettingOutlined />
          {{ t('menu.account.settings') }}
        </a-menu-item>

        <a-menu-divider v-if="menu" />

        <a-menu-item key="logout" @click="handleLogout">
          <LogoutOutlined />
          {{ t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

  <span v-else>
    <a-spin size="small" :style="{ marginLeft: '8px', marginRight: '8px' }" />
  </span>
</template>
<script setup>
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

defineProps({
  currentUser: {
    type: Object,
    default: null
  },
  menu: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
// const store = useStore()
const { t } = useI18n()

const handleToCenter = () => {
  router.push({ path: '/account/center' })
}

const handleToSettings = () => {
  router.push({ path: '/account/settings' })
}

const handleLogout = () => {
  Modal.confirm({
    title: t('layouts.usermenu.dialog.title'),
    content: t('layouts.usermenu.dialog.content'),
    onOk: async () => {
      // await store.dispatch('Logout')
      router.push({ name: 'login' })
    }
  })
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }

  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
