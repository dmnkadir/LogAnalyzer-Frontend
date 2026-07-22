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
            // Sarı uyarıyı çözen kısım: .catch() ekledik
            const timeoutId = setTimeout(() => {
                fetchLogs().catch(err => console.error(err));
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            // Kırmızı hatayı çözen kısım: Senkron state güncellemesini asenkron kuyruğa (microtask) attık
            Promise.resolve().then(() => setLogs([]));
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
            <div style={{ marginTop: '40px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Lütfen logları görüntülemek için yukarıdan bir oturum seçin.</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '40px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>

            {/* Arama ve Filtreleme Arayüzü */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}> Detaylı Log Listesi</h3>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Mesajlarda ara (Örn: NullPointer)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '250px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                    />

                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                    >
                        <option value="">Tüm Seviyeler</option>
                        <option value="ERROR">ERROR</option>
                        <option value="WARN">WARN</option>
                        <option value="INFO">INFO</option>
                        <option value="DEBUG">DEBUG</option>
                    </select>
                </div>
            </div>

            {/* YAPAY ZEKA CEVAP KUTUSU */}
            {(isAiLoading || aiResponse) && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}> Yapay Zeka Analizi</h4>
                    {isAiLoading ? (
                        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)' }}>Yapay zeka hatayı inceliyor, lütfen bekleyin...</p>
                    ) : (
                        <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{aiResponse}</p>
                    )}
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Yükleniyor...</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)' }}>
                        <thead>
                        <tr style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Tarih</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Seviye</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Mesaj</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Aksiyon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '10px' }}>{log.createdAt}</td>
                                <td style={{
                                    padding: '10px',
                                    fontWeight: 'bold',
                                    color: log.logLevel === 'ERROR' ? 'var(--color-error)' : (log.logLevel === 'WARN' ? 'var(--color-warn)' : 'var(--color-info)')
                                }}>
                                    {log.logLevel}
                                </td>
                                <td style={{ padding: '10px' }}>{log.message}</td>
                                <td style={{ padding: '10px' }}>
                                    {/* SADECE ERROR SEVİYESİNDEKİ LOGLAR İÇİN BUTON GÖSTERİYORUZ */}
                                    {(log.logLevel === 'ERROR' || (log.message && log.message.includes('ERROR'))) && (
                                        <button
                                            onClick={() => handleAskAI(log.message)}
                                            style={{ padding: '6px 12px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            AI Açıkla
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>Sistemde henüz log bulunmuyor veya aramaya uygun sonuç yok.</p>}
                </div>
            )}
        </div>
    );
}

export default LogTable;