import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ theme, toggleTheme }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px' }}>Log Analyzer Panel</h2>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {/* Tema Butonu (Kare İkon) */}
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
                    style={{
                        width: '45px', height: '45px', fontSize: '24px',
                        backgroundColor: 'var(--bg-input)', color: 'var(--text-main)',
                        border: '1px solid var(--border-color)', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
                    }}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                {/* Çıkış Butonu */}
                <button
                    onClick={handleLogout}
                    style={{ padding: '10px 20px', backgroundColor: 'var(--btn-danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Çıkış Yap
                </button>
            </div>
        </header>
    );
}

export default Header;