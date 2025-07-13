import React from 'react';
import { Camera, Video, Files, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Button from '../UI/Button';
import clsx from 'clsx';

const Sidebar = () => {
    const {
        sidebarCollapsed,
        activeTab,
        setSidebarCollapsed,
        setActiveTab
    } = useUIStore();

    const tabs = [
        { id: 'camera', label: 'Camera Controls', icon: Camera },
        { id: 'recording', label: 'Recording', icon: Video },
        { id: 'files', label: 'File Manager', icon: Files },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div
            className={clsx(
                'bg-gray-800 border-r border-gray-700 transition-all duration-300',
                sidebarCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <h2 className="text-lg font-semibold text-white">
                            Controls
                        </h2>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={sidebarCollapsed ? ChevronRight : ChevronLeft}
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="p-2">
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                activeTab === tab.id
                                    ? 'bg-oak-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            )}
                            title={sidebarCollapsed ? tab.label : undefined}
                        >
                            <tab.icon className={clsx('h-5 w-5', !sidebarCollapsed && 'mr-3')} />
                            {!sidebarCollapsed && tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Sidebar Footer */}
            {!sidebarCollapsed && (
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-gray-500 text-center">
                        Oak Camera Interface v1.0
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;