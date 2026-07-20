import { useState, useEffect } from 'react'; // Kullanılmayan 'React' importu kaldırıldı
import api from '../services/api';

function LogTable({ refreshTrigger, sessionId }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // AI Cevaplarını ekranda tutmak için State'lerimiz
    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        // Fonksiyonu useEffect'in İÇİNE taşıdık.
        // Böylece "tanımlanmadan önce kullanıldı" hatası ve bağımlılık uyarısı çözüldü.
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/logs/session/${sessionId}`);
                setLogs(response.data.data);
            } catch (err) { // Kullanılmayan 'error' değişkeni 'err' yapılıp console'a bağlandı
                console.error("Loglar çekilemedi", err);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchLogs();
        } else {
            setLogs([]);
        }
    }, [refreshTrigger, sessionId]);

    // BUTONA TIKLANINCA ÇALIŞACAK FONKSİYON (Tekli Log İncelemesi)
    const handleAskAI = async (logMessage) => {
        setIsAiLoading(true);
        setAiResponse('');

        try {
            const prompt = `Sen uzman bir yazılım mühendisisin.
GÖREV: Aşağıdaki tek satırlık log mesajını incele ve açıkla.
ÇOK ÖNEMLİ KURAL: Cevabın %100 düzgün TÜRKÇE olmalıdır. Sadece standart Türk alfabesini kullan.

Lütfen cevabını aşağıdaki formatı BİREBİR kopyalayarak ver:

**Kök Neden:**
[Kısa ve net Türkçe teknik açıklama]

**Çözüm Önerisi:**
- [Adım 1]
- [Adım 2]

İncelenecek Log: "${logMessage}"`;

            const response = await api.get(`/ai/test?soru=${encodeURIComponent(prompt)}`);
            setAiResponse(response.data.data);
        } catch (err) { // Kullanılmayan 'error' değişkeni 'err' yapılıp console'a bağlandı
            console.error("Yapay zeka hatası:", err);
            setAiResponse("Yapay zekaya ulaşılamadı. Backend açık mı?");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!sessionId) {
        return (
            <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>Lütfen logları görüntülemek için yukarıdan bir oturum seçin.</p>
            </div>
        );
    }

    if (loading) return <p style={{ marginTop: '40px', textAlign: 'center' }}>Loglar yükleniyor...</p>;

    return (
        <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}> Detaylı Log Listesi</h3>

            {/* YAPAY ZEKA CEVAP KUTUSU */}
            {(isAiLoading || aiResponse) && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#3730a3' }}> Yapay Zeka Analizi</h4>
                    {isAiLoading ? (
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#666' }}>Yapay zeka (Llama 3.3) hatayı inceliyor, lütfen bekleyin...</p>
                    ) : (
                        <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
                    )}
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Tarih</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Seviye</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Mesaj</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Aksiyon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{log.createdAt}</td>
                            <td style={{
                                padding: '10px',
                                fontWeight: 'bold',
                                color: log.logLevel === 'ERROR' ? '#dc3545' : (log.logLevel === 'WARN' ? '#fd7e14' : '#28a745')
                            }}>
                                {log.logLevel}
                            </td>
                            <td style={{ padding: '10px' }}>{log.message}</td>
                            <td style={{ padding: '10px' }}>
                                {/* SADECE ERROR SEVİYESİNDEKİ LOGLAR İÇİN BUTON GÖSTERİYORUZ */}
                                {(log.logLevel === 'ERROR' || (log.message && log.message.includes('ERROR'))) && (
                                    <button
                                        onClick={() => handleAskAI(log.message)}
                                        style={{ padding: '6px 12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        AI Açıkla
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {logs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>Sistemde henüz log bulunmuyor.</p>}
        </div>
    );
}

export default LogTable;