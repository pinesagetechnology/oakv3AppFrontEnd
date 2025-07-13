import React from 'react';
import { Settings } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Modal from '../UI/Modal';
import SettingsPanel from '../Camera/SettingsPanel';

const SettingsModal = () => {
    const { showSettingsModal, setShowSettingsModal } = useUIStore();

    return (
        <Modal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            title="Settings"
            size="lg"
        >
            <SettingsPanel />
        </Modal>
    );
};

export default SettingsModal;