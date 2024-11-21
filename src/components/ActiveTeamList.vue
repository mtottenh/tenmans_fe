<!-- src/components/ActiveTeamList.vue -->
<template>
    <v-container fluid>
    <v-layout class="d-flex flex-column ga-3">
        <!-- <v-card>
            <v-card-title></v-card-title>
            <v-card-text> -->
            <!-- <v-list>
                <v-list-item v-for="team in this.teams"> -->
                    <v-card class="mx-auto " v-for="team in this.teams">
                        <v-card-title></v-card-title>
                        <v-card-text >

                            <v-btn variant="outlined" color="secondary" :to="{ name: 'Team', params: { name: team.name } }">{{ team.name }}</v-btn> 
                        <!-- <v-card-actions> -->
                            <v-btn  @click="requestRosterJoin(team.name)" append-icon="mdi-chevron-right" variant="outlined" color="secondary"> Request to join Team Roster</v-btn>
                        <!-- </v-card-actions> -->
                        </v-card-text>
                    </v-card>
                <!-- </v-list-item>
            </v-list> -->
        <!-- </v-card-text>
        </v-card> -->
    </v-layout>
</v-container>
</template>


<script>
import axios from '@/axios'
import { useTeamStore } from '@/stores/teamStore';
import { useAuthStore } from '@/stores/authStore';
    export default {

        setup() { 
            const teamStore = useTeamStore();  
            const authStore = useAuthStore();
            var errorMessage = ''   
            const getTeamDetails = async () => {
                try {
                    teamStore.clearTeams()
                    const response = await axios.get('/teams/')
                    for (const t of response.data) {
                        teamStore.addTeam(t)
                    }
                } catch (error) {
                    errorMessage = error.message
                }
            }

            const requestRosterJoin = async (teamName) => {
                const player_uid = authStore.getPlayerId()
                console.log("Player " + player_uid +  " Joining team " + teamName)
                const response = await axios.patch('/teams/name/' + teamName + '/roster', { players: [ { id: player_uid} ] })
            }
            return { teams: teamStore.teams, errorMessage: '', getTeamDetails, requestRosterJoin }
        },

        async beforeMount() {
            await this.getTeamDetails();
        },

    };
</script>
<style scoped>
.team-req-btn-div {
    margin-left: 5px;
    margin-right: 5px;
}
.team-router-link {
    color: #FFB300;
}
</style>