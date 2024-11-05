// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/components/Login.vue';
import Home from '@/views/HomeView.vue';
import Teams from '@/views/TeamListView.vue'
import Team from '@/views/Team.vue'
import Profile from '@/views/PlayerProfile.vue'
import SignupView from '@/views/SignupView.vue';
import CreateNewSeasonView from '@/components/CreateNewSeasonItem.vue';
import FixtureView  from '@/views/FixtureView.vue';
const routes = [
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/me',
    name: 'PlayerProfile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/teams',
    name: 'Teams',
    component: Teams,
    meta: { requiresAuth: true }
  },
  {
    path: '/seasons/new',
    name: 'CreateNewSeasonView',
    component: CreateNewSeasonView,
    meta: { requiresAuth: true }
  },
  {
    path: '/teams/:name',
    name: 'Team',
    component: Team,
    meta: { requiresAuth: true }
  },
  {
    path: "/signup",
    name: 'Signup',
    component: SignupView
  },
  {
    path: "/fixtures/:id",
    name: 'Fixtures',
    component: FixtureView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;