class WebSocketService {
    constructor() {
        this.ws = null;
        this.streamWs = null;
        this.reconnectInterval = 3000;
        this.maxReconnectAttempts = 5;
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.callbacks = new Map();
        this.streamCallbacks = new Map();
    }

    connect(url = null) {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        this.isConnecting = true;
        const wsUrl = url || (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/control';

        console.log('Connecting to WebSocket:', wsUrl);

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.emit('connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message:', data.type, data);
                    this.emit('message', data);
                    this.emit(data.type, data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                this.isConnecting = false;
                this.emit('disconnected');

                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
                        this.connect();
                    }, this.reconnectInterval);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
                this.emit('error', error);
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.isConnecting = false;
        }
    }

    connectStream() {
        if (this.streamWs && this.streamWs.readyState === WebSocket.OPEN) {
            return;
        }

        const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/stream';
        console.log('Connecting to stream WebSocket:', wsUrl);

        try {
            this.streamWs = new WebSocket(wsUrl);

            this.streamWs.onopen = () => {
                console.log('Stream WebSocket connected');
                this.emitStream('stream_connected');
            };

            this.streamWs.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.emitStream('stream_message', data);
                    this.emitStream(data.type, data);
                } catch (error) {
                    console.error('Error parsing stream message:', error);
                }
            };

            this.streamWs.onclose = () => {
                console.log('Stream WebSocket disconnected');
                this.emitStream('stream_disconnected');
            };

            this.streamWs.onerror = (error) => {
                console.error('Stream WebSocket error:', error);
                this.emitStream('stream_error', error);
            };
        } catch (error) {
            console.error('Failed to create stream WebSocket connection:', error);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.streamWs) {
            this.streamWs.close();
            this.streamWs = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Sending WebSocket message:', message.type);
            this.ws.send(JSON.stringify(message));
            return true;
        } else {
            console.warn('WebSocket not connected, cannot send message');
            return false;
        }
    }

    sendStream(message) {
        if (this.streamWs && this.streamWs.readyState === WebSocket.OPEN) {
            this.streamWs.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    on(event, callback) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event).push(callback);
    }

    onStream(event, callback) {
        if (!this.streamCallbacks.has(event)) {
            this.streamCallbacks.set(event, []);
        }
        this.streamCallbacks.get(event).push(callback);
    }

    off(event, callback) {
        if (this.callbacks.has(event)) {
            const callbacks = this.callbacks.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.callbacks.has(event)) {
            this.callbacks.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in WebSocket callback:', error);
                }
            });
        }
    }

    emitStream(event, data) {
        if (this.streamCallbacks.has(event)) {
            this.streamCallbacks.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in stream callback:', error);
                }
            });
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    isStreamConnected() {
        return this.streamWs && this.streamWs.readyState === WebSocket.OPEN;
    }
}

export default new WebSocketService();