// frontend/src/components/Debug/CameraDebug.jsx
import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Badge } from '../UI/Badge';
import { 
    Wifi, 
    WifiOff, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    Info,
    Zap,
    Network,
    Server
} from 'lucide-react';
import api from '../../services/api';

export const CameraDebug = () => {
    const [cameraIP, setCameraIP] = useState('192.168.10.247');
    const [debugData, setDebugData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const runDebug = async () => {
        if (!cameraIP.trim()) {
            setError('Please enter a camera IP address');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDebugData(null);

        try {
            const response = await api.get(`/camera/debug/${cameraIP}`);
            setDebugData(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to run debug diagnostics');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (success) => {
        if (success === true) return <CheckCircle className="h-4 w-4 text-green-400" />;
        if (success === false) return <XCircle className="h-4 w-4 text-red-400" />;
        return <Info className="h-4 w-4 text-yellow-400" />;
    };

    const getStatusColor = (success) => {
        if (success === true) return 'text-green-400';
        if (success === false) return 'text-red-400';
        return 'text-yellow-400';
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-200">Camera Debug Diagnostics</h3>
                    </div>
                    <Badge variant="info">OAK Camera v3</Badge>
                </div>

                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <Input
                            label="Camera IP Address"
                            value={cameraIP}
                            onChange={(e) => setCameraIP(e.target.value)}
                            placeholder="192.168.10.247"
                            className="flex-1"
                        />
                        <Button
                            onClick={runDebug}
                            disabled={isLoading}
                            className="mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner className="h-4 w-4 mr-2" />
                                    Running Tests...
                                </>
                            ) : (
                                <>
                                    <Network className="h-4 w-4 mr-2" />
                                    Run Diagnostics
                                </>
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                <span className="text-red-200">{error}</span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {debugData && (
                <div className="space-y-6">
                    {/* Summary */}
                    <Card>
                        <h4 className="text-md font-semibold text-gray-200 mb-4 flex items-center">
                            <Info className="h-4 w-4 mr-2" />
                            Diagnostic Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                                <Network className="h-4 w-4 text-blue-400" />
                                <span className="text-gray-300">IP:</span>
                                <span className="text-gray-200 font-mono">{debugData.ip_address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Wifi className="h-4 w-4 text-green-400" />
                                <span className="text-gray-300">Ping:</span>
                                {getStatusIcon(debugData.tests?.ping?.success)}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-yellow-400" />
                                <span className="text-gray-300">Ports:</span>
                                <span className="text-gray-200">
                                    {Object.values(debugData.tests?.port_connectivity || {}).filter(p => p.success).length} open
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Test Results */}
                    <Card>
                        <h4 className="text-md font-semibold text-gray-200 mb-4">Test Results</h4>
                        <div className="space-y-4">
                            {/* Ping Test */}
                            {debugData.tests?.ping && (
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(debugData.tests.ping.success)}
                                            <span className="font-medium text-gray-200">Ping Connectivity</span>
                                        </div>
                                        <Badge variant={debugData.tests.ping.success ? "success" : "error"}>
                                            {debugData.tests.ping.success ? "Success" : "Failed"}
                                        </Badge>
                                    </div>
                                    {debugData.tests.ping.output && (
                                        <pre className="text-sm text-gray-400 bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                                            {debugData.tests.ping.output}
                                        </pre>
                                    )}
                                </div>
                            )}

                            {/* Port Connectivity */}
                            {debugData.tests?.port_connectivity && (
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-200 mb-3">Port Connectivity</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {Object.entries(debugData.tests.port_connectivity).map(([port, result]) => (
                                            <div key={port} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                                <span className="text-sm text-gray-300 font-mono">
                                                    {port.replace('port_', '')}
                                                </span>
                                                {getStatusIcon(result.success)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Device Discovery */}
                            {debugData.tests?.device_discovery && (
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(debugData.tests.device_discovery.found)}
                                            <span className="font-medium text-gray-200">DepthAI Device Discovery</span>
                                        </div>
                                        <Badge variant={debugData.tests.device_discovery.found ? "success" : "error"}>
                                            {debugData.tests.device_discovery.found ? "Found" : "Not Found"}
                                        </Badge>
                                    </div>
                                    {debugData.tests.device_discovery.found && (
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <div>Name: {debugData.tests.device_discovery.name}</div>
                                            <div>MXID: {debugData.tests.device_discovery.mxid}</div>
                                            <div>State: {debugData.tests.device_discovery.state}</div>
                                            <div>Protocol: {debugData.tests.device_discovery.protocol}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* DepthAI Connection */}
                            {debugData.tests?.depthai_connection && (
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(debugData.tests.depthai_connection.success)}
                                            <span className="font-medium text-gray-200">DepthAI Connection</span>
                                        </div>
                                        <Badge variant={debugData.tests.depthai_connection.success ? "success" : "error"}>
                                            {debugData.tests.depthai_connection.success ? "Connected" : "Failed"}
                                        </Badge>
                                    </div>
                                    {debugData.tests.depthai_connection.success && (
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <div>Device: {debugData.tests.depthai_connection.device_name}</div>
                                            <div>Platform: {debugData.tests.depthai_connection.platform}</div>
                                        </div>
                                    )}
                                    {debugData.tests.depthai_connection.error && (
                                        <div className="text-sm text-red-400 mt-2">
                                            Error: {debugData.tests.depthai_connection.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Network Configuration */}
                            {debugData.tests?.network_config && (
                                <div className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(debugData.tests.network_config.same_subnet)}
                                            <span className="font-medium text-gray-200">Network Configuration</span>
                                        </div>
                                        <Badge variant={debugData.tests.network_config.same_subnet ? "success" : "warning"}>
                                            {debugData.tests.network_config.same_subnet ? "Same Subnet" : "Different Subnet"}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <div className="mb-2">Local IPs: {debugData.tests.network_config.local_ips?.join(', ') || 'None'}</div>
                                        <div>Interfaces: {debugData.tests.network_config.interfaces?.join(', ') || 'None'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Recommendations */}
                    {debugData.recommendations && debugData.recommendations.length > 0 && (
                        <Card>
                            <h4 className="text-md font-semibold text-gray-200 mb-4 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                                Recommendations
                            </h4>
                            <div className="space-y-2">
                                {debugData.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded">
                                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-yellow-200">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};