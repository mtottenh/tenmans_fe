<template>
  <v-card>
    <v-card-title>
      Season Settings
    </v-card-title>
    <v-card-text>
      <v-card>
        <v-card-title>Current Active Season</v-card-title>
        <v-card-text>
          <v-table v-if="season">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Stage</th>
                <th>Created</th>
              </tr>
              <tr>
                <th><router-link :to="{name:'SeasonAdminView', params: { id: season.id }}">{{season.name}}</router-link></th>
                <th>{{ season.state }}</th>
                <th>{{ season.created_at }}</th>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Create a new League Season</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="name" required>Season Name</v-text-field>
            <v-btn @click="signup">Create</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
        <!-- <h1>Create a new League Season</h1>
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
     -->
</template>

<script>
import axios from '@/axios';
 export default {
   data() {
     return {
       name: '',
       errorMessage: '',
       signupSuccess: '',
       season: null
     };
   },
   methods: {
   async signup() {
     try {
       const result = await axios.post('seasons',{"name": this.name})
       this.signupSuccess = result.data
     } catch (error) {
       this.errorMessage = error.message + ":\n" + error.response
     }
   },
   async loadCurrentSeason() {
    try {
      const result = await axios.get('seasons/active')
      this.season = result.data
    } catch (error) {
      this.errorMessage = error.message + ":\n" + error.response
    }
   }
  
   },
   async beforeMount() {
    await this.loadCurrentSeason();
   }
 };
 </script>