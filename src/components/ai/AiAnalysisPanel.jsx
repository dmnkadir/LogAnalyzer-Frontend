import React from 'react';
import ReactMarkdown from 'react-markdown';

const AiAnalysisPanel = ({ reportText, isLoading, onAnalyze, disabled }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px' }}>AI Olay Raporu (Incident Report)</h3>
                <button
                    onClick={onAnalyze}
                    disabled={disabled || isLoading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isLoading || disabled ? 'var(--bg-input)' : 'var(--btn-primary)',
                        color: isLoading || disabled ? 'var(--text-muted)' : 'white',
                        border: isLoading || disabled ? '1px solid var(--border-color)' : 'none',
                        borderRadius: '4px',
                        cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}>
                    {isLoading ? (
                        <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            Rapor Hazırlanıyor...
                        </>
                    ) : 'Seçili Oturumları Analiz Et'}
                </button>
            </div>

            {/* Eğer rapor varsa Markdown olarak render et */}
            {reportText && (
                <div style={{
                    marginTop: '25px',
                    padding: '25px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    lineHeight: '1.8',
                    fontSize: '15px'
                }}>
                    <ReactMarkdown
                        components={{
                            // Markdown elementlerini kendi tasarım sistemimize göre özelleştiriyoruz
                            h3: ({node, ...props}) => <h3 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginTop: '30px', marginBottom: '15px', fontSize: '18px' }} {...props} />,
                            strong: ({node, ...props}) => <strong style={{ color: 'var(--color-warn)', fontWeight: '700' }} {...props} />,
                            ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', margin: '15px 0', color: 'var(--text-muted)' }} {...props} />,
                            li: ({node, ...props}) => <li style={{ marginBottom: '10px' }} {...props} />,
                            p: ({node, ...props}) => <p style={{ color: 'var(--text-muted)', margin: '0 0 15px 0' }} {...props} />
                        }}
                    >
                        {reportText}
                    </ReactMarkdown>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AiAnalysisPanel;