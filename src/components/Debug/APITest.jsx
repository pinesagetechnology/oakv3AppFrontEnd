import React, { useState, useEffect } from 'react';
import { apiMethods } from '../../services/api';
import Button from '../UI/Button';
import Card from '../UI/Card';

const APITest = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});

    const testEndpoint = async (name, apiCall) => {
        setLoading(prev => ({ ...prev, [name]: true }));
        try {
            const response = await apiCall();
            setResults(prev => ({
                ...prev,
                [name]: {
                    success: true,
                    data: response.data,
                    status: response.status
                }
            }));
        } catch (error) {
            setResults(prev => ({
                ...prev,
                [name]: {
                    success: false,
                    error: error.message,
                    status: error.response?.status
                }
            }));
        }
        setLoading(prev => ({ ...prev, [name]: false }));
    };

    const tests = [
        { name: 'Health Check', call: () => apiMethods.getHealth() },
        { name: 'System Status', call: () => apiMethods.getSystemStatus() },
        { name: 'Get Files', call: () => apiMethods.getFiles() },
        { name: 'Discover Cameras', call: () => apiMethods.discoverCameras() },
        { name: 'Get Camera Settings', call: () => apiMethods.getCameraSettings() },
    ];

    return (
        <Card title="Backend API Test" className="max-w-4xl mx-auto">
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tests.map((test) => (
                        <Button
                            key={test.name}
                            onClick={() => testEndpoint(test.name, test.call)}
                            loading={loading[test.name]}
                            variant="outline"
                            size="sm"
                        >
                            {test.name}
                        </Button>
                    ))}
                </div>

                <div className="mt-6 space-y-3">
                    {Object.entries(results).map(([name, result]) => (
                        <div key={name} className="p-3 bg-gray-700 rounded">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{name}</span>
                                <span className={`text-sm px-2 py-1 rounded ${result.success ? 'bg-green-600' : 'bg-red-600'
                                    }`}>
                                    {result.success ? `✓ ${result.status}` : `✗ ${result.status || 'Error'}`}
                                </span>
                            </div>
                            <pre className="text-xs bg-gray-800 p-2 rounded overflow-auto max-h-32">
                                {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default APITest;