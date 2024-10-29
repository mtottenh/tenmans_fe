<template>
    <main>
        <h1>Sign-Up to the CS2 10 man group!</h1>
        <div class="sign-up">
      <form @submit.prevent="signup">
        <div>
          <label for="email">Email </label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="user">Username </label>
          <input type="username" v-model="name" required />
        </div>
        <div>
          <label for="SteamID">Steam ID </label>
          <input type="SteamID" v-model="SteamID" required />
        </div>
        <div>
          <label for="password">Password </label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Sign-Up</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="signupSuccess">Sign up was successful. Please Login with your new account</p>
    </div>
    </main>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import axios from '@/axios';
 export default {
   data() {
     return {
       name: '',
       email: '',
       password: '',
       SteamID: '',
       errorMessage: '',
       signupSuccess: ''
     };
   },
   methods: {
   async signup() {
     const authStore = useAuthStore();

     try {

       const result = await axios.post('players/signup',{"name": this.name, "email":this.email, "SteamID":this.SteamID, "password":this.password})
       this.signupSuccess = result.data
     } catch (error) {
       this.errorMessage = error.message + ":\n" + error.response.data.detail
     }
   }
   }
 };
 </script>