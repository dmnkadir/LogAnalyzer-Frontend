import React, { useEffect, useState } from 'react';

const StatsCard = ({ title, value, icon, colorVar, delay = 0 }) => {
    const [count, setCount] = useState(0);

    // Basit sayı sayma animasyonu
    useEffect(() => {
        if (typeof value !== 'number') {
            setCount(value);
            return;
        }

        let start = 0;
        const end = value;
        if (start === end) {
            setCount(String(end));
            return;
        }

        let totalMilSecDur = 1000;
        let incrementTime = (totalMilSecDur / end) * 2;
        if (incrementTime < 10) incrementTime = 10; // Çok hızlı saymayı engelle

        let timer = setInterval(() => {
            start += Math.ceil(end / 50); // Hızlı artış için adımları büyüt
            if (start >= end) {
                setCount(String(end));
                clearInterval(timer);
            } else {
                setCount(String(start));
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            animation: `fadeInUp 0.5s ease-out ${delay}s both`
        }}>
            {/* İkon Kutusu */}
            <div style={{
                fontSize: '24px',
                color: `var(${colorVar})`,
                backgroundColor: 'var(--bg-input)',
                padding: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '55px',
                height: '55px',
                boxSizing: 'border-box'
            }}>
                {icon}
            </div>

            {/* Yazı Alanı */}
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {title}
                </h3>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    {count}
                </p>
            </div>

            {/* Animasyon Keyframes */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default StatsCard;