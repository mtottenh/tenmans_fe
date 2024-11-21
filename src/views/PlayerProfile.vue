<template>
    <div class="PlayerProfile">
        <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-card
      dark
      title="Player Profile"
      class="px-5 py-3"
    >
      <v-table>
            <tbody>
            <tr>
                <th class="primary--text">Name</th>
                <th>{{  user.name }}</th>
                
            </tr>
            <tr>
                <th class="primary--text">Email</th>
                <th>{{ user.email }}</th>
            </tr>
            <tr>
                <th class="primary--text">SteamID</th>
                <th>{{ user.SteamID }}</th>
            </tr>
            <tr>
                <th class="primary--text">Signup Date</th>
                <th>{{ user.created_at }}</th>
            </tr>
            <tr>
                <th class="primary--text">Last Modified</th>
                <th>{{ user.update_at }}</th>
            </tr>
        </tbody>
    </v-table>
</v-card>
  </v-container>

        <p v-if="errorMessage" class="error">{{  errorMessage }}</p>
    </div>
</template>
<script>
import axios from '@/axios'
import { useRoute } from 'vue-router';
import VComponent from '@/components/base/VComponent.vue';
import { VTable } from 'vuetify/lib/components/index.mjs';

export default {
    data() {
        return {
        user: '',
        active_season: '',
        errorMessage: ''
        }
    },
    components: {
        VComponent,
        VTable,
    },
    methods: {
        async getPlayerDetails() {
            try {
                const route = useRoute();
                if (route.params.name) {
                    const response = await axios.get("/players/name/" + route.params.name)
                    this.user = response.data
                } else {
                    const response = await axios.get(`/players/me`)
                    this.user = response.data
                }
                
                
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    },
    async beforeMount() {
        await this.getPlayerDetails();
    },
};
</script>