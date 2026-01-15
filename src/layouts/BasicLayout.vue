<template>
  <a-layout style="min-height: 100vh">

    <!-- Sider -->
    <AppSider v-model:collapsed="collapsed" />

    <a-layout>
      <a-layout-header class="layout-header-custom">
        <div class="header-left">
          <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        </div>
        <RightHeader />
      </a-layout-header>

      <a-breadcrumb>
        <a-breadcrumb-item><home-outlined /> Home</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
        <a-breadcrumb-item>An Application</a-breadcrumb-item>
      </a-breadcrumb>

      <a-layout-content style="margin: 0 10px">

        <div :style="{ padding: '0px', background: '#fff' }">
          <router-view />
        </div>

        <!--Demo -->
        <!--End Demo-->

      </a-layout-content>

      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined
} from '@ant-design/icons-vue';

import { ref } from 'vue'
import AppSider from "@/layouts/components/AppSider.vue";
import RightHeader from "@/layouts/components/RightHeader.vue";

const collapsed = ref<boolean>(false);
</script>

<style scoped>

.layout-header-custom {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

/* Breadcrumb container */
:deep(.ant-breadcrumb) {
  margin: 1px 0 10px 0;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 6px;
}

/* Breadcrumb item */
:deep(.ant-breadcrumb li) {
  color: rgba(0, 0, 0, 0.45);
}

/* Link */
:deep(.ant-breadcrumb a) {
  color: rgba(0, 0, 0, 0.65);
  transition: color 0.2s ease;
}

:deep(.ant-breadcrumb a:hover) {
  color: #1677ff; /* Ant Design primary */
}

/* Current page */
:deep(.ant-breadcrumb li:last-child) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

/* Separator */
:deep(.ant-breadcrumb-separator) {
  margin: 0 6px;
  color: rgba(0, 0, 0, 0.3);
}

</style>
