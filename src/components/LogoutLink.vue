<!-- src/components/LogoutButton.vue -->

<template>
  <RouterLink :to="{ name: 'Login' }" @click.prevent="handleLogout">Logout</RouterLink>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default {
  name: 'LogoutLink',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
      await authStore.logout();
      router.push({ name: 'Login' }); // Redirect to login page or other desired route
    };

    return { handleLogout };
  },
};
  </script>