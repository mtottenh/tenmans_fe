import { defineStore } from 'pinia';

export const useTeamStore = defineStore('team', {
    state: () => ({
        teams: []
    }),
    getters: {
        getTeams: (state) => state.teams
    },
    actions: {
        addTeam(team) {
            this.teams.push(team)
            this.teams.sort((a,b) => { return a.name.localeCompare(b.name)  })
        },
        clearTeams() {
            this.teams.length = 0
        }
    }


});