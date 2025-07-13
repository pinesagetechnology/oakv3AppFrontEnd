import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import websocketService from '../services/websocket';
import { validateIPAddress } from '../utils/helpers';

export const useConnectionStore = create(
    persist(
        (set, get) => ({
            // State
            isConnected: false,
            isConnecting: false,
            connectionStatus: 'Disconnected',
            cameraIP: '192.168.1.100',
            lastConnectedAt: null,
            connectionError: null,
            discoveredCameras: [],
            isDiscovering: false,
            autoReconnect: true,
            wsConnected: false,

            // Actions
            setCameraIP: (ip) => {
                if (validateIPAddress(ip)) {
                    set({ cameraIP: ip, connectionError: null });
                    return true;
                } else {
                    set({ connectionError: 'Invalid IP address format' });
                    return false;
                }
            },

            setConnectionStatus: (status) => {
                set({ connectionStatus: status });
            },

            setWSConnected: (connected) => {
                set({ wsConnected: connected });
            },

            connect: async (ipAddress = null) => {
                const ip = ipAddress || get().cameraIP;

                if (!validateIPAddress(ip)) {
                    set({ connectionError: 'Invalid IP address' });
                    throw new Error('Invalid IP address');
                }

                set({
                    isConnecting: true,
                    connectionError: null,
                    connectionStatus: 'Connecting...'
                });

                try {
                    // Connect WebSocket first
                    websocketService.connect();

                    // Send connection request via WebSocket
                    const success = websocketService.send({
                        type: 'connect',
                        ip_address: ip
                    });

                    if (!success) {
                        throw new Error('WebSocket not connected');
                    }

                    // Wait for connection result (handled by WebSocket listener)
                    return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            set({
                                isConnecting: false,
                                connectionStatus: 'Connection timeout'
                            });
                            reject(new Error('Connection timeout'));
                        }, 15000);

                        const handleConnectionResult = (data) => {
                            clearTimeout(timeout);
                            websocketService.off('connection_result', handleConnectionResult);

                            if (data.success) {
                                set({
                                    isConnected: true,
                                    isConnecting: false,
                                    connectionStatus: 'Connected',
                                    cameraIP: ip,
                                    lastConnectedAt: new Date().toISOString(),
                                    connectionError: null
                                });
                                resolve(true);
                            } else {
                                set({
                                    isConnected: false,
                                    isConnecting: false,
                                    connectionStatus: 'Failed',
                                    connectionError: data.message
                                });
                                reject(new Error(data.message));
                            }
                        };

                        websocketService.on('connection_result', handleConnectionResult);
                    });

                } catch (error) {
                    console.error('Connection error:', error);
                    set({
                        isConnected: false,
                        isConnecting: false,
                        connectionStatus: 'Failed',
                        connectionError: error.message
                    });
                    throw error;
                }
            },

            disconnect: async () => {
                try {
                    // Send disconnect via WebSocket
                    websocketService.send({ type: 'disconnect' });

                    // Also try REST API as backup
                    await api.post('/camera/disconnect').catch(() => { });

                    set({
                        isConnected: false,
                        isConnecting: false,
                        connectionStatus: 'Disconnected',
                        connectionError: null
                    });
                } catch (error) {
                    console.error('Disconnect error:', error);
                    // Force disconnect even if API call fails
                    set({
                        isConnected: false,
                        isConnecting: false,
                        connectionStatus: 'Disconnected',
                        connectionError: null
                    });
                }
            },

            discoverCameras: async () => {
                set({ isDiscovering: true });

                try {
                    const response = await api.get('/camera/discover');
                    const cameras = response.data.data?.cameras || [];

                    set({
                        discoveredCameras: cameras,
                        isDiscovering: false
                    });

                    return cameras;
                } catch (error) {
                    console.error('Discovery error:', error);
                    set({
                        discoveredCameras: [],
                        isDiscovering: false
                    });
                    return [];
                }
            },

            // Handle WebSocket events
            handleConnectionUpdate: (data) => {
                if (data.connected !== undefined) {
                    set({ isConnected: data.connected });
                }
                if (data.ip_address !== undefined) {
                    set({ cameraIP: data.ip_address });
                }
            },

            resetConnectionState: () => {
                set({
                    isConnected: false,
                    isConnecting: false,
                    connectionStatus: 'Disconnected',
                    connectionError: null,
                    lastConnectedAt: null
                });
            }
        }),
        {
            name: 'oak-camera-connection',
            partialize: (state) => ({
                cameraIP: state.cameraIP,
                autoReconnect: state.autoReconnect
            }),
        }
    )
);