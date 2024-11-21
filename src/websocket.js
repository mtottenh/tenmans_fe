const WS_BASE_URL = 'ws://localhost:8000/api/v1/';

class WebSocketManager {
  constructor(endpoint) {
    if (!endpoint) {
      throw new Error("WebSocket endpoint must be provided.");
    }

    this.url = `${WS_BASE_URL}${endpoint}`;
    this.socket = null;
  }

  connect() {
    if (this.socket) {
      console.warn("WebSocket is already connected.");
      return this.socket;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected:", this.url);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected:", this.url);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const createWebSocket = (endpoint) => new WebSocketManager(endpoint);

export { WS_BASE_URL };