import React, { useState, useContext, useRef, useEffect } from 'react';
import api from '../../services/api';
import { AiContext } from '../../context/AiContext';
import EmptyState from '../common/EmptyState';
import Toast from '../common/Toast';
import { Sparkles, Cpu, Code, Brain, Pin, FolderOpen, Edit2 } from 'lucide-react';
import { SiNvidia, SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

const SessionSelector = ({ sessions, selectedSessions, onSessionChange, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    const [isSuggestingName, setIsSuggestingName] = useState(false);
    const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isAllSelected = sessions.length > 0 && selectedSessions.length === sessions.length;

    const showToast = (message, type = 'info') => setToast({ message, type });

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
                { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash", icon: <Sparkles size={14} color="#8A2BE2" /> },
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

    const handleSelectAll = () => {
        if (isAllSelected) onSessionChange([]);
        else onSessionChange(sessions.map(s => s.sessionId));
    };

    const handleToggle = (sessionId) => {
        if (selectedSessions.includes(sessionId)) onSessionChange(selectedSessions.filter(id => id !== sessionId));
        else onSessionChange([...selectedSessions, sessionId]);
    };

    const openEditModal = (session) => {
        setEditingSession(session);
        setNewName(session.sessionName || '');
        setIsAiDropdownOpen(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
        setNewName('');
    };

    const handleSuggestName = async (providerValue) => {
        setIsAiDropdownOpen(false);
        setIsSuggestingName(true);
        setNewName('✨ Yapay zeka düşünüyor...');

        try {
            const response = await api.get(`/ai/suggest-name/session/${editingSession.sessionId}?provider=${providerValue}`);
            setNewName(response.data.data);
            showToast("İsim önerisi başarıyla alındı.", "success");
        } catch (error) {
            setNewName(editingSession.sessionName || '');
            showToast("İsim önerisi alınırken hata oluştu.", "error");
        } finally {
            setIsSuggestingName(false);
        }
    };

    const handleRename = async () => {
        if (!newName.trim()) {
            showToast("Oturum ismi boş olamaz!", "warn");
            return;
        }
        setIsLoading(true);
        try {
            await api.put(`/logs/session/${editingSession.sessionId}/name?newName=${encodeURIComponent(newName)}`);
            onRefresh();
            closeModal();
            showToast("Oturum ismi başarıyla güncellendi!", "success");
        } catch (error) {
            showToast("İsim güncellenirken hata oluştu.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm("⚠️ DİKKAT!\n\nBu işlem geri alınamaz. Bu oturuma ait TÜM log kayıtları veritabanından kalıcı olarak silinecektir. Emin misiniz?");
        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            await api.delete(`/logs/session/${editingSession.sessionId}`);
            if (selectedSessions.includes(editingSession.sessionId)) {
                onSessionChange(selectedSessions.filter(id => id !== editingSession.sessionId));
            }
            onRefresh();
            closeModal();
            showToast("Oturum kalıcı olarak silindi.", "success");
        } catch (error) {
            showToast("Oturum silinirken hata oluştu.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pin size={18} color="var(--btn-primary)" /> Analiz Edilecek Oturumları Seçin
                </h4>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onRefresh}
                    style={{ padding: '8px 15px', backgroundColor: 'var(--btn-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    🔄 Verileri Yenile
                </motion.button>
            </div>

            {sessions && sessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-input)', padding: '15px', borderRadius: '6px', border: '1px solid var(--border-color)', maxHeight: '200px', overflowY: 'auto' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--btn-primary)' }} /> Tüm Oturumları Seç / Kaldır
                    </label>

                    {sessions.map((session) => (
                        <div key={session.sessionId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>
                                <input type="checkbox" checked={selectedSessions.includes(session.sessionId)} onChange={() => handleToggle(session.sessionId)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--btn-primary)' }} />
                                <span style={{ color: 'var(--text-main)', fontWeight: session.sessionName ? 'bold' : 'normal' }}>{session.sessionName || session.sessionId}</span>
                                <span style={{color: 'var(--text-dark)', fontSize: '12px'}}>({session.uploadDate ? new Date(session.uploadDate).toLocaleString() : ''})</span>
                            </label>

                            <motion.button
                                whileHover={{ scale: 1.1, color: 'var(--btn-primary)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditModal(session)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                                title="Oturumu Düzenle / Sil"
                            >
                                <Edit2 size={16} />
                            </motion.button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState icon={<FolderOpen size={48} color="var(--text-muted)" strokeWidth={1.5} />} title="Oturum Bulunamadı" description="Sistemde henüz log oturumu yok." />
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '8px', width: '400px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-main)' }}>Oturumu Düzenle</h3>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Oturum İsmi</label>

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
                            <button onClick={handleDelete} disabled={isLoading || isSuggestingName} style={{ padding: '8px 15px', backgroundColor: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Tamamen Sil</button>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={closeModal} style={{ padding: '8px 15px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>
                                <button onClick={handleRename} disabled={isLoading || isSuggestingName} style={{ padding: '8px 15px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        </div>
    );
};

export default SessionSelector;