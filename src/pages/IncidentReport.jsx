import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReportCard from '../components/ai/ReportCard';

function IncidentReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal Stateleri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [newName, setNewName] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Yapay Zeka Düşünürken Input'u kitlemek için state
    const [isSuggestingName, setIsSuggestingName] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await api.get('/ai/reports');
            setReports(response.data.data || []);
        } catch (error) {
            console.error("Raporlar çekilemedi", error);
        } finally {
            setLoading(false);
        }
    };

    // --- MODAL İŞLEMLERİ (YAPAY ZEKA VE PROMPT GÜNCELLENDİ) ---

    const openEditModal = async (report) => {
        setEditingReport(report);
        setIsModalOpen(true);

        if (report.reportName) {
            setNewName(report.reportName);
        } else {
            setNewName('✨ Yapay zeka raporu analiz ediyor...');
            setIsSuggestingName(true);
            try {
                // 1. GÜNCELLEME: Raporun tamamına yakınını (3000 karakter) gönderiyoruz
                const reportContent = report.reportContent.length > 3000
                    ? report.reportContent.substring(0, 3000)
                    : report.reportContent;

                // 2. GÜNCELLEME: Jenerik isimleri engelleyen, teknik ve sert Prompt
                const prompt = `Sen uzman bir yazılım mimarısın. Aşağıdaki olay raporunu (Incident Report) oku ve ana problemi yansıtan en fazla 3-4 kelimelik kısa, teknik bir başlık çıkar. 
ÖNEMLİ KURALLAR:
1. KESİNLİKLE "Sistem Hata Raporu", "Olay Raporu", "Beklenmedik Hata" gibi jenerik/yuvarlak isimler KULLANMA.
2. Raporun içindeki asıl teknik hatayı (Örn: HomeController NullPointer, PostgreSQL Bağlantı Kopması, OutOfMemory vb.) bul ve başlık yap.
3. SADECE BAŞLIĞI YAZ. Tırnak, nokta veya ekstra açıklama kullanma.

Rapor Özeti:
${reportContent}`;

                const response = await api.get(`/ai/test?soru=${encodeURIComponent(prompt)}`);
                setNewName(response.data.data.replace(/["']/g, "").trim());
            } catch (error) {
                setNewName('Teknik Hata Raporu');
            } finally {
                setIsSuggestingName(false);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReport(null);
        setNewName('');
    };

    const handleRename = async () => {
        if (!newName.trim()) return;
        setIsActionLoading(true);
        try {
            await api.put(`/ai/reports/${editingReport.id}/name?newName=${encodeURIComponent(newName)}`);
            setReports(reports.map(r => r.id === editingReport.id ? { ...r, reportName: newName } : r));
            closeModal();
        } catch (error) {
            alert("İsim güncellenirken bir hata oluştu.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm("⚠️ DİKKAT!\n\nBu işlem geri alınamaz. Bu yapay zeka raporu veritabanından kalıcı olarak silinecektir. Emin misiniz?");
        if (!isConfirmed) return;

        setIsActionLoading(true);
        try {
            await api.delete(`/ai/reports/${editingReport.id}`);
            setReports(reports.filter(report => report.id !== editingReport.id));
            closeModal();
        } catch (error) {
            alert("Rapor silinirken bir hata oluştu.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredReports = reports.filter(report =>
        report.reportContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.reportName && report.reportName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', position: 'relative' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📋</span> Olay Raporu Geçmişi
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
                        Yapay zeka tarafından geçmiş oturumlar için üretilmiş tüm Incident (Olay) raporları burada kalıcı olarak saklanır.
                    </p>
                </div>

                <div style={{ width: '300px' }}>
                    <input
                        type="text"
                        placeholder="Raporlarda kelime veya isim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 15px', borderRadius: '6px',
                            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-main)', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <div style={{
                        display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--border-color)',
                        borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{ marginTop: '15px', fontWeight: '500' }}>Raporlar veritabanından çekiliyor...</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : reports.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    Henüz veritabanına kaydedilmiş bir olay raporu bulunmuyor.<br/>
                    Dashboard üzerinden bir oturumu seçip analiz ederek ilk raporunuzu oluşturabilirsiniz.
                </div>
            ) : filteredReports.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    "{searchTerm}" aramasına uygun rapor bulunamadı.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredReports.map(report => (
                        <ReportCard key={report.id} report={report} onEdit={openEditModal} />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '8px',
                        width: '400px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-main)' }}>Raporu Düzenle</h3>

                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Rapor İsmi (Yapay Zeka Destekli)</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            disabled={isSuggestingName}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-input)',
                                color: isSuggestingName ? 'var(--color-warn)' : 'var(--text-main)',
                                fontStyle: isSuggestingName ? 'italic' : 'normal',
                                marginBottom: '25px', boxSizing: 'border-box'
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={handleDelete}
                                disabled={isActionLoading || isSuggestingName}
                                style={{ padding: '8px 15px', backgroundColor: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Raporu Sil
                            </button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={closeModal}
                                    style={{ padding: '8px 15px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    İptal
                                </button>
                                <button
                                    onClick={handleRename}
                                    disabled={isActionLoading || isSuggestingName}
                                    style={{ padding: '8px 15px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isActionLoading ? 'Kaydediliyor...' : 'İsmi Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncidentReport;