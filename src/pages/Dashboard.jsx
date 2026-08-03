import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import LogTable from '../components/LogTable';
import StatsCard from '../components/dashboard/StatsCard';
import LogDistributionChart from '../components/dashboard/LogDistributionChart';
import SessionSelector from '../components/dashboard/SessionSelector';
import ExceptionSummary from '../components/dashboard/ExceptionSummary';
import AiAnalysisPanel from '../components/ai/AiAnalysisPanel';
import RiskBadge from '../components/ai/RiskBadge';
import FileUploader from '../components/logs/FileUploader';
import { AiContext } from '../context/AiContext';

function Dashboard() {
    const { aiProvider } = useContext(AiContext);
    const [stats, setStats] = useState({
        totalLogs: 0, errorCount: 0, warnCount: 0, infoCount: 0, debugCount: 0,
        mostFrequentException: null, mostErrorProneClass: null, firstErrorTime: null, lastErrorTime: null
    });

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sessions, setSessions] = useState([]);

    const [selectedSessions, setSelectedSessions] = useState([]);

    const [sessionReport, setSessionReport] = useState('');
    const [isReportLoading, setIsReportLoading] = useState(false);

    useEffect(() => {
        setSessionReport('');
        fetchStats(selectedSessions);
    }, [selectedSessions]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleAnalyzeSession = async () => {
        if (selectedSessions.length === 0) return;
        setIsReportLoading(true);
        setSessionReport('');
        try {
            // YENİ: URL'nin sonuna seçilen provider'ı gönderiyoruz
            const response = await api.get(`/ai/analyze-session/${selectedSessions.join(',')}?provider=${aiProvider}`);
            setSessionReport(response.data.data);
        } catch (error) {
            setSessionReport("Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsReportLoading(false);
        }
    };

    const fetchStats = async (sessionsToFetch = selectedSessions) => {
        try {
            if (sessionsToFetch.length === 0) {
                setStats({
                    totalLogs: 0, errorCount: 0, warnCount: 0, infoCount: 0, debugCount: 0,
                    mostFrequentException: null, mostErrorProneClass: null, firstErrorTime: null, lastErrorTime: null
                });
                return;
            }

            const params = new URLSearchParams();
            sessionsToFetch.forEach(id => params.append('sessionIds', id));

            const response = await api.get(`/logs/stats?${params.toString()}`);
            if (response.data && response.data.data) {
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
            console.error("İstatistikler alınamadı! Backend hatası:", error);
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

            {/* SÜRÜKLE BIRAK BİLEŞENİ */}
            <FileUploader
                onUploadSuccess={() => {
                    fetchSessions();
                    setRefreshTrigger(prev => prev + 1);
                }}
            />

            <SessionSelector
                sessions={sessions}
                selectedSessions={selectedSessions}
                onSessionChange={setSelectedSessions}
                onRefresh={() => { fetchSessions(); fetchStats(selectedSessions); }}
            />

            {selectedSessions.length > 0 && <RiskBadge stats={stats} />}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                <StatsCard title="Toplam Log" value={stats.totalLogs} icon={<span>📊</span>} colorVar="--btn-primary" delay={0.1} />
                <StatsCard title="Kritik (ERROR)" value={stats.errorCount} icon={<span>🔴</span>} colorVar="--color-error" delay={0.2} />
                <StatsCard title="Uyarı (WARN)" value={stats.warnCount} icon={<span>🟠</span>} colorVar="--color-warn" delay={0.3} />
                <StatsCard title="Bilgi (INFO)" value={stats.infoCount} icon={<span>🟢</span>} colorVar="--color-info" delay={0.4} />
                <StatsCard title="Ayıklama (DEBUG)" value={stats.debugCount} icon={<span>🔵</span>} colorVar="--btn-primary" delay={0.5} />
            </div>

            <ExceptionSummary stats={stats} />

            <AiAnalysisPanel
                reportText={sessionReport}
                isLoading={isReportLoading}
                onAnalyze={handleAnalyzeSession}
                disabled={selectedSessions.length === 0}
            />

            <LogDistributionChart stats={stats} />

            <LogTable refreshTrigger={refreshTrigger} selectedSessions={selectedSessions} />

        </div>
    );
}

export default Dashboard;