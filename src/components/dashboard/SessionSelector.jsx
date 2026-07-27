import React, { useState } from 'react';
import api from '../../services/api';

const SessionSelector = ({ sessions, selectedSessions, onSessionChange, onRefresh }) => {
    // Modal (Düzenleme Paneli) Stateleri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isAllSelected = sessions.length > 0 && selectedSessions.length === sessions.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            onSessionChange([]);
        } else {
            onSessionChange(sessions.map(s => s.sessionId));
        }
    };

    const handleToggle = (sessionId) => {
        if (selectedSessions.includes(sessionId)) {
            onSessionChange(selectedSessions.filter(id => id !== sessionId));
        } else {
            onSessionChange([...selectedSessions, sessionId]);
        }
    };

    // Modalı Aç
    const openEditModal = (session) => {
        setEditingSession(session);
        setNewName(session.sessionName || session.sessionId);
        setIsModalOpen(true);
    };

    // Modalı Kapat
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
        setNewName('');
    };

    // 1. İsim Güncelleme İşlemi
    const handleRename = async () => {
        if (!newName.trim()) return;
        setIsLoading(true);
        try {
            await api.put(`/logs/session/${editingSession.sessionId}/name?newName=${encodeURIComponent(newName)}`);
            onRefresh(); // Listeyi yenile
            closeModal();
        } catch (error) {
            alert("İsim güncellenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Silme İşlemi
    const handleDelete = async () => {
        const isConfirmed = window.confirm("⚠️ DİKKAT!\n\nBu işlem geri alınamaz. Bu oturuma ait TÜM log kayıtları veritabanından kalıcı olarak silinecektir. Emin misiniz?");
        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            await api.delete(`/logs/session/${editingSession.sessionId}`);

            // Eğer silinen oturum şu an seçili(tikli) ise, onu seçili listeden çıkar
            if (selectedSessions.includes(editingSession.sessionId)) {
                onSessionChange(selectedSessions.filter(id => id !== editingSession.sessionId));
            }

            onRefresh(); // Listeyi yenile
            closeModal();
        } catch (error) {
            alert("Oturum silinirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📌</span> Analiz Edilecek Oturumları Seçin
                </h4>
                <button
                    onClick={onRefresh}
                    style={{ padding: '8px 15px', backgroundColor: 'var(--btn-success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    🔄 Verileri Yenile
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-input)', padding: '15px', borderRadius: '6px', border: '1px solid var(--border-color)', maxHeight: '200px', overflowY: 'auto' }}>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--btn-primary)' }}
                    />
                    Tüm Oturumları Seç / Kaldır
                </label>

                {sessions && sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session.sessionId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>
                                <input
                                    type="checkbox"
                                    checked={selectedSessions.includes(session.sessionId)}
                                    onChange={() => handleToggle(session.sessionId)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--btn-primary)' }}
                                />
                                <span style={{ color: 'var(--text-main)', fontWeight: session.sessionName ? 'bold' : 'normal' }}>
                                    {session.sessionName || session.sessionId}
                                </span>
                                <span style={{color: 'var(--text-dark)', fontSize: '12px'}}>
                                    ({session.uploadDate ? new Date(session.uploadDate).toLocaleString() : ''})
                                </span>
                            </label>

                            {/* DÜZENLE BUTONU (SENİN İSTEDİĞİN YER) */}
                            <button
                                onClick={() => openEditModal(session)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                title="Oturumu Düzenle / Sil"
                            >
                                ✏️
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>Henüz sistemde oturum yok...</div>
                )}
            </div>

            {/* DÜZENLEME PANELİ (MODAL) */}
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
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-main)' }}>Oturumu Düzenle</h3>

                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Oturum İsmi (Alias)</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Örn: DDoS Saldırısı 14 Mart"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', marginBottom: '25px', boxSizing: 'border-box' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* SİL BUTONU (KIRMIZI) */}
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                style={{ padding: '8px 15px', backgroundColor: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Tamamen Sil
                            </button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={closeModal}
                                    style={{ padding: '8px 15px', backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    İptal
                                </button>
                                <button
                                    onClick={handleRename}
                                    disabled={isLoading}
                                    style={{ padding: '8px 15px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionSelector;