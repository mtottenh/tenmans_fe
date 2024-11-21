<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LogoutLink from '@/components/LogoutLink.vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const getLinksForRole = (links) => {
      const role = authStore.getRole();
      return links.filter( (item) => (item.notLoggedIn && !authStore.isAuthenticated) || (authStore.isAuthenticated && !item.notLoggedIn && (!item.role || item.role == role)));
    }

</script>
<template>
  <v-app>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title color="secondary">CS2 10 Mans</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- Navigation Links -->
      <v-btn v-for="link in getLinksForRole(links)" :key="link.path" text>
        <router-link :to="link.path" class="nav-link">{{ link.name }}</router-link>
      </v-btn>
  </v-app-bar>

  <!-- Main Content with Route Rendering -->
  <v-main>
    <router-view />
  </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { name: 'Home', path: '/' },
        { name: 'My Profile', path: '/me' },
        { name: 'Teams', path: '/teams' },
        { name: 'Sign Up', path: '/signup', notLoggedIn: true },
        { name: 'Logout', path: '/logout' },
        { name: 'Current Season', path: '/seasons/current' },
        { name: 'New Season', path: '/seasons/new', role: 'admin' },
      ]
    };
  },
};
</script>

<style scoped>
.v-toolbar-title {
  color: #FF6F00;
}
.nav-link {
  color: #FF6F00;
  text-decoration: none;
}

.nav-link.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>