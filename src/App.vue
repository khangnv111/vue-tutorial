<template>
  <a-config-provider :locale="locale">
    <div id="app">
<!--      <router-view v-slot="{ Component, route }">-->
<!--        <component :is="Component" :key="route.path" />-->
<!--      </router-view>-->
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import i18n from "@/locales";
import { LANGUAGE } from "@/constant";

const locale = computed(() => {
  const lang = ref<string>(localStorage.getItem(LANGUAGE.KEY) || LANGUAGE.VI_VN)

  return i18n.global.getLocaleMessage(lang.value)?.antLocale
})

</script>

<style scoped></style>
