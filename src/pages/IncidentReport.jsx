import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ReportCard from '../components/ai/ReportCard';
import Toast from '../components/common/Toast';
import { Sparkles, Cpu, Code, Brain, ClipboardList } from 'lucide-react';
import { SiNvidia, SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

function IncidentReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [newName, setNewName] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [isSuggestingName, setIsSuggestingName] = useState(false);
    const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const showToast = (message, type = 'info') => setToast({ message, type });

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAiDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modelGroups = [
        {
            group: "Standart Modeller",
            items: [
                { value: "gemini-flash-latest", label: "Gemini Flash Latest", icon: <Sparkles size={14} color="#8A2BE2" /> },
                { value: "groq", label: "Groq Llama 3.3", icon: <Cpu size={14} color="#F97316" /> }
            ]
        },
        {
            group: "Nvidia Modelleri",
            items: [
                { value: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron 3 Ultra", icon: <SiNvidia size={14} color="#76B900" /> },
                { value: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron 3 Super", icon: <SiNvidia size={14} color="#76B900" /> }
            ]
        },
        {
            group: "Diğer (OpenRouter)",
            items: [
                { value: "cohere/north-mini-code:free", label: "Cohere North Mini", icon: <Code size={14} color="#3B82F6" /> },
                { value: "google/gemma-4-26b-a4b-it:free", label: "Google Gemma 4", icon: <SiGoogle size={14} color="#4285F4" /> },
                { value: "openai/gpt-oss-20b:free", label: "OpenAI gpt-oss-20b", icon: <Brain size={14} color="#10A37F" /> }
            ]
        }
    ];

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

    const openEditModal = (report) => {
        setEditingReport(report);
        setNewName(report.reportName || '');
        setIsAiDropdownOpen(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReport(null);
        setNewName('');
    };

    const handleSuggestName = async (providerValue) => {
        setIsAiDropdownOpen(false);
        setIsSuggestingName(true);
        setNewName('✨ Yapay zeka düşünüyor...');

        try {
            const reportContent = editingReport.reportContent.length > 3000
                ? editingReport.reportContent.substring(0, 3000)
                : editingReport.reportContent;

            const prompt = `Sen uzman bir yazılım mimarısın. Aşağıdaki olay raporunu (Incident Report) oku ve ana problemi yansıtan en fazla 3-4 kelimelik kısa, teknik bir başlık çıkar. 
ÖNEMLİ KURALLAR:
1. KESİNLİKLE "Sistem Hata Raporu", "Olay Raporu", "Beklenmedik Hata" gibi jenerik/yuvarlak isimler KULLANMA.
2. Raporun içindeki asıl teknik hatayı (Örn: HomeController NullPointer, PostgreSQL Bağlantı Kopması, OutOfMemory vb.) bul ve başlık yap.
3. SADECE BAŞLIĞI YAZ. Tırnak, nokta veya ekstra açıklama kullanma.

Rapor Özeti:
${reportContent}`;

            const response = await api.get(`/ai/test?soru=${encodeURIComponent(prompt)}&provider=${providerValue}`);
            const suggested = response.data.data.replace(/["']/g, "").trim();

            // --- YENİ: UZUNLUK VE HATA KONTROLÜ ---
            if (suggested.length > 60 || suggested.toLowerCase().includes('error') || suggested.toLowerCase().includes('ulaşılamadı')) {
                throw new Error("Geçersiz veya çok uzun AI yanıtı");
            }

            setNewName(suggested);
            showToast("İsim önerisi başarıyla alındı.", "success");
        } catch (error) {
            // Hata alınırsa eski isme (veya boşluğa) geri dön
            setNewName(editingReport.reportName || '');
            showToast("Geçerli bir isim önerisi alınamadı (Bağlantı/API Hatası).", "error");
        } finally {
            setIsSuggestingName(false);
        }
    };

    const handleRename = async () => {
        if (!newName.trim()) {
            showToast("Rapor ismi boş olamaz!", "warn");
            return;
        }
        setIsActionLoading(true);
        try {
            await api.put(`/ai/reports/${editingReport.id}/name?newName=${encodeURIComponent(newName)}`);
            setReports(reports.map(r => r.id === editingReport.id ? { ...r, reportName: newName } : r));
            closeModal();
            showToast("Rapor ismi başarıyla güncellendi!", "success");
        } catch (error) {
            showToast("İsim güncellenirken bir hata oluştu.", "error");
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
            showToast("Rapor kalıcı olarak silindi.", "success");
        } catch (error) {
            showToast("Rapor silinirken bir hata oluştu.", "error");
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
                        <ClipboardList size={32} color="var(--btn-primary)" /> Olay Raporu Geçmişi
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
                        Yapay zeka tarafından geçmiş oturumlar için üretilmiş tüm Incident (Olay) raporları burada kalıcı olarak saklanır.
                    </p>
                </div>

                <div style={{ width: '300px' }}>
                    <input type="text" placeholder="Raporlarda kelime veya isim ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--btn-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <div style={{ marginTop: '15px', fontWeight: '500' }}>Raporlar veritabanından çekiliyor...</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : reports.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    Henüz veritabanına kaydedilmiş bir olay raporu bulunmuyor.
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '8px', width: '400px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-main)' }}>Raporu Düzenle</h3>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Rapor İsmi</label>

                        <div ref={dropdownRef} style={{ position: 'relative', marginBottom: '25px' }}>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                disabled={isSuggestingName}
                                placeholder="İsim girin veya AI önerisi alın..."
                                style={{ width: '100%', padding: '10px 45px 10px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: isSuggestingName ? 'var(--color-warn)' : 'var(--text-main)', fontStyle: isSuggestingName ? 'italic' : 'normal', boxSizing: 'border-box', outline: 'none' }}
                            />
                            <button
                                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                                disabled={isSuggestingName}
                                title="Yapay Zeka ile İsim Üret"
                                style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: isAiDropdownOpen ? 'var(--bg-main)' : 'transparent', border: 'none', color: 'var(--btn-primary)', padding: '6px', borderRadius: '4px', cursor: isSuggestingName ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            >
                                <Sparkles size={18} />
                            </button>

                            <AnimatePresence>
                                {isAiDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                                        style={{
                                            position: 'absolute', top: '-50px', left: 'calc(100% + 15px)', width: '250px',
                                            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                            borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', overflow: 'hidden', zIndex: 1100
                                        }}
                                    >
                                        <div style={{ padding: '10px 15px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>İsim önerisi almak için model seçin:</div>
                                        {modelGroups.map((group, gIdx) => (
                                            <div key={gIdx}>
                                                <div style={{ padding: '6px 15px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-dark)', backgroundColor: 'var(--bg-input)', fontWeight: 'bold' }}>{group.group}</div>
                                                {group.items.map((item) => (
                                                    <div
                                                        key={item.value}
                                                        onClick={() => handleSuggestName(item.value)}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-main)', transition: 'all 0.2s' }}
                                                    >
                                                        {item.icon} {item.label}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={handleDelete} disabled={isActionLoading || isSuggestingName} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Raporu Sil</button>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={closeModal} style={{ padding: '8px 15px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>
                                <button onClick={handleRename} disabled={isActionLoading || isSuggestingName} style={{ padding: '8px 15px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{isActionLoading ? 'Kaydediliyor...' : 'İsmi Kaydet'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        </div>
    );
}

export default IncidentReport;