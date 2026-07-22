import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function MainLayout({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('appTheme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)', overflow: 'hidden' }}>

            {/* Sol Yan Menü (Mobil için sınıf ekledik) */}
            <div className="app-sidebar">
                <Sidebar />
            </div>

            {/* Sağ Taraf (Üst Bar + Ana İçerik) */}
            <div className="app-main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header theme={theme} toggleTheme={toggleTheme} />

                <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;