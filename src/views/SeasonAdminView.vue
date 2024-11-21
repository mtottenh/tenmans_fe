<template>
    <v-card>
        <v-card-title v-if="season">
            Settings for Season: {{ season.name }}
        </v-card-title>
        <v-card-text>
            <v-card>
                <v-card-title>Teams with Active Rosters:</v-card-title>
                <v-card-text>
                    <v-table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Players On Roster</th>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
            <v-card>
                <v-btn>Generate Group Stage & Lock Teams</v-btn>
            </v-card>
        </v-card-text>
    </v-card>
    {{ errorMessage }}
</template>

<script>
import axios from '@/axios';
import { useRoute } from 'vue-router';
 export default {
   data() {
     return {
       errorMessage: '',
       season: null
     };
   },
   methods: {
   async loadCurrentSeason() {
    try {
      const route = useRoute();
      const result = await axios.get('seasons/id/' + route.params.id)
      this.season = result.data
      this.teams = await axios.get('season/')
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