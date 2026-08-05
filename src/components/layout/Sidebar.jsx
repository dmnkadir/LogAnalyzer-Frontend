import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Terminal } from 'lucide-react'; // YENİ: Lucide ikonları eklendi

function Sidebar() {
    const location = useLocation();

    return (
        <div className="glass-panel" style={{
            width: '260px',
            height: '100%',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box',
            zIndex: 50
        }}>
            {/* Logo Alanı */}
            <div style={{ marginBottom: '40px', padding: '0 10px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <span className="text-gradient">LOG</span>
                    <span style={{ color: 'var(--text-main)' }}>Analyzer</span>
                </h2>
            </div>

            {/* Menü Linkleri */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link
                    to="/dashboard"
                    className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link
                    to="/reports"
                    className={`sidebar-link ${location.pathname === '/reports' ? 'active' : ''}`}
                >
                    <FileText size={20} />
                    Incident Raporları
                </Link>
                <Link
                    to="/dummy-generator"
                    className={`sidebar-link ${location.pathname === '/dummy-generator' ? 'active' : ''}`}
                >
                    <Terminal size={20} />
                    AI Log Üretici
                </Link>
            </nav>

            {/* Alt Bilgi */}
            <div style={{ padding: '10px', fontSize: '12px', color: 'var(--text-dark)', textAlign: 'center', fontWeight: '500' }}>
                v1.0.0
            </div>
        </div>
    );
}

export default Sidebar;