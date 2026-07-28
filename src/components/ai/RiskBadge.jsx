import React from 'react';

const RiskBadge = ({ stats }) => {
    if (!stats || stats.totalLogs === 0) return null;

    // ERROR ve WARN oranlarını yüzdelik olarak hesaplıyoruz
    const errorRate = (stats.errorCount / stats.totalLogs) * 100;
    const warnRate = (stats.warnCount / stats.totalLogs) * 100;

    let riskLevel = 'DÜŞÜK';
    let bgColor = 'rgba(35, 165, 89, 0.1)'; // Yeşil arka plan
    let textColor = 'var(--color-info)'; // Yeşil metin
    let icon = '✅';

    // Matematiksel oranlara göre dinamik risk tespiti
    if (errorRate > 10 || stats.errorCount > 20) {
        riskLevel = 'KRİTİK';
        bgColor = 'rgba(218, 55, 60, 0.1)';
        textColor = 'var(--color-error)';
        icon = '🚨';
    } else if (errorRate > 2 || warnRate > 15 || stats.errorCount > 0) {
        riskLevel = 'YÜKSEK';
        bgColor = 'rgba(235, 143, 62, 0.1)';
        textColor = 'var(--color-warn)';
        icon = '⚠️';
    } else if (warnRate > 5) {
        riskLevel = 'ORTA';
        bgColor = 'rgba(235, 143, 62, 0.05)';
        textColor = '#d4a849';
        icon = '👀';
    }

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: bgColor,
            border: `1px solid ${textColor}`,
            borderRadius: '20px',
            color: textColor,
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginBottom: '20px'
        }}>
            <span>{icon}</span> Sistem Risk Seviyesi: {riskLevel}
        </div>
    );
};

export default RiskBadge;