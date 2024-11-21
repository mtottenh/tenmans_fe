<template>
    <v-container>
      <TournamentBracket :rounds="rounds" :teams="teams" />
    </v-container>
  </template>
  
  <script>
  import TournamentBracket from "@/components/TournamentBracket.vue";
  
  export default {
    components: { TournamentBracket },
    data() {
      return {
        teams: [
          { id: "team-1", name: "Team A" },
          { id: "team-2", name: "Team B" },
          { id: "team-3", name: "Team C" },
          { id: "team-4", name: "Team D" },
          { id: "team-5", name: "Team E" },
          { id: "team-6", name: "Team F" },
          { id: "team-7", name: "Team G" },
          { id: "team-8", name: "Team H" },
          // Add all teams here
        ],
        rounds: [
          {
            id: "round-1",
            season_id: "season-1",
            round_number: 1,
            type: "Group Stage",
            fixtures: [
              {
                id: "fixture-1",
                team_1: "team-1",
                team_2: "team-2",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },
              {
                id: "fixture-2",
                team_1: "team-3",
                team_2: "team-4",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },

              {
                id: "fixture-3",
                team_1: "team-5",
                team_2: "team-6",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },
              {
                id: "fixture-4",
                team_1: "team-7",
                team_2: "team-8",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },
              // Add more fixtures here
            ],
          },
          {
            id: "round-2",
            season_id: "season-1",
            round_number: 2,
            type: "Group Stage",
            fixtures: [
              {
                id: "fixture-5",
                team_1: "team-2",
                team_2: "team-4",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },
              {
                id: "fixture-6",
                team_1: "team-6",
                team_2: "team-8",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 1,
                  score_team_2: 2,
                },
              },
              // Add more fixtures here
            ],
          },
          {
            id: "round-3",
            season_id: "season-1",
            round_number: 2,
            type: "Group Stage",
            fixtures: [
              {
                id: "fixture-7",
                team_1: "team-4",
                team_2: "team-8",
                scheduled_at: "2024-11-20T14:00:00Z",
                result: {
                  confirmed: true,
                  score_team_1: 7,
                  score_team_2: 2,
                },
              },
              // Add more fixtures here
            ],
          },
          // Add more rounds here
        ],
      };
    },
  };
  </script>