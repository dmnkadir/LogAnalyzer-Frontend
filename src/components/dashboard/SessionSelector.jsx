import React from 'react';

const SessionSelector = ({ sessions, selectedSessionId, onSessionChange, onRefresh }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Analiz Edilecek Oturumu Seçin</h4>
                <button
                    onClick={onRefresh}
                    style={{ padding: '8px 15px', backgroundColor: 'var(--btn-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    Verileri Yenile
                </button>
            </div>
            <select
                value={selectedSessionId}
                onChange={(e) => onSessionChange(e.target.value)}
                style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '16px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            >
                <option value="">-- Bir Oturum Seçin --</option>
                {sessions && sessions.length > 0 ? (
                    sessions.map((session, index) => (
                        <option key={session.sessionId || index} value={session.sessionId || ''}>
                            {session.sessionId || 'Bilinmeyen ID'} - {session.uploadDate ? new Date(session.uploadDate).toLocaleString() : ''}
                        </option>
                    ))
                ) : (
                    <option disabled>Henüz oturum yok</option>
                )}
            </select>
        </div>
    );
};

export default SessionSelector;