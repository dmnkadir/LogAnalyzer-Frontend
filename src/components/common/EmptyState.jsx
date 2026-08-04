import React from 'react';

const EmptyState = ({ icon = '📭', title = 'Veri Bulunamadı', description = 'Gösterilecek kayıt yok.' }) => {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px 20px', textAlign: 'center', backgroundColor: 'var(--bg-card)',
            borderRadius: '8px', border: '1px dashed var(--border-color)', margin: '15px 0',
            animation: 'fadeIn 0.4s ease'
        }}>
            <span style={{ fontSize: '42px', marginBottom: '12px', opacity: 0.9 }}>{icon}</span>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '16px' }}>{title}</h4>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '300px', lineHeight: '1.5' }}>
                {description}
            </p>
        </div>
    );
};

export default EmptyState;