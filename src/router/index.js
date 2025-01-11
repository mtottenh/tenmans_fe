// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Login from "@/components/Login.vue";
import Home from "@/views/HomeView.vue";
import Teams from "@/views/TeamListView.vue";
import Team from "@/views/TeamView.vue";
import Profile from "@/views/PlayerProfile.vue";
import SignupView from "@/views/SignupView.vue";
import CreateNewSeasonView from "@/components/CreateNewSeasonItem.vue";
import FixtureView from "@/views/FixtureView.vue";
import SeasonView from "@/views/SeasonView.vue";
import SeasonAdminView from "@/views/SeasonAdminView.vue";
import LogoutLink from "@/components/LogoutLink.vue";
import KnockoutTourney from "@/views/KnockoutTourney.vue";
import PugView from "@/views/PugView.vue";
import NewPug from "@/views/NewPug.vue";
import ClaudePugManager from "@/components/ClaudePugManager.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/me",
    name: "MyPlayerProfile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/player/:name",
    name: "PlayerProfile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams",
    name: "Teams",
    component: Teams,
    meta: { requiresAuth: true },
  },
  {
    path: "/seasons/new",
    name: "CreateNewSeasonView",
    component: CreateNewSeasonView,
    meta: { requiresAuth: true },
  },
  {
    path: "/seasons/current",
    name: "SeasonView",
    component: SeasonView,
    meta: { requiresAuth: true },
  },
  {
    path: "/seasons/tournament",
    name: "Tournament",
    component: KnockoutTourney,
    meta: { requiresAuth: true },
  },
  {
    path: "/pugs/id/:id",
    name: "PugView",
    component: PugView,
    meta: { requiresAuth: true },
  },
  {
    path: "/pugs/c/id/:id",
    name: "ClaudePugManager",
    component: ClaudePugManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/pugs/new",
    name: "NewPug",
    component: NewPug,
    meta: { requiresAuth: true },
  },
  {
    path: "/seasons/:id/admin",
    name: "SeasonAdminView",
    component: SeasonAdminView,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams/:name",
    name: "Team",
    component: Team,
    meta: { requiresAuth: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
  },
  {
    path: "/fixtures/:id",
    name: "Fixture",
    component: FixtureView,
    meta: { requiresAuth: true },
  },
  {
    path: "/logout",
    name: "Logout",
    component: LogoutLink,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
