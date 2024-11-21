<template>
    <div class="season-rank-table">
      <h2>League Standings</h2>
      <v-table>
        <thead>
          <tr>
            <th></th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in sortedStandings" :key="team.teamId">
            <td><v-img :src="getLogo(team.teamId)"></v-img></td>
            <td>{{ getTeamName(team.teamId) }}</td>
            <td>{{ team.played }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.drawn }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.points }}</td>
          </tr>
        </tbody>
    </v-table>
    </div>
  </template>
  
  <script>
  import axios from '@/axios';
  export default {
    name: 'SeasonRankTable',
    methods:{
      getLogo: function(team_id) {
          try {
            const url = '/teams/id/' + team_id + '/logo';
            const uri =  axios.getUri({url})
            return uri
          } catch (error ){
              console.log(error)
          }
      }
    },
    props: {
      standings: {
        type: Array,
        required: true,
      },
      getTeamName: {
        type: Function,
        required: true,
      },
    },
    computed: {
      sortedStandings() {
        // Sort standings by points (descending) and then by the team name for tie-breaking
        return this.standings.sort((a, b) => {
          if (b.points === a.points) {
            return this.getTeamName(a.teamId).localeCompare(this.getTeamName(b.teamId));
          }
          return b.points - a.points;
        });
      },
    },
  };
  </script>
