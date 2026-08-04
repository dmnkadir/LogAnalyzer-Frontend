import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { exportToPDF, exportToHTML } from '../../utils/exportUtils';
import { AiContext } from '../../context/AiContext';
import { Sparkles, Cpu, Code, Brain, Bot, FileDown, Globe } from 'lucide-react';
import { SiNvidia, SiGoogle } from 'react-icons/si';

const AiAnalysisPanel = ({ reportText, isLoading, onAnalyze, disabled }) => {
    // Context'ten seçili AI sağlayıcısını çekiyoruz
    const { aiProvider } = useContext(AiContext);
    const reportElementId = "dashboard-ai-report";

    // İkonlara orijinal marka renklerini Header ve LogTable'daki ile birebir aynı verdik
    const getProviderIcon = (provider, size = 16) => {
        if (!provider) return <Bot size={size} color="var(--btn-primary)" />;
        if (provider.includes('gemini')) return <Sparkles size={size} color="#8A2BE2" />;
        if (provider.includes('groq')) return <Cpu size={size} color="#F97316" />;
        if (provider.includes('nvidia')) return <SiNvidia size={size} color="#76B900" />;
        if (provider.includes('cohere')) return <Code size={size} color="#3B82F6" />;
        if (provider.includes('google')) return <SiGoogle size={size} color="#4285F4" />;
        if (provider.includes('openai')) return <Brain size={size} color="#10A37F" />;
        return <Bot size={size} color="var(--btn-primary)" />; // Varsayılan
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>

                {/* SOLDAKİ BAŞLIK */}
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px' }}>
                    AI Olay Raporu (Incident Report)
                </h3>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* DIŞA AKTAR BUTONLARI */}
                    {reportText && !isLoading && (
                        <>
                            <button
                                onClick={() => exportToPDF(reportElementId, 'Anlik_Analiz_Raporu.pdf')}
                                style={{ padding: '8px 12px', backgroundColor: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-error)'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-error)'; }}
                            >
                                <FileDown size={16} /> PDF
                            </button>
                            <button
                                onClick={() => exportToHTML(reportElementId, 'Anlik_Analiz_Raporu.html')}
                                style={{ padding: '8px 12px', backgroundColor: 'transparent', color: 'var(--color-info)', border: '1px solid var(--color-info)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-info)'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-info)'; }}
                            >
                                <Globe size={16} /> HTML
                            </button>
                        </>
                    )}

                    {/* ANALİZ BUTONU - PDF VE HTML BUTONLARIYLA AYNI MAVİ ÇERÇEVELİ STİL */}
                    <button
                        onClick={onAnalyze}
                        disabled={disabled || isLoading}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: 'transparent',
                            color: isLoading || disabled ? 'var(--text-muted)' : 'var(--btn-primary)',
                            border: `1px solid ${isLoading || disabled ? 'var(--border-color)' : 'var(--btn-primary)'}`,
                            borderRadius: '4px',
                            cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!disabled && !isLoading) {
                                e.currentTarget.style.backgroundColor = 'var(--btn-primary)';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!disabled && !isLoading) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--btn-primary)';
                            }
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div style={{ width: '16px', height: '16px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                Rapor Hazırlanıyor...
                            </>
                        ) : (
                            <>
                                {/* Renkli İkonumuz */}
                                {getProviderIcon(aiProvider, 16)}
                                Seçili Oturumları Analiz Et
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Eğer rapor varsa Markdown olarak render et */}
            {reportText && (
                <div
                    id={reportElementId}
                    style={{
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