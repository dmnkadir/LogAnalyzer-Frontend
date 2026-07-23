import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LogTable from '../components/LogTable';
import StatsCard from '../components/dashboard/StatsCard';
import LogDistributionChart from '../components/dashboard/LogDistributionChart';
import SessionSelector from '../components/dashboard/SessionSelector';
import ExceptionSummary from '../components/dashboard/ExceptionSummary'; // <-- 1. BİLEŞENİ İÇERİ ALDIK

function Dashboard() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const [stats, setStats] = useState({
        totalLogs: 0,
        errorCount: 0,
        warnCount: 0,
        infoCount: 0,
        debugCount: 0,
        // <-- 2. STATE'E YENİ DEĞERLER İÇİN YER AÇTIK
        mostFrequentException: null,
        mostErrorProneClass: null,
        firstErrorTime: null,
        lastErrorTime: null
    });

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [sessionReport, setSessionReport] = useState('');
    const [isReportLoading, setIsReportLoading] = useState(false);

    useEffect(() => {
        setSessionReport('');
    }, [selectedSessionId]);

    const handleAnalyzeSession = async () => {
        if (!selectedSessionId) return;
        setIsReportLoading(true);
        setSessionReport('');
        try {
            const response = await api.get(`/ai/analyze-session/${selectedSessionId}`);
            setSessionReport(response.data.data);
        } catch (error) {
            setSessionReport("Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsReportLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchSessions();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Lütfen önce bir dosya seçin.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await api.post('/logs/upload', formData);
            setMessage(response.data.message);
            fetchStats();
            fetchSessions();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            setMessage("Hata: " + (error.response?.data?.message || "Dosya yüklenemedi"));
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/logs/stats');
            if (response.data && response.data.data) {
                // <-- 3. BACKEND'DEN GELEN YENİ VERİLERİ STATE'E EŞLEDİK
                setStats({
                    totalLogs: response.data.data.totalLogs || 0,
                    errorCount: response.data.data.errorCount || 0,
                    warnCount: response.data.data.warnCount || 0,
                    infoCount: response.data.data.infoCount || 0,
                    debugCount: response.data.data.debugCount || 0,
                    mostFrequentException: response.data.data.mostFrequentException,
                    mostErrorProneClass: response.data.data.mostErrorProneClass,
                    firstErrorTime: response.data.data.firstErrorTime,
                    lastErrorTime: response.data.data.lastErrorTime
                });
            }
        } catch (error) {
            console.error("❌ İstatistikler alınamadı! Backend hatası:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await api.get('/logs/sessions');
            if (response.data && Array.isArray(response.data.data)) {
                setSessions(response.data.data);
            } else {
                setSessions([]);
            }
        } catch (error) {
            setSessions([]);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '25px', padding: '20px' }}>

            <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginTop: 0, color: 'var(--text-main)' }}>Yeni Log Dosyası Yükle</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="file" onChange={handleFileChange} style={{ color: 'var(--text-muted)' }} />
                    <button
                        onClick={handleUpload}
                        style={{ padding: '8px 20px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Yükle ve Analiz Et
                    </button>
                </div>
                {message && <p style={{ marginTop: '10px', color: 'var(--color-info)', fontWeight: 'bold' }}>{message}</p>}
            </div>

            <SessionSelector
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSessionChange={setSelectedSessionId}
                onRefresh={() => { fetchStats(); fetchSessions(); }}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                <StatsCard title="Toplam Log" value={stats.totalLogs} icon={<span>📊</span>} colorVar="--btn-primary" delay={0.1} />
                <StatsCard title="Kritik (ERROR)" value={stats.errorCount} icon={<span>🔴</span>} colorVar="--color-error" delay={0.2} />
                <StatsCard title="Uyarı (WARN)" value={stats.warnCount} icon={<span>🟠</span>} colorVar="--color-warn" delay={0.3} />
                <StatsCard title="Bilgi (INFO)" value={stats.infoCount} icon={<span>🔵</span>} colorVar="--color-info" delay={0.4} />
            </div>

            {/* <-- 4. İŞTE YENİ BİLEŞENİMİZ BURADA! (Kartların hemen altında) --> */}
            <ExceptionSummary stats={stats} />

            {selectedSessionId && (
                <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>🤖 AI Incident Report (Olay Raporu)</h3>
                        <button
                            onClick={handleAnalyzeSession}
                            disabled={isReportLoading}
                            style={{ padding: '10px 20px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: isReportLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                            {isReportLoading ? 'Analiz Ediliyor...' : 'Tüm Oturumu Analiz Et'}
                        </button>
                    </div>

                    {sessionReport && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', borderRadius: '4px', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {sessionReport}
                        </div>
                    )}
                </div>
            )}

            <LogDistributionChart stats={stats} />

            <LogTable refreshTrigger={refreshTrigger} sessionId={selectedSessionId} />

        </div>
    );
}

export default Dashboard;