import React from 'react';
import { Camera, Github, ExternalLink, Heart, Zap, Shield, Cpu } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Card from '../UI/Card';

const AboutModal = () => {
    const { showAboutModal, setShowAboutModal } = useUIStore();

    const features = [
        {
            icon: Zap,
            title: 'Real-time Streaming',
            description: 'Live video streaming over TCP with WebSocket communication'
        },
        {
            icon: Camera,
            title: 'Full Camera Control',
            description: 'Complete manual control over exposure, focus, white balance, and more'
        },
        {
            icon: Shield,
            title: 'Professional Grade',
            description: 'Built for professional use with robust error handling and monitoring'
        },
        {
            icon: Cpu,
            title: 'High Performance',
            description: 'Optimized for low latency and high-quality video streaming'
        }
    ];

    const techStack = [
        { name: 'React 18', type: 'Frontend Framework' },
        { name: 'FastAPI', type: 'Backend API' },
        { name: 'WebSocket', type: 'Real-time Communication' },
        { name: 'DepthAI', type: 'Camera SDK' },
        { name: 'Tailwind CSS', type: 'Styling' },
        { name: 'Zustand', type: 'State Management' }
    ];

    return (
        <Modal
            isOpen={showAboutModal}
            onClose={() => setShowAboutModal(false)}
            title="About Oak Camera Interface"
            size="xl"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Camera className="w-12 h-12 text-oak-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Oak Camera v3 Interface
                            </h2>
                            <div className="flex items-center justify-center space-x-2 mt-1">
                                <Badge variant="primary">v1.0.0</Badge>
                                <Badge variant="success">Production Ready</Badge>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A professional, web-based interface for controlling Oak Camera v3 devices over PoE.
                        Built with modern technologies for real-time streaming, recording, and comprehensive camera control.
                    </p>
                </div>

                {/* Features */}
                <Card title="Key Features">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <feature.icon className="w-5 h-5 text-oak-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-white">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Technology Stack */}
                <Card title="Technology Stack">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {techStack.map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                <span className="text-sm font-medium text-white">{tech.name}</span>
                                <span className="text-xs text-gray-400">{tech.type}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Capabilities */}
                <Card title="What You Can Do">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-medium text-white">Camera Control</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• Manual exposure (1-500ms)</li>
                                <li>• ISO sensitivity (100-1600)</li>
                                <li>• Focus control (0-255)</li>
                                <li>• White balance (1000-12000K)</li>
                                <li>• Image enhancement settings</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-white">Recording & Streaming</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• Live video streaming</li>
                                <li>• H.264, H.265, MJPEG recording</li>
                                <li>• Image capture with timestamps</li>
                                <li>• File management and download</li>
                                <li>• Real-time parameter adjustment</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Links and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={Github}
                            onClick={() => window.open('https://github.com/luxonis', '_blank')}
                        >
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={ExternalLink}
                            onClick={() => window.open('https://docs.luxonis.com', '_blank')}
                        >
                            Documentation
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>by Luxonis</span>
                    </div>
                </div>

                {/* System Info */}
                <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
                    <p>© 2024 Oak Camera Interface. Built for Oak Camera v3 devices.</p>
                    <p className="mt-1">
                        For support and documentation, visit{' '}
                        <a
                            href="https://docs.luxonis.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-oak-400 hover:text-oak-300"
                        >
                            docs.luxonis.com
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default AboutModal;