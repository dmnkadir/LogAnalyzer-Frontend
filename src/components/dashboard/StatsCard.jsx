import React, { useEffect, useState } from 'react';

const StatsCard = ({ title, value, icon, colorVar, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

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
        if (incrementTime < 10) incrementTime = 10;

        let timer = setInterval(() => {
            start += Math.ceil(end / 50);
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
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px', // YENİ: Daha modern yuvarlatılmış köşeler
                border: `1px solid ${isHovered ? `color-mix(in srgb, var(${colorVar}) 40%, transparent)` : 'var(--border-color)'}`,
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                // YENİ: Hover durumunda kendi renginde glow efekti (Zıplama yok)
                boxShadow: isHovered
                    ? `0 8px 24px color-mix(in srgb, var(${colorVar}) 15%, transparent)`
                    : '0 4px 10px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.5s ease-out ${delay}s both`
            }}
        >
            {/* İkon Kutusu */}
            <div style={{
                fontSize: '24px',
                color: `var(${colorVar})`,
                // YENİ: İkonun arka planı da kendi renginin %10 şeffaflığıyla uyumlu oldu
                backgroundColor: `color-mix(in srgb, var(${colorVar}) 10%, transparent)`,
                padding: '15px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '55px',
                height: '55px',
                boxSizing: 'border-box',
                boxShadow: isHovered ? `inset 0 0 10px color-mix(in srgb, var(${colorVar}) 20%, transparent)` : 'none',
                transition: 'all 0.3s ease'
            }}>
                {icon}
            </div>

            {/* Yazı Alanı */}
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </h3>
                <p style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                    {count}
                </p>
            </div>

            {/* Animasyon Keyframes */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default StatsCard;