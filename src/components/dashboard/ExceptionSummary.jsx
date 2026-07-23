import React from 'react';

const ExceptionSummary = ({ stats }) => {
    // Veri yoksa veya hiç log yüklenmemişse boşuna yer kaplamasın
    if (!stats || stats.totalLogs === 0) return null;

    // Tarih formatlamak için küçük bir yardımcı fonksiyon
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute:'2-digit', second:'2-digit'
        });
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            backgroundColor: 'var(--bg-card)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
            <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⚡ En Çok Görülen Exception
                </h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--color-error)' }}>
                    {stats.mostFrequentException || "Bulunmadı"}
                </p>
            </div>

            <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🐛 En Hatalı Sınıf (Class)
                </h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--color-warn)' }}>
                    {stats.mostErrorProneClass || "Bulunmadı"}
                </p>
            </div>

            <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🕒 İlk Hata Zamanı
                </h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    {formatDate(stats.firstErrorTime)}
                </p>
            </div>

            <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⏳ Son Hata Zamanı
                </h4>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    {formatDate(stats.lastErrorTime)}
                </p>
            </div>
        </div>
    );
};

export default ExceptionSummary;