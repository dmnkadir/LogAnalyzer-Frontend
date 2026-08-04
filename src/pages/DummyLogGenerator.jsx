import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AiContext } from '../context/AiContext';
import { motion, AnimatePresence } from 'framer-motion';
// İKONLAR
import { ChevronDown, AlertTriangle, Database, Timer, Cpu, ServerCrash, FileQuestion, Lock, HardDrive, WifiOff, ShieldAlert, ShieldX, Terminal, Wand2 } from 'lucide-react';
import { SiSpringboot, SiPostgresql, SiNginx, SiDocker, SiKubernetes, SiRedis, SiRabbitmq, SiApachekafka, SiReact } from 'react-icons/si';

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

    // Custom Dropdown State'leri
    const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);
    const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
    const systemRef = useRef(null);
    const scenarioRef = useRef(null);

    // Dışarı tıklayınca dropdown'ları kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (systemRef.current && !systemRef.current.contains(event.target)) setIsSystemDropdownOpen(false);
            if (scenarioRef.current && !scenarioRef.current.contains(event.target)) setIsScenarioDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const systemOptions = [
        { value: 'Spring Boot', icon: <SiSpringboot size={16} color="#6DB33F" /> },
        { value: 'PostgreSQL', icon: <SiPostgresql size={16} color="#4169E1" /> },
        { value: 'Nginx', icon: <SiNginx size={16} color="#009639" /> },
        { value: 'Docker', icon: <SiDocker size={16} color="#2496ED" /> },
        { value: 'Kubernetes', icon: <SiKubernetes size={16} color="#326CE5" /> },
        { value: 'Redis', icon: <SiRedis size={16} color="#DC382D" /> },
        { value: 'RabbitMQ', icon: <SiRabbitmq size={16} color="#FF6600" /> },
        { value: 'Kafka', icon: <SiApachekafka size={16} /> },
        { value: 'React/Node.js', icon: <SiReact size={16} color="#61DAFB" /> }
    ];

    const scenarioOptions = [
        'NullPointerException', 'Database Connection Lost', 'Connection Timeout',
        'Memory Leak', 'Out of Memory (OOME)', 'HTTP 500 Internal Server Error',
        'HTTP 404 Not Found', 'SSL Error', 'Disk Full', 'Connection Refused',
        'Deadlock', 'DDoS Attack', 'Slow Query', 'Unauthorized Access'
    ];

    // Senaryo ismine göre mantıksal ikon getiren yardımcı fonksiyon
    const getScenarioIcon = (scen) => {
        if (scen.includes('Database') || scen.includes('Query')) return <Database size={16} color="var(--color-warn)" />;
        if (scen.includes('Timeout')) return <Timer size={16} color="var(--color-warn)" />;
        if (scen.includes('Memory')) return <Cpu size={16} color="var(--color-error)" />;
        if (scen.includes('500')) return <ServerCrash size={16} color="var(--color-error)" />;
        if (scen.includes('404')) return <FileQuestion size={16} color="var(--color-warn)" />;
        if (scen.includes('SSL') || scen.includes('Deadlock')) return <Lock size={16} color="var(--color-error)" />;
        if (scen.includes('Disk')) return <HardDrive size={16} color="var(--color-error)" />;
        if (scen.includes('Refused')) return <WifiOff size={16} color="var(--color-error)" />;
        if (scen.includes('DDoS')) return <ShieldAlert size={16} color="var(--color-error)" />;
        if (scen.includes('Unauthorized')) return <ShieldX size={16} color="var(--color-error)" />;
        return <AlertTriangle size={16} color="var(--color-warn)" />; // Default
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        setGeneratedSessionId(null);

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
            const payload = { systemType, scenario, minLines: min, maxLines: max, customPrompt, provider: aiProvider };
            const response = await api.post('/ai/generate-dummy', payload);

            setGeneratedSessionId(response.data.data);
            setMessage({ text: response.data.message || 'Loglar başarıyla üretildi!', type: 'success' });

        } catch (error) {
            console.error("Log üretim hatası:", error);
            setMessage({ text: error.response?.data?.message || 'Log üretilirken bir hata oluştu. Backend ayakta mı?', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>

            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Terminal size={32} color="var(--btn-primary)" /> AI Destekli Log Üretici
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
                    Yapay zekaya istediğiniz senaryoda ve sistemde sentetik (dummy) loglar ürettirerek sisteminizi test edin.
                </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                        {/* CUSTOM SİSTEM TİPİ SEÇİCİ */}
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Sistem Tipi</label>
                            <div ref={systemRef} style={{ position: 'relative' }}>
                                <div
                                    onClick={() => setIsSystemDropdownOpen(!isSystemDropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px',
                                        cursor: 'pointer', userSelect: 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {systemOptions.find(o => o.value === systemType)?.icon}
                                        <span style={{ fontWeight: '500' }}>{systemType}</span>
                                    </div>
                                    <ChevronDown size={16} style={{ transform: isSystemDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
                                </div>

                                <AnimatePresence>
                                    {isSystemDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', top: '100%', left: 0, width: '100%',
                                                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                                borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '250px', zIndex: 50, marginTop: '5px'
                                            }}
                                        >
                                            {systemOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => { setSystemType(opt.value); setIsSystemDropdownOpen(false); }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px',
                                                        cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s',
                                                        backgroundColor: systemType === opt.value ? 'var(--bg-main)' : 'transparent'
                                                    }}
                                                >
                                                    {opt.icon} {opt.value}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* CUSTOM HATA SENARYOSU SEÇİCİ */}
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Hata Senaryosu</label>
                            <div ref={scenarioRef} style={{ position: 'relative' }}>
                                <div
                                    onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px',
                                        cursor: 'pointer', userSelect: 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {getScenarioIcon(scenario)}
                                        <span style={{ fontWeight: '500' }}>{scenario}</span>
                                    </div>
                                    <ChevronDown size={16} style={{ transform: isScenarioDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
                                </div>

                                <AnimatePresence>
                                    {isScenarioDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', top: '100%', left: 0, width: '100%',
                                                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                                borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '250px', zIndex: 50, marginTop: '5px'
                                            }}
                                        >
                                            {scenarioOptions.map((opt) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => { setScenario(opt); setIsScenarioDropdownOpen(false); }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px',
                                                        cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s',
                                                        backgroundColor: scenario === opt ? 'var(--bg-main)' : 'transparent'
                                                    }}
                                                >
                                                    {getScenarioIcon(opt)} {opt}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                            Üretilecek Log Satırı Sayısı (Maksimum 150)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <input
                                type="number" min="10" max="150" value={minLines} onChange={(e) => setMinLines(e.target.value)}
                                style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '15px', outline: 'none', textAlign: 'center' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '14px' }}>İLE</span>
                            <input
                                type="number" min="10" max="150" value={maxLines} onChange={(e) => setMaxLines(e.target.value)}
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

                    <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.01 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
                            transition: 'background-color 0.2s',
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
                        ) : (
                            <><Wand2 size={18} /> Yapay Zeka ile Log Üret</>
                        )}
                    </motion.button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                </form>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '20px', padding: '15px', borderRadius: '4px',
                            backgroundColor: message.type === 'success' ? 'rgba(35, 165, 89, 0.1)' : 'rgba(218, 55, 60, 0.1)',
                            border: `1px solid ${message.type === 'success' ? 'var(--color-info)' : 'var(--color-error)'}`,
                            color: message.type === 'success' ? 'var(--text-main)' : 'var(--color-error)'
                        }}
                    >
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {message.type === 'success' ? '✅' : '❌'} {message.text}
                        </p>

                        {generatedSessionId && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{ padding: '8px 15px', backgroundColor: 'var(--color-info)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                            >
                                Dashboard'a Git ve Analiz Et
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default DummyLogGenerator;