import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
// Import halaman baru
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import ProjectAddView from '../views/admin/ProjectAddView.vue'
import ProjectEditView from '../views/admin/ProjectEditView.vue'
import ProfileView from '../views/admin/ProfileView.vue'
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
        },
        {
            path: '/admin/edit/:id',
            name: 'project-edit',
            component: ProjectEditView
        },
        {
            path: '/admin/profile',
            name: 'admin-profile',
            component: ProfileView
        }
    ]
})

export default router