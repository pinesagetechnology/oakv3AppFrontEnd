import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
    persist(
        (set, get) => ({
            // State
            theme: 'dark',
            sidebarCollapsed: false,
            showAdvancedControls: false,
            activeTab: 'camera',
            showFileManager: false,
            notifications: [],

            // Modal states
            showConnectionModal: false,
            showSettingsModal: false,
            showAboutModal: false,

            // Layout preferences
            streamAspectRatio: '16:9',
            controlsPosition: 'right',
            compactMode: false,

            // Actions
            setTheme: (theme) => set({ theme }),

            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

            toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

            setShowAdvancedControls: (show) => set({ showAdvancedControls: show }),

            toggleAdvancedControls: () => set({
                showAdvancedControls: !get().showAdvancedControls
            }),

            setActiveTab: (tab) => set({ activeTab: tab }),

            setShowFileManager: (show) => set({ showFileManager: show }),

            toggleFileManager: () => set({ showFileManager: !get().showFileManager }),

            // Modal actions
            setShowConnectionModal: (show) => set({ showConnectionModal: show }),
            setShowSettingsModal: (show) => set({ showSettingsModal: show }),
            setShowAboutModal: (show) => set({ showAboutModal: show }),

            // Notifications
            addNotification: (notification) => {
                const id = Date.now().toString();
                const newNotification = {
                    id,
                    timestamp: new Date().toISOString(),
                    ...notification
                };

                set({
                    notifications: [...get().notifications, newNotification]
                });

                // Auto-remove after delay
                if (notification.autoRemove !== false) {
                    setTimeout(() => {
                        get().removeNotification(id);
                    }, notification.duration || 5000);
                }

                return id;
            },

            removeNotification: (id) => {
                set({
                    notifications: get().notifications.filter(n => n.id !== id)
                });
            },

            clearNotifications: () => set({ notifications: [] }),

            // Layout preferences
            setStreamAspectRatio: (ratio) => set({ streamAspectRatio: ratio }),
            setControlsPosition: (position) => set({ controlsPosition: position }),
            setCompactMode: (compact) => set({ compactMode: compact }),

            // Keyboard shortcuts
            handleKeyboardShortcut: (key, ctrlKey = false, shiftKey = false) => {
                const { activeTab } = get();

                // Global shortcuts
                if (ctrlKey) {
                    switch (key) {
                        case 'k':
                            get().setShowConnectionModal(true);
                            break;
                        case ',':
                            get().setShowSettingsModal(true);
                            break;
                        case 'f':
                            get().toggleFileManager();
                            break;
                        case 'b':
                            get().toggleSidebar();
                            break;
                    }
                }

                // Tab-specific shortcuts
                if (!ctrlKey && !shiftKey) {
                    switch (key) {
                        case '1':
                            get().setActiveTab('camera');
                            break;
                        case '2':
                            get().setActiveTab('recording');
                            break;
                        case '3':
                            get().setActiveTab('files');
                            break;
                        case 'Escape':
                            get().setShowConnectionModal(false);
                            get().setShowSettingsModal(false);
                            get().setShowAboutModal(false);
                            break;
                    }
                }
            }
        }),
        {
            name: 'oak-camera-ui',
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
                showAdvancedControls: state.showAdvancedControls,
                streamAspectRatio: state.streamAspectRatio,
                controlsPosition: state.controlsPosition,
                compactMode: state.compactMode
            })
        }
    )
);