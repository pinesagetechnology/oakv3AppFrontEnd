import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useConnectionStore } from '../../store/connectionStore';
import { validateIPAddress } from '../../utils/helpers';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import StatusIndicator from '../UI/StatusIndicator';
import LoadingSpinner from '../UI/LoadingSpinner';
import Badge from '../UI/Badge';
import toast from 'react-hot-toast';

const ConnectionPanel = () => {
    const {
        isConnected,
        isConnecting,
        connectionStatus,
        cameraIP,
        connectionError,
        discoveredCameras,
        isDiscovering,
        setCameraIP,
        connect,
        disconnect,
        discoverCameras
    } = useConnectionStore();

    const [inputIP, setInputIP] = useState(cameraIP);
    const [ipError, setIPError] = useState('');

    useEffect(() => {
        setInputIP(cameraIP);
    }, [cameraIP]);

    const handleIPChange = (e) => {
        const value = e.target.value;
        setInputIP(value);

        if (value && !validateIPAddress(value)) {
            setIPError('Invalid IP address format');
        } else {
            setIPError('');
        }
    };

    const handleConnect = async () => {
        if (!validateIPAddress(inputIP)) {
            setIPError('Please enter a valid IP address');
            return;
        }

        try {
            setCameraIP(inputIP);
            await connect(inputIP);
            toast.success('Successfully connected to camera');
        } catch (error) {
            console.error('Connection failed:', error);
            toast.error(error.message || 'Failed to connect to camera');
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
            toast.success('Disconnected from camera');
        } catch (error) {
            console.error('Disconnect failed:', error);
            toast.error('Failed to disconnect');
        }
    };

    const handleDiscoverCameras = async () => {
        try {
            const cameras = await discoverCameras();
            if (cameras.length === 0) {
                toast.info('No cameras found on the network');
            } else {
                toast.success(`Found ${cameras.length} camera(s)`);
            }
        } catch (error) {
            console.error('Discovery failed:', error);
            toast.error('Failed to discover cameras');
        }
    };

    const handleSelectDiscoveredCamera = (ip) => {
        setInputIP(ip);
        setCameraIP(ip);
        setIPError('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isConnecting && !ipError) {
            if (isConnected) {
                handleDisconnect();
            } else {
                handleConnect();
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card
                title="Camera Connection"
                subtitle="Connect to your Oak Camera v3 over PoE network"
                icon={isConnected ? Wifi : WifiOff}
                padding="lg"
            >
                <div className="space-y-6">
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <StatusIndicator
                                status={isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'}
                                animate={isConnecting}
                            />
                            <div>
                                <div className="font-medium text-white">
                                    {connectionStatus}
                                </div>
                                {isConnected && cameraIP && (
                                    <div className="text-sm text-gray-400">
                                        {cameraIP}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isConnected && (
                            <Badge variant="success">
                                Active
                            </Badge>
                        )}
                    </div>

                    {/* Connection Error */}
                    {connectionError && (
                        <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-200">
                                        Connection Error
                                    </h4>
                                    <p className="text-sm text-red-300 mt-1">
                                        {connectionError}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* IP Address Input */}
                    <div className="space-y-4">
                        <Input
                            label="Camera IP Address"
                            value={inputIP}
                            onChange={handleIPChange}
                            onKeyPress={handleKeyPress}
                            placeholder="192.168.10.247"
                            error={ipError}
                            disabled={isConnecting}
                            helperText="Enter the IP address of your Oak Camera v3"
                        />

                        <div className="flex items-center space-x-3">
                            {!isConnected ? (
                                <Button
                                    onClick={handleConnect}
                                    disabled={isConnecting || !!ipError || !inputIP}
                                    loading={isConnecting}
                                    icon={Wifi}
                                    className="flex-1"
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleDisconnect}
                                    variant="danger"
                                    icon={WifiOff}
                                    className="flex-1"
                                >
                                    Disconnect
                                </Button>
                            )}

                            <Button
                                onClick={handleDiscoverCameras}
                                disabled={isDiscovering}
                                loading={isDiscovering}
                                variant="outline"
                                icon={Search}
                            >
                                Discover
                            </Button>
                        </div>
                    </div>

                    {/* Discovered Cameras */}
                    {discoveredCameras.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-300">
                                Discovered Cameras
                            </h4>
                            <div className="space-y-2">
                                {discoveredCameras.map((ip) => (
                                    <div
                                        key={ip}
                                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <StatusIndicator status="connected" size="sm" showLabel={false} />
                                            <span className="text-white font-mono">{ip}</span>
                                            {ip === cameraIP && (
                                                <Badge variant="primary" size="sm">Current</Badge>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => handleSelectDiscoveredCamera(ip)}
                                            variant="ghost"
                                            size="sm"
                                            disabled={ip === inputIP}
                                        >
                                            {ip === inputIP ? 'Selected' : 'Select'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Connection Instructions */}
                    <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Connection Requirements
                        </h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Oak Camera v3 connected to PoE+ switch/injector</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Camera and host on same network</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Port 9876 accessible</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Minimum 30W PoE+ power supply</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Start Guide */}
                    <div className="text-xs text-gray-500">
                        <p>
                            <strong>Quick Start:</strong> Connect your Oak Camera v3 to a PoE+ switch,
                            wait for it to obtain an IP address, then enter the IP above and click Connect.
                            Use the Discover button to automatically find cameras on your network.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ConnectionPanel;