import React, { useEffect } from 'react';
import { useConnectionStore } from './store/connectionStore';
import { useUIStore } from './store/uiStore';
import { useWebSocket } from './hooks/useWebSocket';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Layout Components
import MainLayout from './components/Layout/MainLayout';
import PageContainer from './components/Layout/PageContainer';

// Feature Components
import ConnectionPanel from './components/Connection/ConnectionPanel';
import StreamDisplay from './components/Camera/StreamDisplay';
import CameraControls from './components/Camera/CameraControls';

// Modal Components
import ConnectionModal from './components/Connection/ConnectionModal';
import AboutModal from './components/Modals/AboutModal';

function App() {
    const { isConnected } = useConnectionStore();
    const { showConnectionModal, showAboutModal } = useUIStore();

    // Initialize WebSocket connection and keyboard shortcuts
    useWebSocket();
    useKeyboardShortcuts();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <MainLayout>
                <div className="flex h-full">
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        <PageContainer>
                            {!isConnected ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="max-w-2xl w-full">
                                        <ConnectionPanel />
                                    </div>
                                </div>
                            ) : (
                                <StreamDisplay />
                            )}
                        </PageContainer>
                    </div>

                    {/* Controls Sidebar */}
                    <CameraControls />
                </div>
            </MainLayout>

            {/* Modals */}
            <ConnectionModal />
            <AboutModal />
        </div>
    );
}

export default App;