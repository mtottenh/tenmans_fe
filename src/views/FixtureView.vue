<template>
    <div>
      <h1>Fixture Details</h1>
      
      <div v-if="fixture">
        <p><strong>Season:</strong> {{ fixture.season }}</p>
        
        <!-- Display team details with names -->
        <p><strong>Teams:</strong> 
          <span v-if="team1">{{ team1.name }}</span> vs <span v-if="team2">{{ team2.name }}</span>
        </p>
        
        <!-- Display and update scheduled date -->
        <p><strong>Scheduled At:</strong> {{ formattedScheduledDate }}</p>
        <label for="newDate">Reschedule Date:</label>
        <input 
          type="datetime-local" 
          v-model="newScheduledDate" 
          @change="formatScheduledDate"
        />
        <button @click="updateFixtureDate">Update Date</button>
  
        <!-- Display result -->
        <h2>Result</h2>
        <div v-if="result">
          <p>{{ team1 ? team1.name : 'Team 1' }}: {{ result.score_team_1 }}</p>
          <p>{{ team2 ? team2.name : 'Team 2' }}: {{ result.score_team_2 }}</p>
        </div>
        <div v-else>
          <p>No result yet.</p>
        </div>
  
        <!-- Input and submit new result -->
        <label for="scoreTeam1">Score for {{ team1 ? team1.name : 'Team 1' }}:</label>
        <input type="number" v-model="newResult.score_team_1" min="0" />
  
        <label for="scoreTeam2">Score for {{ team2 ? team2.name : 'Team 2' }}:</label>
        <input type="number" v-model="newResult.score_team_2" min="0" />
  
        <button @click="submitResult">Submit Result</button>
      </div>
      <div v-else>
        <p>Loading fixture data...</p>
      </div>
    </div>
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
          await axios.post(`fixtures/${fixtureId}/result`, resultData);
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
  