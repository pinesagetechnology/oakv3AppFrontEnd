import React from 'react';
import { Settings, Info, Keyboard, Monitor, Wifi } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useConnectionStore } from '../../store/connectionStore';
import ConnectionStatus from '../Connection/StatusIndicator';
import Card from '../UI/Card';
import Toggle from '../UI/Toggle';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Stack from '../Layout/Stack';

const SettingsPanel = () => {
    const {
        showAdvancedControls,
        setShowAdvancedControls,
        compactMode,
        setCompactMode,
        streamAspectRatio,
        setStreamAspectRatio,
        setShowAboutModal
    } = useUIStore();

    const { isConnected, cameraIP, lastConnectedAt } = useConnectionStore();

    const aspectRatios = [
        { value: '16:9', label: '16:9 (Widescreen)' },
        { value: '4:3', label: '4:3 (Standard)' },
        { value: '1:1', label: '1:1 (Square)' },
        { value: 'auto', label: 'Auto' }
    ];

    return (
        <Stack spacing={6}>
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
                <p className="text-sm text-gray-400">
                    Configure interface preferences and view system information
                </p>
            </div>

            {/* Connection Status */}
            <Card title="Connection Status" icon={Wifi}>
                <ConnectionStatus showDetails={true} />
            </Card>

            {/* Interface Settings */}
            <Card title="Interface Settings" icon={Monitor}>
                <Stack spacing={4}>
                    <Toggle
                        checked={showAdvancedControls}
                        onChange={setShowAdvancedControls}
                        label="Show Advanced Controls"
                        description="Display additional camera settings and controls"
                    />

                    <Toggle
                        checked={compactMode}
                        onChange={setCompactMode}
                        label="Compact Mode"
                        description="Use a more compact layout to save space"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Stream Aspect Ratio
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio.value}
                                    onClick={() => setStreamAspectRatio(ratio.value)}
                                    className={`p-2 text-sm rounded border transition-colors ${streamAspectRatio === ratio.value
                                            ? 'border-oak-500 bg-oak-600 text-white'
                                            : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Stack>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card title="Keyboard Shortcuts" icon={Keyboard}>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Connect Camera</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+K</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Settings</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+,</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">File Manager</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+F</kbd>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Record</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">R</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Capture</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">C</kbd>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Focus</span>
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">F</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* System Information */}
            <Card title="System Information" icon={Info}>
                <Stack spacing={3}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-400">Version</div>
                            <div className="text-white">1.0.0</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Build</div>
                            <div className="text-white">Production</div>
                        </div>
                    </div>

                    {isConnected && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-400">Camera IP</div>
                                <div className="text-white font-mono">{cameraIP}</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Connected Since</div>
                                <div className="text-white text-xs">
                                    {lastConnectedAt ? new Date(lastConnectedAt).toLocaleTimeString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-3 border-t border-gray-700">
                        <Button
                            onClick={() => setShowAboutModal(true)}
                            variant="outline"
                            size="sm"
                            icon={Info}
                            className="w-full"
                        >
                            About Oak Camera Interface
                        </Button>
                    </div>
                </Stack>
            </Card>
        </Stack>
    );
};

export default SettingsPanel;