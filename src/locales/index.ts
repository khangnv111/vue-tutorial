import { createI18n } from 'vue-i18n'
// import type { I18n } from 'vue-i18n'
// Import Ant Design Vue locale
import { LANGUAGE } from "@/constant";
import enUS from 'ant-design-vue/es/locale/en_US'
import viVN from "ant-design-vue/es/locale/vi_VN";

import enUSLang from "@/locales/lang/en-Us.ts";
import viVNLang from "@/locales/lang/vi-VN.ts";

const messages = {
    'vi-VN': {
        ...viVNLang,
        antLocale: viVN
    },
    'en-US': {
        ...enUSLang,
        antLocale: enUS
    }
}

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem(LANGUAGE.KEY) || LANGUAGE.EN_US,
    fallbackLocale: LANGUAGE.EN_US, // Fallback locale if translation is missing
    globalInjection: true, // Enable global injection of $t
    messages
})

export default i18n