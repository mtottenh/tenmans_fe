import { defineStore } from 'pinia';

export const useTeamMemberStore = defineStore('teamMember', {
    state: () => ({
        activeMembers: [],
        pendingMembers: [],
        team: null,
        captains: [],
    }),
    getters: {
        getActiveMembers: (state) => state.activeMembers,
        getPendingMembers: (state) => state.pendingMembers,
        getTeam: (state) => state.team,
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
        setTeam(t) {
            this.team = t
        },
        setCaptains(c) {
            this.captains = c
        },
        clearActiveMembers() {
            this.activeMembers.length = 0
        },
        clearPendingMembers() {
            this.pendingMembers.length = 0
        },
        clear(){
            this.clearActiveMembers();
            this.clearPendingMembers();
        }
    }
});