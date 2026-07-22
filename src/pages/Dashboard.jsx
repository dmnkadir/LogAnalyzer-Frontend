import LogTable from '../components/LogTable';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
// Recharts kütüphanesinden grafik bileşenlerini içeri alıyoruz
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [sessionReport, setSessionReport] = useState('');
    const [isReportLoading, setIsReportLoading] = useState(false);


    // Oturum değiştiğinde eski raporu temizle
    useEffect(() => {
        setSessionReport('');
    }, [selectedSessionId]);

    // Bütün oturumu analiz eden fonksiyon
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

    // sessions state'i dolduğunda konsola yazdırmak için eklendi
    useEffect(() => {
        if (sessions && sessions.length > 0) {
            console.log("Dashboard - Güncel oturumlar (state):", sessions);
        }
    }, [sessions]);

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
            setStats(response.data.data);
        } catch (error) {
            console.error("İstatistikler alınamadı", error);
            setStats(null);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await api.get('/logs/sessions');
            console.log("--- DİKKAT: Backend'den Gelen Veri ---");
            console.log(response.data);

            if (response.data && Array.isArray(response.data.data)) {
                setSessions(response.data.data);
            } else {
                console.error("Hata: Backend'den dizi gelmedi!", response.data);
                setSessions([]);
            }
        } catch (error) {
            console.error("Oturumlar alınamadı", error);
            setSessions([]);
        }
    };

    // Grafikler için veriyi Recharts'ın anlayacağı formata çeviriyoruz
    const chartData = stats ? [
        { name: 'INFO', value: stats.infoCount },
        { name: 'WARN', value: stats.warnCount },
        { name: 'ERROR', value: stats.errorCount },
        { name: 'DEBUG', value: stats.debugCount }
    ] : [];

    // Seviyelere göre renk kodları (INFO: Yeşil, WARN: Turuncu, ERROR: Kırmızı)
    const COLORS = ['#28a745', '#fd7e14', '#dc3545', '#0d6efd'];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>

            {/* Üst Kısım: Dosya Yükleme Alanı */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginTop: 0, color: 'var(--text-main)' }}>Yeni Log Dosyası Yükle</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="file" onChange={handleFileChange} style={{ color: 'var(--text-muted)' }} />
                    <button
                        onClick={handleUpload}
                        style={{ padding: '8px 20px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Yükle ve Analiz Et
                    </button>
                </div>
                {message && <p style={{ marginTop: '10px', color: 'var(--color-info)', fontWeight: 'bold' }}>{message}</p>}
            </div>

            {/* Oturum Seçimi Alanı */}
            <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginTop: 0, color: 'var(--text-main)' }}>Analiz Edilecek Oturumu Seçin</h4>
                <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '16px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                >
                    <option value="">-- Bir Oturum Seçin --</option>
                    {sessions && sessions.length > 0 ? (
                        sessions.map((session, index) => (
                            <option key={session.sessionId || index} value={session.sessionId || ''}>
                                {session.sessionId || 'Bilinmeyen ID'} - {session.uploadDate ? new Date(session.uploadDate).toLocaleString() : ''}
                            </option>
                        ))
                    ) : (
                        <option disabled>Henüz oturum yok</option>
                    )}
                </select>
            </div>

            {/* Orta Kısım: Buton ve Sayısal Özet */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => { fetchStats(); fetchSessions(); }}
                    style={{ padding: '10px 20px', backgroundColor: 'var(--btn-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
                    Verileri / Grafikleri Yenile
                </button>

                {stats && (
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Toplam Log</h3>
                            <h1 style={{ margin: '10px 0 0 0', fontSize: '36px', color: 'var(--text-main)' }}>{stats.totalLogs}</h1>
                        </div>
                        <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--color-error)' }}>Kritik Hata (ERROR)</h3>
                            <h1 style={{ margin: '10px 0 0 0', fontSize: '36px', color: 'var(--color-error)' }}>{stats.errorCount}</h1>
                        </div>
                    </div>
                )}
            </div>

            {selectedSessionId && (
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-main)' }}> AI Incident Report (Olay Raporu)</h3>
                        <button
                            onClick={handleAnalyzeSession}
                            disabled={isReportLoading}
                            style={{ padding: '10px 20px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: isReportLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                            {isReportLoading ? 'Analiz Ediliyor...' : 'Tüm Oturumu Yapay Zeka İle Analiz Et'}
                        </button>
                    </div>

                    {sessionReport && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', borderRadius: '4px', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {sessionReport}
                        </div>
                    )}
                </div>
            )}

            {/* Alt Kısım: Grafikler */}
            {stats && stats.totalLogs > 0 && (
                <div style={{ display: 'flex', gap: '30px', height: '300px' }}>
                    {/* Pasta Grafik */}
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                        <h4 style={{ textAlign: 'center', marginTop: 0, color: 'var(--text-main)' }}>Log Dağılımı</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={{ fill: 'var(--text-muted)' }}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                                <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Çubuk Grafik */}
                    <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                        <h4 style={{ textAlign: 'center', marginTop: 0, color: 'var(--text-main)' }}>Seviye Bazlı Karşılaştırma</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                                <Bar dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Koca tablo kodunu tek bir etiketle buraya çağırdık! */}
            <LogTable refreshTrigger={refreshTrigger} sessionId={selectedSessionId} />

        </div>
    );
}

export default Dashboard;