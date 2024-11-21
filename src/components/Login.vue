<!-- src/components/Login.vue -->
<template>
    <div class="login">
      <h2>Login</h2>
      <v-form @submit.prevent="login">
        <v-text-field
          v-model="email"
          type="email"
          required
          class="mt-required"
          label="Email"
        >
        </v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          required
          class="mt-required"
          label="Password"
        >
        </v-text-field>
        <v-btn @click="login">Login</v-btn>
      </v-form>
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