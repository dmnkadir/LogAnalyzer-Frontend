import React, { useState, useEffect, useContext } from 'react'; // useContext eklendi
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import { AiContext } from '../../context/AiContext';

const ExceptionExplainModal = ({ isOpen, onClose, exceptionName }) => {
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { aiProvider } = useContext(AiContext);

    useEffect(() => {
        // Modal açıldığında ve bir exception adı geldiğinde Backend'e istek at
        if (isOpen && exceptionName) {
            fetchExplanation(exceptionName);
        } else {
            setAiResponse('');
        }
    }, [isOpen, exceptionName]);

    const fetchExplanation = async (name) => {
        setIsLoading(true);
        setAiResponse('');
        try {
            // Yeni oluşturduğumuz /explain-exception endpoint'ine istek atıyoruz
            const response = await api.post('/ai/explain-exception', {
                exceptionName: name,
                provider: aiProvider
            });
            setAiResponse(response.data.data);
        } catch (error) {
            setAiResponse("Yapay zeka analiz yaparken bir hata oluştu. Backend servisini kontrol edin.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px',
                width: '600px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto',
                border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '20px', background: 'transparent',
                    border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                    ✖
                </button>

                <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🤖</span> {exceptionName} Analizi
                </h3>

                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--color-error)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span style={{ fontStyle: 'italic' }}>Yapay Zeka hatayı yorumluyor...</span>
                    </div>
                ) : (
                    <div style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '15px' }}>
                        <ReactMarkdown
                            components={{
                                h3: ({node, ...props}) => <h3 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '10px', marginTop: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }} {...props} />,
                                strong: ({node, ...props}) => <strong style={{ color: 'var(--color-error)', fontWeight: 'bold' }} {...props} />,
                                ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', margin: '10px 0' }} {...props} />,
                                ol: ({node, ...props}) => <ol style={{ paddingLeft: '20px', margin: '10px 0' }} {...props} />,
                                li: ({node, ...props}) => <li style={{ marginBottom: '5px' }} {...props} />,
                                p: ({node, ...props}) => <p style={{ margin: '0 0 10px 0' }} {...props} />
                            }}
                        >
                            {aiResponse}
                        </ReactMarkdown>
                    </div>
                )}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
};

export default ExceptionExplainModal;