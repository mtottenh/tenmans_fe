<template>
   
        <h1>Create a new League Season</h1>
        <div class="league-season-create">
      <form @submit.prevent="signup">
        <div>
          <label for="SeasonName">Season Name </label>
          <input type="SeasonName" v-model="name" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="signupSuccess">Season named '{{  signupSuccess.name }}' created successfuly.</p>
    </div>
    
</template>

<script>
import axios from '@/axios';
 export default {
   data() {
     return {
       name: '',
       errorMessage: '',
       signupSuccess: ''
     };
   },
   methods: {
   async signup() {
     try {
       const result = await axios.post('seasons',{"name": this.name})
       this.signupSuccess = result.data
     } catch (error) {
       this.errorMessage = error.message + ":\n" + error.response.data.detail
     }
   }
   }
 };
 </script>