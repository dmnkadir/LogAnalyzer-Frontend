import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import LogFilter from './logs/LogFilter';
import LogSearch from './logs/LogSearch';
import ReactMarkdown from 'react-markdown';
import { AiContext } from '../context/AiContext';
import SkeletonLoader from './common/SkeletonLoader';
import EmptyState from './common/EmptyState';
import { motion } from 'framer-motion';
// YENİ: İlgili marka ve tasarım ikonları eklendi
import { List, Sparkles, Search, Cpu, Code, Brain, Bot } from 'lucide-react';
import { SiNvidia, SiGoogle } from 'react-icons/si';

function LogTable({ refreshTrigger, selectedSessions }) {
    const { aiProvider } = useContext(AiContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 15;

    // YENİ: Seçili AI modeline göre dinamik ikon getiren yardımcı fonksiyon
    const getProviderIcon = (provider, size = 14) => {
        if (!provider) return <Bot size={size} color="var(--btn-primary)" />;
        if (provider.includes('gemini')) return <Sparkles size={size} color="#8A2BE2" />;
        if (provider.includes('groq')) return <Cpu size={size} color="#F97316" />;
        if (provider.includes('nvidia')) return <SiNvidia size={size} color="#76B900" />;
        if (provider.includes('cohere')) return <Code size={size} color="#3B82F6" />;
        if (provider.includes('google')) return <SiGoogle size={size} color="#4285F4" />;
        if (provider.includes('openai')) return <Brain size={size} color="#10A37F" />;
        return <Bot size={size} color="var(--btn-primary)" />; // Varsayılan
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, levelFilter]);

    useEffect(() => {
        if (!selectedSessions || selectedSessions.length === 0) {
            setLogs([]);
            return;
        }

        const timerId = setTimeout(async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (levelFilter) params.append('level', levelFilter);
                selectedSessions.forEach(id => params.append('sessionIds', id));

                const response = await api.get(`/logs/filter?${params.toString()}`);
                setLogs(response.data.data || []);
            } catch (err) {
                console.error("Loglar çekilemedi", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timerId);

    }, [refreshTrigger, selectedSessions, keyword, levelFilter]);

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(logs.length / logsPerPage);

    const handleAskAI = async (logMessage) => {
        setIsAiLoading(true);
        setAiResponse('');

        try {
            const prompt = `Sen uzman bir sistem yöneticisisin. Aşağıdaki tek satırlık log mesajını incele ve açıkla. Yanıtın TÜRKÇE olmalıdır.\nÖNEMLİ: Hata isimlerini (örn: NullPointerException), IP adreslerini ve teknik terimleri mutlaka **kalın** (Markdown bold) yaz.\n\nLütfen cevabını aşağıdaki MARKDOWN formatını BİREBİR kopyalayarak ver (Başka hiçbir giriş cümlesi kurma):\n\n### Kök Neden\n[Hatanın teknik sebebini açıklayan kısa paragraf]\n\n### Çözüm Önerisi\n1. [İlk çözüm adımı]\n2. [İkinci çözüm adımı]\n\nİncelenecek Log: "${logMessage}"`;

            const response = await api.get(`/ai/test?soru=${encodeURIComponent(prompt)}&provider=${aiProvider}`);
            setAiResponse(response.data.data);
        } catch (err) {
            console.error("Yapay zeka hatası:", err);
            setAiResponse("Yapay zekaya ulaşılamadı. Backend açık mı?");
        } finally {
            setIsAiLoading(false);
        }
    };

    const getHighlightedText = (text, highlight) => {
        if (!highlight.trim()) {
            return <span>{text}</span>;
        }
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ?
                    <span key={i} style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0 2px', borderRadius: '2px', fontWeight: 'bold' }}>{part}</span> : part
            )}
        </span>;
    };

    if (!selectedSessions || selectedSessions.length === 0) {
        return (
            <div style={{ marginTop: '40px' }}>
                <EmptyState
                    icon={<List size={48} color="var(--text-muted)" strokeWidth={1.5} />}
                    title="Oturum Seçilmedi"
                    description="Log tablosunu görüntülemek için yukarıdan en az bir oturum seçin."
                />
            </div>
        );
    }

    return (
        <div style={{ marginTop: '40px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <List size={20} color="var(--btn-primary)" /> Detaylı Log Listesi
                </h3>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <LogSearch keyword={keyword} onSearchChange={setKeyword} />
                    <LogFilter currentFilter={levelFilter} onFilterChange={setLevelFilter} />
                </div>
            </div>

            {(isAiLoading || aiResponse) && (
                <div style={{ marginBottom: '20px', padding: '25px', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--btn-primary)', borderRadius: '0 8px 8px 0', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                        {/* YENİ: Başlık yanındaki ikon artık dinamik! */}
                        {getProviderIcon(aiProvider, 18)} Yapay Zeka Hata Analizi
                    </h4>
                    {isAiLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                            <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--text-dark)', borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <span style={{ fontStyle: 'italic' }}>Yapay zeka satırı inceliyor...</span>
                        </div>
                    ) : (
                        <div style={{ margin: 0, lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <ReactMarkdown
                                components={{
                                    h3: ({node, ...props}) => <h3 style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '10px', marginTop: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px' }} {...props} />,
                                    strong: ({node, ...props}) => <strong style={{ color: 'var(--color-warn)', fontWeight: 'bold' }} {...props} />,
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
            )}

            {loading ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <SkeletonLoader height="35px" />
                    <SkeletonLoader height="35px" />
                    <SkeletonLoader height="35px" />
                    <SkeletonLoader height="35px" />
                    <SkeletonLoader height="35px" />
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                        <tr style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '15px 10px', fontWeight: '600' }}>Tarih</th>
                            <th style={{ padding: '15px 10px', fontWeight: '600' }}>Seviye</th>
                            <th style={{ padding: '15px 10px', fontWeight: '600', width: '60%' }}>Mesaj</th>
                            <th style={{ padding: '15px 10px', fontWeight: '600', textAlign: 'right' }}>Aksiyon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentLogs.map((log, index) => (
                            <motion.tr
                                key={log.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-main)',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--bg-main)'}
                            >
                                <td style={{ padding: '12px 10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {log.logTimestamp ? log.logTimestamp.replace('T', ' ') : (log.createdAt ? log.createdAt.replace('T', ' ') : '-')}
                                </td>
                                <td style={{ padding: '12px 10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        backgroundColor: log.logLevel === 'ERROR' ? 'rgba(218, 55, 60, 0.1)' : (log.logLevel === 'WARN' ? 'rgba(240, 178, 50, 0.1)' : 'rgba(35, 165, 89, 0.1)'),
                                        color: log.logLevel === 'ERROR' ? 'var(--color-error)' : (log.logLevel === 'WARN' ? 'var(--color-warn)' : 'var(--color-info)'),
                                        border: `1px solid ${log.logLevel === 'ERROR' ? 'var(--color-error)' : (log.logLevel === 'WARN' ? 'var(--color-warn)' : 'var(--color-info)')}`
                                    }}>
                                        {log.logLevel}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 10px', color: 'var(--text-main)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    {getHighlightedText(log.message, keyword)}
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                                    {(log.logLevel === 'ERROR' || (log.message && log.message.includes('ERROR'))) && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAskAI(log.message)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: 'transparent',
                                                color: 'var(--btn-primary)',
                                                border: '1px solid var(--btn-primary)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--btn-primary)'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--btn-primary)'; }}
                                        >
                                            {/* YENİ: Buton içindeki ikon artık dinamik! */}
                                            {getProviderIcon(aiProvider, 14)} AI Açıkla
                                        </motion.button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && (
                        <EmptyState
                            icon={<Search size={48} color="var(--text-muted)" strokeWidth={1.5} />}
                            title="Sonuç Bulunamadı"
                            description="Arama kriterlerinize veya seçtiğiniz log seviyesine uygun kayıt yok."
                        />
                    )}

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10px 0 10px', marginTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                Toplam <b>{logs.length}</b> sonuçtan <b>{indexOfFirstLog + 1}-{Math.min(indexOfLastLog, logs.length)}</b> arası gösteriliyor.
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '6px 12px', backgroundColor: currentPage === 1 ? 'transparent' : 'var(--bg-input)', color: currentPage === 1 ? 'var(--text-dark)' : 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Önceki
                                </button>
                                <span style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '6px 12px', backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--bg-input)', color: currentPage === totalPages ? 'var(--text-dark)' : 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    Sonraki
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default LogTable;