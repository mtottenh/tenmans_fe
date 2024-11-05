<template>
    <div class="team">
    <h1 v-if="this.team">Team: {{ team.name }} </h1>
    <h2>Captains</h2>
    <ul v-if="this.captains">
        <li v-for="c in this.captains"> {{ c.name }}</li>
    </ul>
    <h2>Active Roster</h2>
    <ul>
        <li v-for="p in this.active_members">{{ p.name }}</li>
    </ul>
    <h2>Join Requests</h2>
    <ul>
        <li v-for="p in this.pending_members">{{ p.name }} <button v-if="this.currentUserIsCaptain()" @click="acceptJoinRequest(p.uid)" > Accept Request</button></li>
    </ul>
    {{ this.errorMessage }}
</div>
</template>

<script>
    import axios from '@/axios'
    import { useAuthStore } from '@/stores/authStore';
import { useTeamMemberStore } from '@/stores/teamMemberStore';
    export default {
        setup () {
            const teamMemberStore = useTeamMemberStore();
            const authStore = useAuthStore();
            var errorMessage='';

            const  getTeamDetails = async (teamName) => {
                try {
                    const currentUserId = authStore.getPlayerId();
                    teamMemberStore.clear();
                    const response = await axios.get('/teams/name/' + teamName)
                    teamMemberStore.setTeam(response.data);
                    const captain_response = await axios.get('/teams/name/' + teamName + '/captains')
                    teamMemberStore.setCaptains(captain_response.data);
                    const roster_response = await axios.get('/teams/name/' + teamName + '/roster')
                    console.log(roster_response.data[0])
                    roster_response.data.forEach((p) => {
                        console.log("Checking " + p.player.name)
                        if (p.pending) {
                            console.log("Adding pending member: " + p.player.name)
                            teamMemberStore.addPenddingMember(p.player);
                        } else {
                            console.log("Adding active member: " + p.player.name)
                            teamMemberStore.addActiveMember(p.player);
                        }
                    });
                } catch (error) {
                    console.log(error)
                    errorMessage = error.message
                }
                console.log("Team " + teamMemberStore.team.name)
            }
            const acceptJoinRequest = async (player_uid) => {
                try {
                    console.log("Sending PATCH request")
                    const team_name = teamMemberStore.team.name
                    const response = await axios.patch('/teams/name/' + team_name + '/roster/active', { 'player': { 'id' : player_uid}} )
                    teamMemberStore.setMemberActive({uid: player_uid})
                } catch (error) {
                    console.log(error)
                    errorMessage = error.message
                }
            }
            const currentUserIsCaptain = () => {
                const currentUserId = authStore.getPlayerId();
                return  teamMemberStore.captains.some( player => player.uid === currentUserId)
            }
            return { errorMessage: '', active_members: teamMemberStore.activeMembers, pending_members: teamMemberStore.pendingMembers, team: teamMemberStore.team, captains: teamMemberStore.captains,  currentUserIsCaptain, getTeamDetails, acceptJoinRequest, } 
        },
        async beforeMount() {
            await this.getTeamDetails(this.$route.params.name);
        },

    };
</script>