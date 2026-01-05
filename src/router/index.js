import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
// Import halaman baru
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import ProjectAddView from '../views/admin/ProjectAddView.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        // Rute Login
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        // Rute Admin
        {
            path: '/admin',
            name: 'dashboard',
            component: DashboardView
        },
        {
            path: '/admin/add',
            name: 'project-add',
            component: ProjectAddView
        }
    ]
})

export default router