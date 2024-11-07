import { defineStore } from 'pinia';

export const useTeamMemberStore = defineStore('teamMember', {
    state: () => ({
        activeMembers: [],
        pendingMembers: [],
        team_name: '',
        captains: [],
    }),
    getters: {
        getActiveMembers: (state) => state.activeMembers,
        getPendingMembers: (state) => state.pendingMembers,
        getTeamName: (state) => state.team_name,
        getCaptains: (state) => state.captains
    },
    actions: {
        addPenddingMember(player) {
            this.pendingMembers.push(player)
            this.pendingMembers.sort((a,b) => { return a.name.localeCompare(b.name)  })
        },
        addActiveMember(player) {
            this.activeMembers.push(player)
            this.activeMembers.sort((a,b) => { return a.name.localeCompare(b.name)  })
        },
        setMemberActive(player) {
            const player_obj_idx = this.pendingMembers.findIndex( p => p.uid == player.uid);
            if (player_obj_idx !== -1) {
                this.addActiveMember(this.pendingMembers.splice(player_obj_idx,1)[0])
            }

        },
        setTeamName(t) {
            this.team_name = t
        },
        setCaptains(c) {
            this.captains = c
        },
        clearActiveMembers() {
            this.activeMembers = []
        },
        clearPendingMembers() {
            this.pendingMembers = []
        },
        clearCaptains() {
            this.captains = []
        },
        clearTeam() {
            this.team_name = '';
        },
        clear(){
            this.clearCaptains();
            this.clearTeam();
            this.clearActiveMembers();
            this.clearPendingMembers();

        }
    }
});