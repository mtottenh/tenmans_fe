<template>
  <v-container fluid>
    <v-card v-if="fixture">
      <v-card-title>Fixture Details</v-card-title>
      <v-card-text>
        <v-table>
          <tbody>
            <tr>
              <th class="primary-text"><strong>Season:</strong></th>
              <th>{{ fixture.season }}</th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th class="primary-text"><strong>Teams:</strong></th>
              <th><span v-if="team1">{{ team1.name }}</span> </th>
              <th>vs</th>
              <th><span v-if="team2">{{ team2.name }}</span></th>
            </tr>
            <tr>
              <th>
                <strong>Scheduled At:</strong>
              </th>
              <th>{{ formattedScheduledDate }}</th>
            </tr>
          </tbody>
        </v-table>

        <v-card v-if="!result">
          <v-card-title>Reschedule Match</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="newScheduledDate" type="datetime-local" required class="mt-required" clearable
                label="Reschedule Date"></v-text-field>
              <v-btn @click="updateFixtureDate">Update Date</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card v-if="result">
          <!-- Display result -->
          <v-card-title v-if="result.confirmed">Result</v-card-title>
          <v-card-title v-else>Result Pending Confirmation</v-card-title>
          <v-card-text>
            <p>{{ team1 ? team1.name : 'Team 1' }}: {{ result.score_team_1 }}</p>
            <p>{{ team2 ? team2.name : 'Team 2' }}: {{ result.score_team_2 }}</p>
          </v-card-text>
          <v-btn v-if="!result.confirmed" @click="confirmResult" > Confirm Result</v-btn>
        </v-card>
          <!-- Input and submit new result -->
          <v-card v-else>
            <v-card-title>Submit Results</v-card-title>
            <v-card-text>
              <v-form title="Submit Results">
                <v-text-field v-model="newResult.score_team_1" type="number" required class="mt-required">{{ team1
                  ? team1.name : 'Team 1' }}:</v-text-field>
                <v-text-field v-model="newResult.score_team_2" type="number" required class="mt-required">{{ team2
                  ? team2.name : 'Team 2' }}:</v-text-field>
                <v-btn @click="submitResult">Submit Result</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-title>Loading fixture data...</v-card-title>
    </v-card>
  </v-container>
</template>
  
  <script>
  
  import axios from '@/axios';
  
  export default {
    data() {
      return {
        fixture: null,           // Stores fixture data
        result: null,            // Stores result data
        newScheduledDate: "",    // Stores new date for rescheduling
        team1: null,
        team2: null,
        newResult: {             // Stores scores for updating the result
          score_team_1: 0,
          score_team_2: 0,
        },
      };
    },
    computed: {
      // Compute the formatted date for display purposes
      formattedScheduledDate() {
        return this.formatDateTime(this.newScheduledDate);
      },
    },
    async beforeMount() {
      await this.fetchFixture();
      await this.fetchResult();
      await this.fetchTeamDetails();
    },
    methods: {
      async fetchFixture() {
        try {
          const fixtureId = this.$route.params.id; // Assumes a route param 'id'
          const response = await axios.get(`fixtures/${fixtureId}`);
          this.fixture = response.data;
          this.newScheduledDate = this.fixture.scheduled_at;
        } catch (error) {
          console.error("Error fetching fixture:", error);
        }
      },
      async fetchTeamDetails() {
      try {
        // Fetch details for team_1
        if (this.fixture.team_1) {
          const responseTeam1 = await axios.get(`teams/id/${this.fixture.team_1}`);
          this.team1 = responseTeam1.data;
        }

        // Fetch details for team_2
        if (this.fixture.team_2) {
          const responseTeam2 = await axios.get(`teams/id/${this.fixture.team_2}`);
          this.team2 = responseTeam2.data;
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    },
      async fetchResult() {
        try {
          const fixtureId = this.$route.params.id;
          const response = await axios.get(`fixtures/${fixtureId}/result`);
          this.result = response.data;
        } catch (error) {
          console.error("Error fetching result:", error);
        }
      },
      async confirmResult() {
        try {
          const fixtureId = this.$route.params.id;
          const response = await axios.patch(`fixtures/${fixtureId}/result/confirm`);
          this.result = response.data;
          
        } catch (error) {
          alert(error.response.data.detail)
          console.error("Error fetching result:", error);
        }
      },
      formatScheduledDate() {
        // Format `newScheduledDate` as "YYYY-MM-DD HH:mm"
        this.newScheduledDate = this.formatDateTime(this.newScheduledDate);
      },
      formatDateTime(dateStr) {
        // Format date to "YYYY-MM-DD HH:mm"
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Return the original string if invalid
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      async updateFixtureDate() {
        try {
          const fixtureId = this.$route.params.id;
          const updatedData = { scheduled_at: this.newScheduledDate };
          await axios.patch(`fixtures/${fixtureId}`, updatedData);
          alert("Date updated successfully!");
          this.fetchFixture(); // Refresh the fixture data after update
        } catch (error) {
          console.error("Error updating fixture date:", error);
        }
      },
      async submitResult() {
        try {
          const fixtureId = this.$route.params.id;
          const resultData = {
            fixture_id: fixtureId,
            score_team_1: this.newResult.score_team_1,
            score_team_2: this.newResult.score_team_2,
          };
          const respose = await axios.post(`fixtures/${fixtureId}/result`, resultData);
          this.result = response.data;
          alert("Result submitted successfully!");
          this.fetchResult(); // Refresh the result data after submission
        } catch (error) {
          console.error("Error submitting result:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optional styling */
  label {
    display: block;
    margin-top: 10px;
  }
  input {
    margin-right: 10px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  
