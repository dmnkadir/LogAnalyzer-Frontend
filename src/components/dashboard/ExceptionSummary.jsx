import React, { useState } from 'react';
import ExceptionExplainModal from '../ai/ExceptionExplainModal';

const ExceptionSummary = ({ stats }) => {
    // Modal State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedException, setSelectedException] = useState('');

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

    // Hataya tıklandığında Modalı açacak fonksiyon
    const handleExceptionClick = () => {
        if (stats.mostFrequentException) {
            setSelectedException(stats.mostFrequentException);
            setIsModalOpen(true);
        }
    };

    return (
        <>
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

                    {/* DÜZ YAZI YERİNE TIKLANABİLİR BUTON */}
                    {stats.mostFrequentException ? (
                        <button
                            onClick={handleExceptionClick}
                            style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--color-error)',
                                background: 'transparent',
                                border: '1px dashed var(--color-error)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(218, 55, 60, 0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Yapay Zeka ile Analiz Et"
                        >
                            {stats.mostFrequentException} <span style={{ fontSize: '14px' }}>✨</span>
                        </button>
                    ) : (
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Bulunmadı</p>
                    )}
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

            {/* YENİ: MODAL BİLEŞENİNİN EKLENDİĞİ YER */}
            <ExceptionExplainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exceptionName={selectedException}
            />
        </>
    );
};

export default ExceptionSummary;