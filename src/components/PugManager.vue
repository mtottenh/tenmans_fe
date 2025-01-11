<template>
    <v-container>
      <v-row>
        <!-- Team Tables -->
        <v-col cols="6">
          <v-card outlined>
            <v-card-title>{{ team1_name }}</v-card-title>
            <v-card-text>
              <v-data-table :headers="teamHeaders" :items="team1" class="elevation-1">
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="joinTeam(team1_name)" color="warning">Join {{ team1_name }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card outlined>
            <v-card-title>{{ team2_name }}</v-card-title>
            <v-card-text>
              <v-data-table :headers="teamHeaders" :items="team2" item-value="name" class="elevation-1">
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="joinTeam(team2_name)" color="warning">Join {{ team2_name }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Map Pool Table -->
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-title>Map Pool</v-card-title>
            <v-card-text>
              <v-data-table :headers="mapPoolHeaders" :items="mapPool" item-value="name" class="elevation-1">
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Chat Box -->
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-title>Chat</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item v-for="(msg, index) in chatMessages" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ msg }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-text-field
                v-model="chatMessage"
                label="Enter message"
                outlined
                dense
                class="mr-2"
              ></v-text-field>
              <v-btn @click="sendChat" color="warning" class="mr-2">Chat</v-btn>
              <v-btn @click="sendTeamChat" color="secondary">Team Chat</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script>
  import { ref, reactive, onMounted } from "vue";
  import { v4 as uuidv4 } from "uuid";
  import { createWebSocket } from "@/websocket";
  export default {
    name: "PugManager",
    props: {
      lobby_id: {
        type: String,
        required: true, // Pug ID is now a required prop
      },
      lobby_type: {
        type: String,
        required: true,
      },

      player_name: {
        type: String,
        default: "Player",
      },
    },
    setup(props) {
      // State
      const team1 = ref([]);
      const team2 = ref([]);
      const team1_name = ref("");
      const team2_name  = ref("");
      const mapPool = ref([]);
      const chatMessages = ref([]);
      const chatMessage = ref("");
      const teamHeaders = [{ text: "Player Name", value: "name" }];
      const mapPoolHeaders = [{ text: "Map Name", value: "map" }];
      let seq_no = 1;
      let websocket;

      // Initialize WebSocket and Identify Client
      const connectToWebSocket = () => {
        var type_slug;
        if (props.lobby_type == "pug") {
            type_slug = "fixtures/pug";
        } else {
            type_slug = "fixtures";
        }

        websocket = createWebSocket(`${type_slug}/id/${props.lobby_id}/ws`).connect();

        websocket.onopen = () => {
          console.log("WebSocket connected");
          websocket.send(
            JSON.stringify({
              cmd: "identify_client",
              client_id: uuidv4(),
              seq_no: seq_no++,
            })
          );
        };

        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Message received:", data);
          handleServerMessage(data);
        };
      };

      // Handle server messages
      const handleServerMessage = (data) => {
        if (data.resp === "map_picks") {
          mapPool.value = data.map_pool;
        } else if (data.resp === "team_roster") {
          if (data.team_idx === 1) {
            team1.value = data.players;
            team1_name.value = data.team_name
          } else if (data.team_idx === 2) {
            team2.value = data.players;
            team2_name.value = data.team_name
          }
        } else if (data.resp === "chat" || data.resp == "team_chat") {
          var slug
          if (data.resp === "chat") {
            slug = "[ALL]"
          } else {
            slug = "[TEAM]"
          }
          chatMessages.value.push(`${data.player} ${slug}: ${data.message}`);
        }
      };

      // Join a team
      const joinTeam = (teamName) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(
            JSON.stringify({
              cmd: "join_team",
              name: teamName,
              seq_no: seq_no++,
            })
          );
        }
      };

      // List map pool
      const listMapPool = () => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.send(
            JSON.stringify({
              cmd: "list_map_pool",
              seq_no: seq_no++,
            })
          );
        }
      };

      // Send chat message
      const sendChat = () => {
        if (websocket && websocket.readyState === WebSocket.OPEN && chatMessage.value.trim()) {
          websocket.send(
            JSON.stringify({
              cmd: "chat",
              player: props.player_name,
              message: chatMessage.value.trim(),
              seq_no: seq_no++,
            })
          );
          chatMessage.value = ""; // Clear input field
        }
      };

      // Send team chat message
      const sendTeamChat = () => {
        if (websocket && websocket.readyState === WebSocket.OPEN && chatMessage.value.trim()) {
          websocket.send(
            JSON.stringify({
              cmd: "team_chat",
              player: props.player_name,
              message: chatMessage.value.trim(),
              team: determineTeam(), // Get the player's current team
              seq_no: seq_no++,
            })
          );
          chatMessage.value = ""; // Clear input field
        }
      };

      // Determine player's team based on presence in team lists
      const determineTeam = () => {
        if (team1.value.some((player) => player.name === props.player_name)) {
          return team1_name;
        }
        if (team2.value.some((player) => player.name === props.player_name)) {
          return team2_name;
        }
        return null; // No team assigned
      };

      // Lifecycle hook
      onMounted(() => {
        connectToWebSocket(); // Connect to WebSocket using the pug_id
      });

      return {
        team1,
        team2,
        team1_name,
        team2_name,
        mapPool,
        chatMessages,
        chatMessage,
        teamHeaders,
        mapPoolHeaders,
        joinTeam,
        sendChat,
        sendTeamChat,
      };
    },
  };
  </script>

  <style scoped>
  .v-card {
    margin-bottom: 20px;
  }
  </style>
