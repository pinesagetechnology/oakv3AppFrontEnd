import React from 'react';
import { Camera, Wifi, WifiOff, Circle, Menu, Settings, Info } from 'lucide-react';
import { useConnectionStore } from '../../store/connectionStore';
import { useRecordingStore } from '../../store/recordingStore';
import { useUIStore } from '../../store/uiStore';
import StatusIndicator from '../UI/StatusIndicator';
import Button from '../UI/Button';

const Header = () => {
    const { isConnected, connectionStatus, cameraIP, wsConnected } = useConnectionStore();
    const { isRecording, recordingTime, formatRecordingTime } = useRecordingStore();
    const { toggleSidebar, setShowConnectionModal, setShowAboutModal } = useUIStore();

    return (
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left side - Logo and title */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Menu}
                        onClick={toggleSidebar}
                        className="lg:hidden"
                    />

                    <div className="flex items-center space-x-3">
                        <Camera className="w-8 h-8 text-oak-400" />
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                Oak Camera v3
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Professional Interface
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center - Connection Status */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Camera Connection */}
                    <div className="flex items-center space-x-2">
                        {isConnected ? (
                            <Wifi className="w-5 h-5 text-green-400" />
                        ) : (
                            <WifiOff className="w-5 h-5 text-red-400" />
                        )}
                        <div className="text-sm">
                            <div className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                {connectionStatus}
                            </div>
                            {isConnected && cameraIP && (
                                <div className="text-gray-400 text-xs">
                                    {cameraIP}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* WebSocket Status */}
                    <StatusIndicator
                        status={wsConnected ? 'connected' : 'disconnected'}
                        label="WebSocket"
                        size="sm"
                    />
                </div>

                {/* Right side - Recording status and actions */}
                <div className="flex items-center space-x-4">
                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="flex items-center space-x-2 text-red-400">
                            <Circle className="w-4 h-4 fill-current animate-pulse" />
                            <div className="text-sm font-mono">
                                {formatRecordingTime()}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={isConnected ? Wifi : WifiOff}
                            onClick={() => setShowConnectionModal(true)}
                            className="hidden sm:flex"
                        />

                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Settings}
                            onClick={() => setShowAboutModal(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile connection status */}
            <div className="md:hidden mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                        <StatusIndicator
                            status={isConnected ? 'connected' : 'disconnected'}
                            label={connectionStatus}
                            size="sm"
                        />
                        {isConnected && cameraIP && (
                            <span className="text-gray-400">• {cameraIP}</span>
                        )}
                    </div>

                    <StatusIndicator
                        status={wsConnected ? 'connected' : 'disconnected'}
                        label="WS"
                        size="sm"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;