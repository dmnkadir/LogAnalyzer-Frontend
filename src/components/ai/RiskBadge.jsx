import React from 'react';
// YENİ: Emojiler yerine lucide ikonları
import { CheckCircle2, AlertOctagon, AlertTriangle, Eye } from 'lucide-react';

const RiskBadge = ({ stats }) => {
    if (!stats || stats.totalLogs === 0) return null;

    const errorRate = (stats.errorCount / stats.totalLogs) * 100;
    const warnRate = (stats.warnCount / stats.totalLogs) * 100;

    let riskLevel = 'DÜŞÜK';
    let bgColor = 'rgba(35, 165, 89, 0.1)';
    let textColor = 'var(--color-info)';
    let icon = <CheckCircle2 size={18} />;
    let glowColor = 'rgba(35, 165, 89, 0.3)';

    if (errorRate > 10 || stats.errorCount > 20) {
        riskLevel = 'KRİTİK';
        bgColor = 'rgba(218, 55, 60, 0.1)';
        textColor = 'var(--color-error)';
        icon = <AlertOctagon size={18} />;
        glowColor = 'rgba(218, 55, 60, 0.4)';
    } else if (errorRate > 2 || warnRate > 15 || stats.errorCount > 0) {
        riskLevel = 'YÜKSEK';
        bgColor = 'rgba(235, 143, 62, 0.1)';
        textColor = 'var(--color-warn)';
        icon = <AlertTriangle size={18} />;
        glowColor = 'rgba(235, 143, 62, 0.4)';
    } else if (warnRate > 5) {
        riskLevel = 'ORTA';
        bgColor = 'rgba(235, 143, 62, 0.05)';
        textColor = '#d4a849';
        icon = <Eye size={18} />;
        glowColor = 'rgba(235, 143, 62, 0.2)';
    }

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 20px',
            backgroundColor: bgColor,
            border: `1px solid ${textColor}`,
            borderRadius: '30px',
            color: textColor,
            fontWeight: '700',
            fontSize: '14px',
            letterSpacing: '0.5px',
            boxShadow: `0 0 15px ${glowColor}, inset 0 0 5px ${glowColor}`,
            marginBottom: '20px',
            animation: riskLevel === 'KRİTİK' ? 'pulseGlow 2.5s infinite ease-in-out' : 'none'
        }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            Sistem Risk Seviyesi: {riskLevel}

            <style>{`
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 10px ${glowColor}, inset 0 0 5px ${glowColor}; }
                    50% { box-shadow: 0 0 20px ${glowColor}, inset 0 0 8px ${glowColor}; }
                    100% { box-shadow: 0 0 10px ${glowColor}, inset 0 0 5px ${glowColor}; }
                }
            `}</style>
        </div>
    );
};

export default RiskBadge;