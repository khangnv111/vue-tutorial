import { h, defineComponent } from 'vue';

import BasicLayout from "@/layouts/BasicLayout.vue";
import UserPosts from "@/example/UserPosts.vue";

export const RouteView = defineComponent({
    name: 'RouteView',
    setup() {},
    render() {
        return h('router-view');
    },
});

export const asyncRouterMap = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        redirect: '/dashboard/workplace',
        meta: { title: 'menu.home' },
        children: [
            // Dashboard
            {
                path: '/dashboard',
                name: 'dashboard',
                // component: RouteView,
                meta: { title: 'menu.dashboard', icon: 'dashboard' },
                children: [
                    {
                        path: '/dashboard/workplace',
                        name: 'workplace',
                        component: () => import('@/views/dashboard/Workplace.vue'),
                        meta: { title: 'menu.dashboard.workplace' }
                    },
                    {
                        path: '/dashboard/analysis',
                        name: 'Analysis',
                        component: () => import('@/views/dashboard/Analysis.vue'),
                        meta: { title: 'menu.dashboard.analysis' }
                    }
                ]
            },
            // Form
            {
                path: '/form',
                name: 'Form',
                meta: { title: 'menu.form', icon: 'form' },
                // component: RouteView,
                // redirect: '/form/basic-form',
                children: [
                    {
                        path: '/form/basic-form',
                        name: 'BasicForm',
                        component: () => import('@/views/form/basic/Index.vue'),
                        meta: { title: 'menu.form.basic-form' }
                    },
                    {
                        path: '/form/step-form',
                        name: 'StepForm',
                        component: () => import('@/views/form/step/Index.vue'),
                        meta: { title: 'menu.form.step-form' }
                    },
                    {
                        path: '/form/advanced-form',
                        name: 'AdvancedForm',
                        component: () => import('@/views/form/advanced/Index.vue'),
                        meta: { title: 'menu.form.advanced-form' }
                    },
                ]
            },
            // List
            {
                path: '/list',
                name: 'list',
                meta: { title: 'menu.list', icon: 'list' },
                children: [
                    {
                        path: '/list/table-list',
                        name: 'TableListWrapper',
                        // hideChildrenInMenu: true,
                        component: () => import('@/views/list/TableList.vue'),
                        meta: { title: 'menu.list.table-list' }
                    },
                    {
                        path: '/list/basic-list',
                        name: 'BasicList',
                        component: () => import('@/views/list/BasicList.vue'),
                        meta: { title: 'menu.list.basic-list'}
                    },
                    {
                        // UserPosts will be rendered inside User's <router-view>
                        // when /user/:id/posts is matched
                        path: 'posts',
                        component: UserPosts,
                    },
                ],
            },
        ]
    }
]