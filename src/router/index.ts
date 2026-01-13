import { createWebHistory, createRouter } from 'vue-router'
import { asyncRouterMap } from "@/router/route.config.ts";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: asyncRouterMap,
})