import LogTable from '../components/LogTable';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
// Recharts kütüphanesinden grafik bileşenlerini içeri alıyoruz
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');

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
            setMessage(response.data);
            fetchStats(); // Dosya yüklendikten sonra grafikleri otomatik güncelle
            fetchSessions(); // Oturum listesini de güncelle
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            setMessage("Hata: " + (error.response?.data || "Dosya yüklenemedi"));
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/logs/stats');
            setStats(response.data);
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

            if (Array.isArray(response.data)) {
                setSessions(response.data);
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
        { name: 'ERROR', value: stats.errorCount }
    ] : [];

    // Seviyelere göre renk kodları (INFO: Yeşil, WARN: Turuncu, ERROR: Kırmızı)
    const COLORS = ['#28a745', '#fd7e14', '#dc3545'];

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📊 Log Analyzer Paneli</h2>

            {/* Üst Kısım: Dosya Yükleme Alanı */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <h4 style={{ marginTop: 0 }}>Yeni Log Dosyası Yükle</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="file" onChange={handleFileChange} />
                    <button
                        onClick={handleUpload}
                        style={{ padding: '8px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Yükle ve Analiz Et
                    </button>
                </div>
                {message && <p style={{ marginTop: '10px', color: '#0056b3', fontWeight: 'bold' }}>{message}</p>}
            </div>

            {/* Oturum Seçimi Alanı */}
            <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <h4 style={{ marginTop: 0 }}>Analiz Edilecek Oturumu Seçin</h4>
                <select 
                    value={selectedSessionId} 
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
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
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
                    Verileri / Grafikleri Yenile
                </button>

                {stats && (
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: 0, color: '#6c757d' }}>Toplam Log</h3>
                            <h1 style={{ margin: '10px 0 0 0', fontSize: '36px' }}>{stats.totalLogs}</h1>
                        </div>
                        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: 0, color: '#dc3545' }}>Kritik Hata (ERROR)</h3>
                            <h1 style={{ margin: '10px 0 0 0', fontSize: '36px', color: '#dc3545' }}>{stats.errorCount}</h1>
                        </div>
                    </div>
                )}
            </div>

            {/* Alt Kısım: Grafikler */}
            {stats && stats.totalLogs > 0 && (
                <div style={{ display: 'flex', gap: '30px', height: '300px' }}>
                    {/* Pasta Grafik */}
                    <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                        <h4 style={{ textAlign: 'center', marginTop: 0 }}>Log Dağılımı</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Çubuk Grafik */}
                    <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                        <h4 style={{ textAlign: 'center', marginTop: 0 }}>Seviye Bazlı Karşılaştırma</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
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