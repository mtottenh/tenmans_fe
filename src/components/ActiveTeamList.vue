<!-- src/components/ActiveTeamList.vue -->
<template>
    <div class="active-team-list">
       <li v-for="team in this.teams"><router-link :to="{ name: 'Team', params: { name: team.name}}">{{ team.name }}</router-link>
        <button @click="requestRosterJoin(team.name)">Request to join Team Roster</button>
      <!--<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="signupSuccess">Season named '{{  signupSuccess.name }}' created successfuly.</p>
      -->
       </li>
    </div>
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