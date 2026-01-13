<template>
  <a-layout-sider collapsible :width="250">
    <div class="sider-menu-logo">
      <router-link to="/">
        <img src="@/assets/logo.svg" alt="logo">
        <!--        <h1>{{ title }}</h1>-->
      </router-link>
    </div>
    <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        @select="onSelectMenu"
        @change="onChangeMenu"
        :items="menuItems"
        theme="dark"
        mode="inline"
    ></a-menu>
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { asyncRouterMap } from '@/router/route.config'
import { MENU } from '@/constant/index.ts'

/* ======================
   Menu logic
====================== */
interface MenuItem {
  key: string
  label: string
  path: string
  children?: MenuItem[]
  onClick?: () => void
}

const router = useRouter()
const { t } = useI18n()

const generateMenuItems = (routes: any[]): MenuItem[] => {
  return routes.map(r => {
    const item: MenuItem = {
      key: r.name || r.path,
      path: r.path,
      label: r.meta?.title ? t(r.meta.title) : r.name || r.path,
    }

    if (r.children?.length) {
      item.children = generateMenuItems(r.children)
    } else {
      item.onClick = () => router.push(r.path)
    }

    return item
  })
}

const rootRoute = asyncRouterMap.find(r => r.path === '/')
const menuItems = generateMenuItems(rootRoute?.children || [])

/* ======================
   Menu state
====================== */
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// if(localStorage.getItem(MENU.OPEN_KEYS)){
//   openKeys.value = JSON.parse(localStorage.getItem(MENU.OPEN_KEYS))
//   console.log('openKeys: ', openKeys.value)
// }
// if(localStorage.getItem(MENU.SELECTED_KEYS)){
//   selectedKeys.value = JSON.parse(localStorage.getItem(MENU.SELECTED_KEYS))
//   console.log('selectedKeys: ', selectedKeys.value)
// }

const onSelectMenu = (info: { key: string }) => {
  console.log('onSelectMenu: ', info)

  selectedKeys.value = [info.key]
  openKeys.value = info.keyPath && info.keyPath.length > 0 ? info.keyPath.slice(0, -1) : []

  // Set local storage
  localStorage.setItem(MENU.SELECTED_KEYS, JSON.stringify(selectedKeys.value))
  localStorage.setItem(MENU.OPEN_KEYS, JSON.stringify(openKeys.value))
}

const onChangeMenu = (openKeys: string []) => {
  console.log('onChangeMenu: ', openKeys)
}

const route = useRoute()

interface MenuState {
  selectedKey: string
  openKeys: string[]
}

const findMenuByPath = (
    items: MenuItem[],
    path: string,
    parentKeys: string[] = []
): MenuState | null => {
  for (const item of items) {
    // current key path
    const currentKeys = [...parentKeys, item.key]

    // leaf node
    if (!item.children) {
      // match path
      if (item.path === path || path.includes(item.key)) {
        return {
          selectedKey: item.key,
          openKeys: parentKeys,
        }
      }
    }

    // has children
    if (item.children) {
      const result = findMenuByPath(item.children, path, currentKeys)
      if (result) return result
    }
  }
  return null
}

const syncMenuWithRoute = () => {
  // console.log('route.path: ', route.path)
  // console.log('menuItems: ', menuItems)
  const result = findMenuByPath(menuItems, route.path)

  if (!result) return

  selectedKeys.value = [result.selectedKey]
  openKeys.value = result.openKeys

  // save localStorage
  localStorage.setItem(MENU.SELECTED_KEYS, JSON.stringify(selectedKeys.value))
  localStorage.setItem(MENU.OPEN_KEYS, JSON.stringify(openKeys.value))
}

watch(
    () => route.path,
    () => {
      console.log('...load trang')
      syncMenuWithRoute()
    },
    { immediate: true } // run on initial load
)
</script>

<style scoped>
.sider-menu-logo {
  height: 64px;
  padding-left: 24px;
  line-height: 64px;
  background: #001529;

  img {
    height: 32px;
    width: 32px;
    vertical-align: middle;
  }
}
</style>
