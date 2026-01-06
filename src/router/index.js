import { createRouter, createWebHistory } from 'vue-router'

// 1. IMPORT SEMUA HALAMAN
import HomeView from '../views/public/HomeView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import ProjectAddView from '../views/admin/ProjectAddView.vue'
import ProjectEditView from '../views/admin/ProjectEditView.vue'
import ProfileView from '../views/admin/ProfileView.vue'
import ManageDataView from '../views/admin/ManageDataView.vue' // <--- PASTIKAN INI ADA

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/admin', name: 'dashboard', component: DashboardView },
        { path: '/admin/add', name: 'project-add', component: ProjectAddView },
        { path: '/admin/edit/:id', name: 'project-edit', component: ProjectEditView },
        { path: '/admin/profile', name: 'admin-profile', component: ProfileView },

        // 2. DAFTARKAN RUTE INI (Penyebab Error Anda)
        {
            path: '/admin/manage',
            name: 'manage-data',
            component: ManageDataView
        }
    ]
})

export default router