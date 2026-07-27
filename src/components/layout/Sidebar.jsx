import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const getLinkStyle = (path) => ({
        display: 'block',
        padding: '12px 20px',
        color: location.pathname === path ? 'var(--text-main)' : 'var(--text-muted)',
        backgroundColor: location.pathname === path ? 'var(--bg-input)' : 'transparent',
        textDecoration: 'none',
        fontWeight: location.pathname === path ? 'bold' : 'normal',
        borderRadius: '8px',
        marginBottom: '10px',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{
            width: '260px',
            height: '100%',
            backgroundColor: 'var(--bg-card)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            {/* Logo Alanı */}
            <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '24px' }}>
                    <span style={{ color: 'var(--color-info)' }}>LOG</span>Analyzer
                </h2>
            </div>

            {/* Menü Linkleri (Tırnak işaretleri kaldırıldı!) */}
            <nav style={{ flex: 1 }}>
                <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Dashboard</Link>
                <Link to="/reports" style={getLinkStyle('/reports')}>Incident Raporları</Link>
                <Link to="/dummy-generator" style={getLinkStyle('/dummy-generator')}>AI Log Üretici</Link>
            </nav>

            {/* Alt Bilgi */}
            <div style={{ padding: '10px', fontSize: '12px', color: 'var(--text-dark)', textAlign: 'center' }}>
                v1.0.0
            </div>
        </div>
    );
}

export default Sidebar;