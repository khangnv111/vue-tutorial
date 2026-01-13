import { createApp } from 'vue'
import App from './App.vue'
import {router} from "@/router";

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout"

import i18n from './locales'

const app = createApp(App);

app.use(Antd)
app.use(router)
app.use(i18n)
app.use(ProLayout).use(PageContainer)

app.mount('#app');
