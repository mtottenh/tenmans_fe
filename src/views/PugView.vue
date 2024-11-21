<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <!-- Loading Spinner -->
          <v-card v-if="loading" outlined>
            <v-card-text>
              <v-progress-circular indeterminate color="primary" class="ma-4"></v-progress-circular>
              <span>Creating Pug...</span>
            </v-card-text>
          </v-card>
  
          <!-- Error Message -->
          <v-alert v-else-if="error" type="error" outlined>
            {{ error }}
          </v-alert>
  
          <!-- PugManager Component -->
          <PugManager
            v-else
            :lobby_id="pugId"
            lobby_type="pug"
            team_1_name="Alpha Team"
            team_2_name="Bravo Team"
            player_name="JohnDoe"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from "@/axios";
  import { ref, onMounted } from "vue";
  import PugManager from "@/components/PugManager.vue";
  
  export default {
    name: "PugView",
    components: {
      PugManager,
    },
    setup() {
      const pugId = ref(null);
      const loading = ref(true);
      const error = ref(null);
  
      const createPug = async () => {
        try {
          const response = await axios.post("/fixtures/new_pug", { team_1 : "Alpha Team", team_2: "Bravo Team"});
          pugId.value = response.data.id;
        } catch (err) {
          console.error("Error creating Pug:", err);
          error.value = "Failed to create Pug. Please try again.";
        } finally {
          loading.value = false;
        }
      };
  
      // Fetch Pug ID on component mount
      onMounted(() => {
        createPug();
      });
  
      return {
        pugId,
        loading,
        error,
      };
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin-top: 20px;
  }
  </style>
  