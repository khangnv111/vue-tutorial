<template>
  <a-layout-header class="layout-header-container">
    <div class="header-left">
      <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="handleToggle"
      />
      <menu-fold-outlined v-else class="trigger" @click="handleToggle" />
    </div>

    <div class="header-right">
      <right-header />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import RightHeader from "./RightHeader.vue";

interface Props {
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const emit = defineEmits<{
  'update:collapsed': [value: boolean];
}>();

const collapsed = computed({
  get: () => props.collapsed,
  set: (value: boolean) => {
    emit('update:collapsed', value);
  },
});

const handleToggle = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.layout-header-container {
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

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: 16px;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  padding: 0 16px;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>

