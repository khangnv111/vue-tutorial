import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        port: 3000, //default port 3000
        strictPort: false, // exit if port is already in use
        cors: true // enable CORS
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true, // Enable JavaScript in Less files
                modifyVars: { // Customize Ant Design Vue theme variables
                    'primary-color': '#1890ff'
                }
            }
        }
    }
})
