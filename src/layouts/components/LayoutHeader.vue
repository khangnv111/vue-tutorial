<template>
  <a-layout-header style="background: #fff; padding: 0">
    <menu-unfold-outlined
        v-if="collapsed"
        class="trigger"
        @click="() => (collapsed = !collapsed)"
    />
    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
  </a-layout-header>
</template>
<script setup lang="ts">
import {ref} from "vue";

const collapsed = ref<boolean>(false);
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons-vue";
</script>