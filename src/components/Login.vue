<!-- src/components/Login.vue -->
<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email </label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password </label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
 import { useAuthStore } from '@/stores/authStore';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
    async login() {
      const authStore = useAuthStore();

      try {
        await authStore.login(this.email, this.password);
        this.$router.push({ name: 'Home' });
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
    }
  };
  </script>
  
  <style scoped>
  /* Basic styling */
  .login {
    width: 300px;
    margin: auto;
  }
  .error {
    color: red;
  }
  </style>