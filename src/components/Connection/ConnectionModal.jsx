import React, { useState } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';
import { useConnectionStore } from '../../store/connectionStore';
import { useUIStore } from '../../store/uiStore';
import Modal from '../UI/Modal';
import ConnectionPanel from './ConnectionPanel';

const ConnectionModal = () => {
    const { showConnectionModal, setShowConnectionModal } = useUIStore();
    const { isConnected } = useConnectionStore();

    return (
        <Modal
            isOpen={showConnectionModal}
            onClose={() => setShowConnectionModal(false)}
            title={`${isConnected ? 'Manage' : 'Connect'} Camera`}
            size="lg"
        >
            <ConnectionPanel />
        </Modal>
    );
};

export default ConnectionModal;
