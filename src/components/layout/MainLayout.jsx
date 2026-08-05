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

            {/* Sol Yan Menü - flexShrink: 0 eklendi ki daralmasın */}
            <div className="app-sidebar" style={{ flexShrink: 0 }}>
                <Sidebar />
            </div>

            {/* Sağ Taraf - overflowX: hidden eklendi ki yatayda taşma yapmasın */}
            <div className="app-main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
                <Header theme={theme} toggleTheme={toggleTheme} />

                <main style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;