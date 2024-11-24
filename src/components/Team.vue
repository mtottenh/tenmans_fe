<template>
    <div class="team">
        <h1  v-if="team_name">Team: {{ team_name }} </h1>
        <h2>Captains</h2>
        <v-list v-if="captains">
            <v-list-item v-for="c in captains" :key="c.uid">
                <router-link class="player-router-link" :to="{ name: 'PlayerProfile', params: { name: c.name } }">{{ c.name }}</router-link>
            </v-list-item>
        </v-list>
        <h2>Active Roster</h2>
        <v-list>
            <v-list-item v-for="p in active_members" :key="p.uid">
                <router-link class="player-router-link" :to="{ name: 'PlayerProfile', params: { name: p.name } }">{{ p.name
                    }} </router-link>
                </v-list-item>
        </v-list>
        <div v-if="pending_members.length != 0">
            <h2>Join Requests</h2>
            <v-list>
                <v-list-item v-for="p in pending_members" :key="p.uid">{{ p.name }} <v-btn v-if="currentUserIsCaptain"
                        @click="acceptJoinRequest(p.uid)"> Accept Request</v-btn></v-list-item>
            </v-list>
        </div>
        {{ errorMessage }}
    </div>
</template>
<style scoped>
.player-router-link{
    color: #FF6F00;
}
</style>
<script>
import { computed, onMounted, watch } from 'vue';
import axios from '@/axios';
import { useAuthStore } from '@/stores/authStore';
import { useTeamMemberStore } from '@/stores/teamMemberStore';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const teamMemberStore = useTeamMemberStore();
        const authStore = useAuthStore();
        let errorMessage = '';

        // Computed properties for reactive store data
        const captains = computed(() => teamMemberStore.captains);
        const active_members = computed(() => teamMemberStore.activeMembers);
        const pending_members = computed(() => teamMemberStore.pendingMembers);
        const team_name = computed(() => teamMemberStore.team_name);

        const getTeamDetails = async (teamName) => {
            try {
                const response = await axios.get('/teams/name/' + teamName);
                teamMemberStore.setTeamName(response.data.name);

                const captainResponse = await axios.get('/teams/name/' + teamName + '/captains');
                teamMemberStore.setCaptains([...captainResponse.data]); // Use new array reference

                const rosterResponse = await axios.get('/teams/name/' + teamName + '/roster');
                teamMemberStore.clearActiveMembers();
                teamMemberStore.clearPendingMembers();
                rosterResponse.data.forEach((p) => {
                    if (p.pending) {
                        teamMemberStore.addPenddingMember(p.player);
                    } else {
                        teamMemberStore.addActiveMember(p.player);
                    }
                });
            } catch (error) {
                console.error(error);
                errorMessage = error.message;
            }
        };

        const acceptJoinRequest = async (player_uid) => {
            try {
                const team_name = teamMemberStore.team_name;
                await axios.patch('/teams/name/' + team_name + '/roster/active', { player: { id: player_uid } });
                teamMemberStore.setMemberActive({ uid: player_uid });
            } catch (error) {
                console.error(error);
                errorMessage = error.message;
            }
        };

        const currentUserIsCaptain = computed(() => {
            const currentUserId = authStore.getPlayerId();
            return teamMemberStore.captains.some(player => player.uid === currentUserId);
        });

        const refreshTeamDetails = async (teamName) => {
            teamMemberStore.clear(); // Clear the store data before fetching new details
            await getTeamDetails(teamName); // Fetch new data
        };

        watch(
            () => route.params.name,
            (newTeamName) => {
                refreshTeamDetails(newTeamName); // Refresh details on route change
            },
            { immediate: true } // Load immediately on component mount
        );

        onMounted(() => {
            refreshTeamDetails(route.params.name);
        });

        return {
            errorMessage,
            captains,
            active_members,
            pending_members,
            team_name,
            currentUserIsCaptain,
            acceptJoinRequest
        };
    },
};
</script>
