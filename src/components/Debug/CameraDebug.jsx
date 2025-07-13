// frontend/src/components/Debug/CameraDebug.jsx
import React, { useState } from 'react';
import { Bug, Search, Wifi, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Input from '../UI/Input';
import api from '../../services/api';

const CameraDebug = () => {
    const [debugIP, setDebugIP] = useState('192.168.10.247');
    const [debugResults, setDebugResults] = useState(null);
    const [isDebugging, setIsDebugging] = useState(false);
    const [discoveryResults, setDiscoveryResults] = useState(null);
    const [isDiscovering, setIsDiscovering] = useState(false);

    const runDebug = async () => {
        setIsDebugging(true);
        try {
            const response = await api.get(`/camera/debug/${debugIP}`);
            setDebugResults(response.data);
        } catch (error) {
            setDebugResults({
                error: error.message,
                details: error.response?.data
            });
        }
        setIsDebugging(false);
    };

    const runDiscovery = async () => {
        setIsDiscovering(true);
        try {
            const response = await api.get('/camera/discover');
            setDiscoveryResults(response.data);
        } catch (error) {
            setDiscoveryResults({
                error: error.message,
                details: error.response?.data
            });
        }
        setIsDiscovering(false);
    };

    const getTestIcon = (test) => {
        if (test.success === true) return <CheckCircle className="h-4 w-4 text-green-400" />;
        if (test.success === false) return <XCircle className="h-4 w-4 text-red-400" />;
        if (test.found === true) return <CheckCircle className="h-4 w-4 text-green-400" />;
        if (test.found === false) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Discovery Section */}
            <Card title="Camera Discovery" icon={Search}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Scan for all Oak cameras on the network
                        </p>
                        <Button
                            onClick={runDiscovery}
                            loading={isDiscovering}
                            icon={Search}
                            variant="primary"
                        >
                            Discover Cameras
                        </Button>
                    </div>

                    {discoveryResults && (
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-3">Discovery Results</h4>
                            {discoveryResults.error ? (
                                <div className="text-red-400 text-sm">
                                    Error: {discoveryResults.error}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-400">PoE Cameras Found: </span>
                                        <span className="text-white font-mono">
                                            {discoveryResults.data?.cameras?.length || 0}
                                        </span>
                                    </div>

                                    {discoveryResults.data?.cameras?.map((ip, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Wifi className="h-4 w-4 text-green-400" />
                                            <span className="font-mono text-green-400">{ip}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setDebugIP(ip)}
                                            >
                                                Debug This IP
                                            </Button>
                                        </div>
                                    ))}

                                    {discoveryResults.data?.all_devices && (
                                        <details className="mt-4">
                                            <summary className="text-sm text-gray-400 cursor-pointer">
                                                All Devices ({discoveryResults.data.all_devices.length})
                                            </summary>
                                            <pre className="text-xs bg-gray-800 p-2 rounded mt-2 overflow-auto">
                                                {JSON.stringify(discoveryResults.data.all_devices, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Debug Section */}
            <Card title="Camera Debug Diagnostics" icon={Bug}>
                <div className="space-y-4">
                    <Input
                        label="Camera IP Address"
                        value={debugIP}
                        onChange={(e) => setDebugIP(e.target.value)}
                        placeholder="192.168.10.247"
                    />

                    <Button
                        onClick={runDebug}
                        loading={isDebugging}
                        icon={Bug}
                        variant="primary"
                        disabled={!debugIP}
                    >
                        Run Diagnostics
                    </Button>

                    {debugResults && (
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-4">
                                Debug Results for {debugResults.ip_address}
                            </h4>

                            {debugResults.error ? (
                                <div className="text-red-400">
                                    Error: {debugResults.error}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Test Results */}
                                    {Object.entries(debugResults.tests || {}).map(([testName, test]) => (
                                        <div key={testName} className="border border-gray-600 rounded p-3">
                                            <div className="flex items-center space-x-2 mb-2">
                                                {getTestIcon(test)}
                                                <span className="font-medium capitalize text-white">
                                                    {testName.replace(/_/g, ' ')}
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                {test.success === true && (
                                                    <div className="text-green-400">✓ {test.message || 'Success'}</div>
                                                )}
                                                {test.success === false && (
                                                    <div className="text-red-400">✗ {test.error || 'Failed'}</div>
                                                )}
                                                {test.found === true && (
                                                    <div className="text-green-400">
                                                        ✓ Device found: {test.name} (MX ID: {test.mxid})
                                                        <br />State: {test.state}, Protocol: {test.protocol}
                                                    </div>
                                                )}
                                                {test.found === false && (
                                                    <div className="text-yellow-400">
                                                        ⚠ Device not found in discovery
                                                        {test.available_devices && (
                                                            <div className="mt-1 text-xs">
                                                                Available: {test.available_devices.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {test.output && (
                                                    <div className="mt-2 text-xs bg-gray-800 p-2 rounded font-mono">
                                                        {test.output}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                        onClick={() => setDebugIP('192.168.10.247')}
                        variant="outline"
                        size="sm"
                    >
                        Test .247
                    </Button>
                    <Button
                        onClick={() => setDebugIP('192.168.1.100')}
                        variant="outline"
                        size="sm"
                    >
                        Test .1.100
                    </Button>
                    <Button
                        onClick={() => setDebugIP('192.168.0.100')}
                        variant="outline"
                        size="sm"
                    >
                        Test .0.100
                    </Button>
                    <Button
                        onClick={runDiscovery}
                        variant="outline"
                        size="sm"
                        icon={Search}
                    >
                        Auto-Find
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default CameraDebug;