import React, { useState, useContext } from 'react'; // useContext eklendi
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AiContext } from '../context/AiContext';

function DummyLogGenerator() {
    const navigate = useNavigate();
    const { aiProvider } = useContext(AiContext);

    const [systemType, setSystemType] = useState('Spring Boot');
    const [scenario, setScenario] = useState('NullPointerException');
    const [minLines, setMinLines] = useState(40);
    const [maxLines, setMaxLines] = useState(60);
    const [customPrompt, setCustomPrompt] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [generatedSessionId, setGeneratedSessionId] = useState(null);

    const systemOptions = [
        'Spring Boot', 'PostgreSQL', 'Nginx', 'Docker',
        'Kubernetes', 'Redis', 'RabbitMQ', 'Kafka', 'React/Node.js'
    ];
    const scenarioOptions = [
        'NullPointerException', 'Database Connection Lost', 'Connection Timeout',
        'Memory Leak', 'Out of Memory (OOME)', 'HTTP 500 Internal Server Error',
        'HTTP 404 Not Found', 'SSL Error', 'Disk Full', 'Connection Refused',
        'Deadlock', 'DDoS Attack', 'Slow Query', 'Unauthorized Access'
    ];
    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        setGeneratedSessionId(null);

        // MANTIKSAL KONTROLLER
        const min = parseInt(minLines);
        const max = parseInt(maxLines);

        if (min > max) {
            setMessage({ text: 'Hata: Minimum satır sayısı, Maksimum satır sayısından büyük olamaz!', type: 'error' });
            setIsLoading(false);
            return;
        }

        if (max > 300) {
            setMessage({ text: 'Hata: Yapay zekanın API token sınırına (nefesine) takılmamak için maksimum 150 satır üretebilirsiniz.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                systemType,
                scenario,
                minLines: min,
                maxLines: max,
                customPrompt,
                provider: aiProvider
            };

            const response = await api.post('/ai/generate-dummy', payload);

            const newSessionId = response.data.data;
            setGeneratedSessionId(newSessionId);
            setMessage({ text: response.data.message || 'Loglar başarıyla üretildi!', type: 'success' });

        } catch (error) {
            console.error("Log üretim hatası:", error);
            setMessage({
                text: error.response?.data?.message || 'Log üretilirken bir hata oluştu. Backend ayakta mı?',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>

            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span></span> AI Destekli Log Üretici
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
                    Yapay zekaya istediğiniz senaryoda ve sistemde sentetik (dummy) loglar ürettirerek sisteminizi test edin.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Sistem Tipi</label>
                            <select
                                value={systemType}
                                onChange={(e) => setSystemType(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px', outline: 'none' }}
                            >
                                {systemOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Hata Senaryosu</label>
                            <select
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px', outline: 'none' }}
                            >
                                {scenarioOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                            Üretilecek Log Satırı Sayısı (Maksimum 150)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <input
                                type="number"
                                min="10"
                                max="150"
                                value={minLines}
                                onChange={(e) => setMinLines(e.target.value)}
                                style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '15px', outline: 'none', textAlign: 'center' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '14px' }}>İLE</span>
                            <input
                                type="number"
                                min="10"
                                max="150"
                                value={maxLines}
                                onChange={(e) => setMaxLines(e.target.value)}
                                style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '15px', outline: 'none', textAlign: 'center' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Satır Arası</span>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Ekstra Detaylar (İsteğe Bağlı)</label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Örn: Logların içinde mutlaka 192.168.1.55 IP adresi geçsin ve hatalar gece saat 03:00 sularında yoğunlaşsın..."
                            rows="3"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '14px',
                            backgroundColor: isLoading ? 'var(--bg-input)' : 'var(--btn-primary)',
                            color: isLoading ? 'var(--text-muted)' : 'white',
                            border: isLoading ? '1px solid var(--border-color)' : 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '10px'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div style={{ width: '18px', height: '18px', border: '3px solid var(--text-muted)', borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                AI Logları Üretiyor... (15-20 saniye sürebilir)
                            </>
                        ) : 'Yapay Zeka ile Log Üret'}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                </form>

                {message.text && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'success' ? 'rgba(35, 165, 89, 0.1)' : 'rgba(218, 55, 60, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'var(--color-info)' : 'var(--color-error)'}`,
                        color: message.type === 'success' ? 'var(--text-main)' : 'var(--color-error)'
                    }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{message.text}</p>

                        {generatedSessionId && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{ padding: '8px 15px', backgroundColor: 'var(--color-info)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                            >
                                Dashboard'a Git ve Analiz Et
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DummyLogGenerator;