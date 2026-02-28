import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AppLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', paddingTop: '70px', flex: 1 }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    marginLeft: '240px',
                    minHeight: 'calc(100vh - 70px)',
                    padding: '2rem',
                    background: 'var(--bg)',
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
