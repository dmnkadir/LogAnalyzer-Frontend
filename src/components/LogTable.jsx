import { useState, useEffect } from 'react';
import api from '../services/api';

function LogTable({ refreshTrigger, sessionId }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // AI Cevaplarını ekranda tutmak için State'lerimiz
    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Arama ve Filtreleme State'leri
    const [keyword, setKeyword] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // İstek atarken keyword ve level parametrelerini URL'ye ekliyoruz
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (levelFilter) params.append('level', levelFilter);

                const response = await api.get(`/logs/session/${sessionId}?${params.toString()}`);
                setLogs(response.data.data);
            } catch (err) {
                console.error("Loglar çekilemedi", err);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            // Arama kutusuna yazı yazarken her harfte backend'i yormamak için yarım saniye (500ms) bekleme süresi (Debounce) ekledik.
            const timeoutId = setTimeout(() => {
                fetchLogs();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setLogs([]);
        }
    }, [refreshTrigger, sessionId, keyword, levelFilter]); // State'ler değiştiğinde useEffect tetiklenecek

    // BUTONA TIKLANINCA ÇALIŞACAK FONKSİYON (Tekli Log İncelemesi) - HİÇ DOKUNULMADI
    const handleAskAI = async (logMessage) => {
        setIsAiLoading(true);
        setAiResponse('');

        try {
            const prompt = `Aşağıdaki tek satırlık log mesajını incele ve açıkla.
Yanıtın TÜRKÇE olmalıdır. (Yazılım terimlerini orijinal İngilizce halleriyle bırakabilirsin, örneğin: initialize, referans, null vs.). Kesinlikle SADECE Latin alfabesi kullan!

Lütfen cevabını aşağıdaki formatı BİREBİR kopyalayarak ver:

**Kök Neden:**
[Kısa ve net Türkçe teknik açıklama]

**Çözüm Önerisi:**
- [Adım 1]
- [Adım 2]

İncelenecek Log: "${logMessage}"`;

            const response = await api.get(`/ai/test?soru=${encodeURIComponent(prompt)}`);
            setAiResponse(response.data.data);
        } catch (err) {
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

    return (
        <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>

            {/* Arama ve Filtreleme Arayüzü */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}> Detaylı Log Listesi</h3>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Mesajlarda ara (Örn: NullPointer)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '250px' }}
                    />

                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Tüm Seviyeler</option>
                        <option value="ERROR">ERROR</option>
                        <option value="WARN">WARN</option>
                        <option value="INFO">INFO</option>
                        <option value="DEBUG">DEBUG</option>
                    </select>
                </div>
            </div>

            {/* YAPAY ZEKA CEVAP KUTUSU - HİÇ DOKUNULMADI */}
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

            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</p>
            ) : (
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
                    {logs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>Sistemde henüz log bulunmuyor veya aramaya uygun sonuç yok.</p>}
                </div>
            )}
        </div>
    );
}

export default LogTable;