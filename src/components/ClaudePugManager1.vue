<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    matchId: {
        type: String,
        required: true,
    },
    wsUrl: {
        type: String,
        required: true,
    },
});

// WebSocket state
const socket = ref(null);
const isConnected = ref(false);

// Game state
const maps = ref([
    { name: "Ancient", status: "pending", image: "/maps/ancient.jpg" },
    { name: "Anubis", status: "pending", image: "/maps/anubis.jpg" },
    { name: "Inferno", status: "pending", image: "/maps/inferno.jpg" },
    { name: "Mirage", status: "pending", image: "/maps/mirage.jpg" },
    { name: "Nuke", status: "pending", image: "/maps/nuke.jpg" },
    { name: "Overpass", status: "pending", image: "/maps/overpass.jpg" },
    { name: "Vertigo", status: "pending", image: "/maps/vertigo.jpg" },
]);

// UI state
const currentTeam = ref("team1");
const phase = ref("ban");
const actionCount = ref(0);
const userTeam = ref(null);
const selectedMap = ref(null);
const showConfirmation = ref(false);
const chatMessages = ref([]);
const newMessage = ref("");

// Chat system
const addChatMessage = (message) => {
    chatMessages.value.push(message);
    // Keep only last 50 messages
    if (chatMessages.value.length > 50) {
        chatMessages.value = chatMessages.value.slice(-50);
    }
};

const sendChatMessage = () => {
    if (!newMessage.value.trim()) return;

    sendMessage({
        type: "chat",
        message: newMessage.value,
        team: userTeam.value,
    });

    newMessage.value = "";
};

// Computed properties
const remainingMaps = computed(() => {
    return maps.value.filter((map) => map.status === "pending").length;
});

const gameStatus = computed(() => {
    if (remainingMaps.value === 1) {
        return maps.value.find((map) => map.status === "pending")?.name || "";
    }
    return "";
});

const currentAction = computed(() => {
    return `${currentTeam.value === "team1" ? "Team 1" : "Team 2"} ${phase.value}`;
});

const isUserTurn = computed(() => {
    return userTeam.value === currentTeam.value;
});

// WebSocket message handlers
const handleWebSocketMessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case "gameState":
            maps.value = message.maps;
            currentTeam.value = message.currentTeam;
            phase.value = message.phase;
            actionCount.value = message.actionCount;
            break;

        case "teamAssignment":
            userTeam.value = message.team;
            break;

        case "mapUpdate":
            const mapIndex = maps.value.findIndex(
                (m) => m.name === message.mapName,
            );
            if (mapIndex !== -1) {
                maps.value[mapIndex].status = message.status;
                maps.value[mapIndex].actionBy = message.actionBy;
            }
            currentTeam.value = message.nextTeam;
            phase.value = message.phase;
            actionCount.value = message.actionCount;
            break;

        case "chat":
            addChatMessage({
                team: message.team,
                message: message.message,
                timestamp: new Date().toLocaleTimeString(),
            });
            break;

        case "error":
            alert(message.error);
            break;
    }
};

// Map selection handling
const handleMapClick = (map) => {
    if (!isUserTurn.value || map.status !== "pending") return;
    selectedMap.value = map;
    showConfirmation.value = true;
};

const confirmAction = (action) => {
    if (!selectedMap.value) return;

    sendMessage({
        type: "mapAction",
        mapName: selectedMap.value.name,
        action: action,
        team: userTeam.value,
    });

    showConfirmation.value = false;
    selectedMap.value = null;
};

const cancelAction = () => {
    showConfirmation.value = false;
    selectedMap.value = null;
};

// WebSocket connection management
const connectWebSocket = () => {
    socket.value = new WebSocket(`${props.wsUrl}/${props.matchId}`);

    socket.value.onopen = () => {
        isConnected.value = true;
        sendMessage({
            type: "requestState",
        });
    };

    socket.value.onmessage = handleWebSocketMessage;

    socket.value.onclose = () => {
        isConnected.value = false;
        setTimeout(connectWebSocket, 3000);
    };

    socket.value.onerror = (error) => {
        console.error("WebSocket error:", error);
        isConnected.value = false;
    };
};

const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(message));
    }
};

// Lifecycle hooks
onMounted(() => {
    connectWebSocket();
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close();
    }
});
</script>

<template>
    <div class="map-picker">
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="connection-status" :class="{ connected: isConnected }">
                {{ isConnected ? "Connected" : "Connecting..." }}
            </div>

            <h2 class="text-xl font-bold">
                {{ gameStatus ? `Decider Map: ${gameStatus}` : currentAction }}
            </h2>

            <div class="team-info" v-if="userTeam">
                You are {{ userTeam === "team1" ? "Team 1" : "Team 2" }}
                <span v-if="isUserTurn" class="your-turn">Your turn!</span>
            </div>
        </div>

        <div class="content-wrapper">
            <!-- Maps Grid -->
            <div class="maps-grid">
                <div
                    v-for="map in maps"
                    :key="map.name"
                    class="map-card"
                    :class="{
                        banned: map.status === 'banned',
                        picked: map.status === 'picked',
                        disabled: map.status !== 'pending' || !isUserTurn,
                        clickable: map.status === 'pending' && isUserTurn,
                        selected: selectedMap?.name === map.name,
                    }"
                    @click="handleMapClick(map)"
                >
                    <div class="map-overlay">
                        <h3>{{ map.name }}</h3>
                        <span
                            v-if="map.status !== 'pending'"
                            class="status-badge"
                            :class="map.status"
                        >
                            {{ map.status.toUpperCase() }}
                            by
                            {{ map.actionBy === "team1" ? "Team 1" : "Team 2" }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Chat Panel -->
            <div class="chat-panel">
                <div class="chat-messages" ref="chatContainer">
                    <div
                        v-for="(msg, index) in chatMessages"
                        :key="index"
                        class="chat-message"
                        :class="msg.team"
                    >
                        <span class="timestamp">{{ msg.timestamp }}</span>
                        <span class="team-label"
                            >{{
                                msg.team === "team1" ? "Team 1" : "Team 2"
                            }}:</span
                        >
                        <span class="message">{{ msg.message }}</span>
                    </div>
                </div>
                <div class="chat-input">
                    <input
                        v-model="newMessage"
                        @keyup.enter="sendChatMessage"
                        placeholder="Type a message..."
                        :disabled="!isConnected"
                    />
                    <button
                        @click="sendChatMessage"
                        :disabled="!isConnected"
                        class="send-button"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmation" class="modal-overlay">
            <div class="modal-content">
                <h3>Confirm Action for {{ selectedMap?.name }}</h3>
                <p>What would you like to do with this map?</p>
                <div class="modal-buttons">
                    <button
                        @click="confirmAction('ban')"
                        class="ban-button"
                        :disabled="phase.value === 'pick'"
                    >
                        Ban Map
                    </button>
                    <button
                        @click="confirmAction('pick')"
                        class="pick-button"
                        :disabled="phase.value === 'ban'"
                    >
                        Pick Map
                    </button>
                    <button @click="cancelAction" class="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.map-picker {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.content-wrapper {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.connection-status {
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #ff4444;
    color: white;
}

.connection-status.connected {
    background-color: #4caf50;
}

.maps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.map-card {
    position: relative;
    aspect-ratio: 16/9;
    background-color: #2c3e50;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.map-card.banned {
    opacity: 0.6;
    filter: grayscale(100%);
}

.map-card.picked {
    border: 3px solid #4caf50;
    transform: scale(1.02);
}

.map-card.selected {
    border: 3px solid #ffd700;
    transform: scale(1.02);
}

.map-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
}

.status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    color: white;
    font-size: 0.8em;
}

.status-badge.banned {
    background-color: #ff4444;
}

.status-badge.picked {
    background-color: #4caf50;
}

/* Chat Panel Styles */
.chat-panel {
    background: #1a1a1a;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 600px;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

.chat-message {
    margin-bottom: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background: #2c2c2c;
}

.chat-message.team1 {
    border-left: 3px solid #4caf50;
}

.chat-message.team2 {
    border-left: 3px solid #2196f3;
}

.timestamp {
    color: #666;
    font-size: 0.8em;
    margin-right: 8px;
}

.team-label {
    font-weight: bold;
    margin-right: 8px;
}

.chat-input {
    padding: 10px;
    display: flex;
    gap: 8px;
}

.chat-input input {
    flex-grow: 1;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #333;
    background: #2c2c2c;
    color: white;
}

.send-button {
    padding: 8px 16px;
    background: #4caf50;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}

.send-button:disabled {
    background: #666;
    cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #2c2c2c;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90vw;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.modal-buttons button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.ban-button {
    background: #ff4444;
    color: white;
}

.pick-button {
    background: #4caf50;
    color: white;
}

.cancel-button {
    background: #666;
    color: white;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}

.your-turn {
    margin-left: 10px;
    color: #4caf50;
    font-weight: bold;
    animation: pulse 2s infinite;
}
</style>
