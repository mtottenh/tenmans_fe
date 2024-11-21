<template>
  <v-layout>
    <v-expansion-panels accordion>
      <v-expansion-panel title="Register a new Team">
        <v-expansion-panel-text>
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <v-text-field v-model="name" :counter="20" label="Team Name" :rules=[nameRule] class="mt-required"
              required></v-text-field>
            <v-btn :disabled="!valid" @click="validate">Register</v-btn>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <v-snackbar v-model="snackbar">Form submitted successfully
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import axios from '@/axios';
import { useTeamStore } from '@/stores/teamStore'
 export default {
   data() {
     return {
       name: '',
       valid: true,
       snackbar: false,
       teamSubmitted: false,
       lazy: true,
       errorMessage: '',
       signupSuccess: ''
     };
   },
   methods: {
    async validate() {
      this.teamSubmitted = true;
      if (this.$refs.form.validate()) {
        // got valid form, submit it
        this.snackbar = true;
        await this.signup()
      }
    },
    reset() {
      this.teamSubmitted = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.teamSubmitted = false;
      this.$refs.form.resetValidation();
    },
    nameRule(v) {
      if (!v) {
        return "Name is required";
      }
      if (!(v && v.length >= 3 && v.length <= 20)) {
        return "Team name must be 3-20 characters long";
      }
      return true;
    },
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