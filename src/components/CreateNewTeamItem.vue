<template>
    <main>
        <h1>Register A New Team</h1>
        <div class="team-sign-up">
      <form @submit.prevent="signup">
        <div>
          <label for="TeamName">Team Name </label>
          <input type="TeamName" v-model="name" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="signupSuccess">Team Registration was successful</p>
    </div>
    </main>
</template>

<script>
import axios from '@/axios';
import { useTeamStore } from '@/stores/teamStore'
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
     const teamStore = useTeamStore()
     try {
       const result = await axios.post('teams',{"name": this.name})
       this.signupSuccess = result.data
       teamStore.addTeam(result.data)
     } catch (error) {
       this.errorMessage = error.message + ":\n"
       // + error.response.data.detail
     }
   }
   }
 };
 </script>