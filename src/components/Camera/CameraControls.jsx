import React from 'react';
import { useUIStore } from '../../store/uiStore';
import TabPanel from '../Layout/TabPanel';
import CameraSettings from './CameraSettings';
import RecordingControls from './RecordingControls';
import FileManager from './FileManager';
import SettingsPanel from './SettingsPanel';

const CameraControls = () => {
    const { activeTab, sidebarCollapsed } = useUIStore();

    return (
        <div className={`bg-gray-800 border-l border-gray-700 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'w-96' : 'w-80'
            }`}>
            <div className="h-full p-6">
                <TabPanel isActive={activeTab === 'camera'}>
                    <CameraSettings />
                </TabPanel>

                <TabPanel isActive={activeTab === 'recording'}>
                    <RecordingControls />
                </TabPanel>

                <TabPanel isActive={activeTab === 'files'}>
                    <FileManager />
                </TabPanel>

                <TabPanel isActive={activeTab === 'settings'}>
                    <SettingsPanel />
                </TabPanel>
            </div>
        </div>
    );
};

export default CameraControls;
