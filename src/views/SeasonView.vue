<script setup>
import axios from '@/axios';
import SeasonRankTable from '@/components/SeasonRankTable.vue';
import { onMounted, ref, computed } from 'vue';

const loading = ref(true);
const error = ref(null);
const teams = ref({});
const fixtures = ref([]);
const rounds = ref([]);
const groupedFixtures = ref({});
const standings = ref({});

// Load team information and active rosters
const loadActiveTeams = async () => {
  try {
    const response = await axios.get('teams');
    for (const team of response.data) {
      const roster = await axios.get(`teams/name/${team.name}/roster/active`);
      teams.value[team.id] = {
        name: team.name,
        activeRoster: roster.data,
      };
    }
  } catch (err) {
    error.value = 'Failed to load active teams';
    console.error(err);
  }
};

// Load fixtures for the current season
const loadFixtures = async () => {
  try {
    const response = await axios.get('fixtures/current_season');
    fixtures.value = response.data.map((elem) => elem[0]);
    rounds.value = response.data.map((elem) => elem[1]);
    await loadResultsForCompletedFixtures();
    calculateStandings();
  } catch (err) {
    error.value = 'Failed to load fixtures';
    console.error(err);
  }
};

// Load results for each fixture and organize into completed/pending
const loadResultsForCompletedFixtures = async () => {
  const resultFetches = fixtures.value.map(async (fixture) => {
    if (! fixture.result) {
      try {
        const resultResponse = await axios.get(`fixtures/${fixture.id}/result`);
        fixture.result = resultResponse.data;
      } catch (err) {
        if (err.response.status != 404) {
          console.error(`Failed to load result for fixture ${fixture.id}`, err);
        }
      }
    }
  });
  await Promise.all(resultFetches);
  organizeFixtures();
};

// Organize fixtures by round, grouping pending/completed
const organizeFixtures = () => {
  groupedFixtures.value = fixtures.value.reduce((acc, fixture) => {
    const roundId = fixture.round_id;
    const round = rounds.value.find((element) => element.id === roundId);
    const keyField = round.type.concat(" ", round.round_number);

    if (!acc[keyField]) {
      acc[keyField] = { pending: [], completed: [] };
    }

    if (fixture.result) {
      acc[keyField].completed.push(fixture);
    } else {
      acc[keyField].pending.push(fixture);
    }

    return acc;
  }, {});
};

// Calculate standings based on "Group Stage" fixtures
const calculateStandings = () => {
  standings.value = {};

  fixtures.value
    .filter(fixture => rounds.value.find(round => round.id === fixture.round_id)?.type === 'Group Stage')
    .forEach(fixture => {
      const { team_1, team_2, result } = fixture;
      

      if (!standings.value[team_1]) standings.value[team_1] = createTeamStats(team_1);
      if (!standings.value[team_2]) standings.value[team_2] = createTeamStats(team_2);
      if (!result) return;
      // Update standings based on match result
      if (result.score_team_1 > result.score_team_2) {
        updateTeamStats(standings.value[team_1], 'win');
        updateTeamStats(standings.value[team_2], 'loss');
      } else if (result.score_team_1 < result.score_team_2) {
        updateTeamStats(standings.value[team_1], 'loss');
        updateTeamStats(standings.value[team_2], 'win');
      } else {
        updateTeamStats(standings.value[team_1], 'draw');
        updateTeamStats(standings.value[team_2], 'draw');
      }
    });
};

const createTeamStats = (teamId) => ({
  teamId,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  points: 0
});

const updateTeamStats = (teamStats, outcome) => {
  teamStats.played += 1;
  if (outcome === 'win') {
    teamStats.won += 1;
    teamStats.points += 3;
  } else if (outcome === 'draw') {
    teamStats.drawn += 1;
    teamStats.points += 1;
  } else if (outcome === 'loss') {
    teamStats.lost += 1;
  }
};

// Get team name for display
const getTeamName = (teamId) => {
  return teams.value[teamId]?.name || 'Unknown Team';
};

// Format date and time
const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString();
};

// Sort rounds for display
const reversedRounds = computed(() => {
  return Object.keys(groupedFixtures.value).sort();
});

const getScoreClass = (fixture, team) => {
  const score1 = fixture.result?.score_team_1 || 0;
  const score2 = fixture.result?.score_team_2 || 0;

  if (team === 'team_1' && score1 > score2) return 'highlight'; // Team 1 wins
  if (team === 'team_2' && score2 > score1) return 'highlight'; // Team 2 wins
  return ''; // No special class for draws or losses
};

// Load all data on component mount
onMounted(async () => {
  try {
    loading.value = true;
    await loadActiveTeams();
    await loadFixtures();
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-card>
    <v-card-title> Current Season Fixtures & Standings</v-card-title>
    <v-card-text>
  <div class="fixtures-list">

    <div v-if="loading" class="loading" color="pink">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <!-- League Standings Table -->
    <div v-else>
        <SeasonRankTable :standings="Object.values(standings)" :getTeamName="getTeamName" />
      <!-- Iterate over rounds in reverse order -->
      <div v-for="round in reversedRounds" :key="round">
        <v-expansion-panels accordion>

          <v-expansion-panel :title="round" v-if="groupedFixtures[round].pending.length || groupedFixtures[round].completed.length">
            <v-expansion-panel-text>
        <!-- Pending Fixtures -->
        <div v-if="groupedFixtures[round].pending.length">

          <h3>Pending Fixtures</h3>

            <v-list >
            <v-list-item v-for="fixture in groupedFixtures[round].pending.slice().reverse()" :key="fixture.id">
              <router-link class="fixture-link" :to="{ name: 'Fixture', params: {id: fixture.id }}">
                {{ getTeamName(fixture.team_1) }} vs. {{ getTeamName(fixture.team_2) }} 
              </router-link> - Scheduled at: {{ formatDateTime(fixture.scheduled_at) }}
            </v-list-item>
            </v-list>
        </div>
        <!-- Completed Fixtures -->
        <div v-if="groupedFixtures[round].completed.length">
          <h3>Completed Fixtures</h3>
          <v-list>
            <v-list-item v-for="fixture in groupedFixtures[round].completed.slice().reverse()" :key="fixture.id">
              <div class="fixture-result">
                <router-link class="fixture-link" :to="{ name: 'Fixture', params: {id: fixture.id }}">
                <span :class="getScoreClass(fixture, 'team_1')">
                  {{ getTeamName(fixture.team_1) }}: {{ fixture.result?.score_team_1 }}
                </span>
                <span class="team-vs">vs.</span>
                <span :class="getScoreClass(fixture, 'team_2')">
                  {{ getTeamName(fixture.team_2) }}: {{ fixture.result?.score_team_2 }}
                </span>
              </router-link>
              </div>

            </v-list-item>
          </v-list>

        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
      </v-expansion-panels>
      </div>
    </div>
  </div>
</v-card-text>
</v-card>
</template>

<style scoped>
.loading {
  color: rgb(205, 81, 36);
}
.fixture-link {
  color: #FFB300;
}
.error {
  color: red;
}

.fixture-result {
  display: flex;
  align-items: center;
}
.highlight {
  font-weight: bold;
  color:  rgb(205, 81, 36);
}
.team-vs {
  margin-left: 5px;
  margin-right: 5px;
}
</style>