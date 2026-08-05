import React, { useState } from 'react';
import ExceptionExplainModal from '../ai/ExceptionExplainModal';
// YENİ: Emojiler yerine lucide ikonları çağrıldı
import { Zap, Bug, Clock, Timer, Sparkles } from 'lucide-react';

const ExceptionSummary = ({ stats }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedException, setSelectedException] = useState('');

    if (!stats || stats.totalLogs === 0) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute:'2-digit', second:'2-digit'
        });
    };

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
                marginBottom: '5px'
            }}>
                {/* 1. Kutu */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={14} color="var(--color-warn)" /> En Çok Görülen
                    </h4>
                    {stats.mostFrequentException ? (
                        <button
                            onClick={handleExceptionClick}
                            style={{
                                margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--color-error)',
                                background: 'rgba(218, 55, 60, 0.05)', border: '1px dashed var(--color-error)',
                                borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.3s ease',
                                display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(218, 55, 60, 0.15)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(218, 55, 60, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(218, 55, 60, 0.05)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            title="Yapay Zeka ile Analiz Et"
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats.mostFrequentException}</span>
                            <Sparkles size={16} />
                        </button>
                    ) : (
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Bulunmadı</p>
                    )}
                </div>

                {/* 2. Kutu */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bug size={14} color="var(--color-error)" /> En Hatalı Sınıf
                    </h4>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--color-warn)', wordBreak: 'break-all' }}>
                        {stats.mostErrorProneClass || "Bulunmadı"}
                    </p>
                </div>

                {/* 3. Kutu */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--color-info)" /> İlk Hata Zamanı
                    </h4>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        {formatDate(stats.firstErrorTime)}
                    </p>
                </div>

                {/* 4. Kutu */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Timer size={14} color="var(--btn-primary)" /> Son Hata Zamanı
                    </h4>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        {formatDate(stats.lastErrorTime)}
                    </p>
                </div>
            </div>

            <ExceptionExplainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exceptionName={selectedException}
            />
        </>
    );
};

export default ExceptionSummary;