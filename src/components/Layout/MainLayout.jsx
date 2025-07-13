import React from 'react';
import { useUIStore } from '../../store/uiStore';
import Header from './Header';
import Sidebar from './Sidebar';
import clsx from 'clsx';

const MainLayout = ({ children }) => {
    const { sidebarCollapsed } = useUIStore();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />

            <div className="flex h-screen pt-16">
                <Sidebar />

                <main
                    className={clsx(
                        'flex-1 overflow-hidden transition-all duration-300',
                        sidebarCollapsed ? 'ml-16' : 'ml-64'
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;