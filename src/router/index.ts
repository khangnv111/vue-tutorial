import { createWebHistory, createRouter } from 'vue-router'
import { asyncRouterMap } from "@/router/route.config.ts";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: asyncRouterMap,
})

// Route guard for authentication
router.beforeEach((to, from, next) => {
    // Define routes that don't require authentication
    const publicRoutes = ['/login', '/forgot-password', '/signup'];

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false;
    const isPublicRoute = publicRoutes.includes(to.path);

    // Get auth token from localStorage (or your auth state)
    const authToken = localStorage.getItem('authToken');

    // If route requires auth and user is not authenticated, redirect to login
    if (requiresAuth && !authToken && !isPublicRoute) {
        next('/login');
    }
    // If user is authenticated and tries to access login/signup, redirect to dashboard
    else if (authToken && isPublicRoute) {
        next('/');
    }
    // Otherwise, allow navigation
    else {
        next();
    }
});

