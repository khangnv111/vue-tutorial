<template>
  <div :class="wrpCls">
    <AvatarDropdown
        :menu="showMenu"
        :current-user="currentUser"
        :class="prefixCls"
    />
<!--    <SelectLang :class="prefixCls" />-->
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import AvatarDropdown from './AvatarDropdown.vue'
// import SelectLang from '@/components/SelectLang'

const props = defineProps({
  prefixCls: {
    type: String,
    default: 'ant-pro-global-header-index-action'
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  topMenu: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    required: true
  }
})

const showMenu = ref(true)
const currentUser = ref({})

const wrpCls = computed(() => ({
  'ant-pro-global-header-index-right': true,
  [`ant-pro-global-header-index-${
      (props.isMobile || !props.topMenu) ? 'light' : props.theme
  }`]: true
}))

onMounted(() => {
  setTimeout(() => {
    currentUser.value = {
      name: 'Serati Ma'
    }
  }, 1500)
})
</script>
