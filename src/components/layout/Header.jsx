import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiContext } from '../../context/AiContext';
import { Sun, Moon, Bot, LogOut, ChevronDown, Sparkles, Cpu, Code, Brain } from 'lucide-react';
import { SiNvidia, SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const { aiProvider, setAiProvider } = useContext(AiContext);

    // Custom Dropdown State'leri
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Dışarı tıklayınca dropdown'u kapatma mantığı
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // YENİ: Seçili AI modeline göre dinamik ikon getiren yardımcı fonksiyon
    const getProviderIcon = (provider, size = 14) => {
        if (!provider) return <Bot size={size} color="var(--btn-primary)" />;
        if (provider.includes('gemini')) return <Sparkles size={size} color="#8A2BE2" />;
        if (provider.includes('groq')) return <Cpu size={size} color="#F97316" />;
        if (provider.includes('nvidia')) return <SiNvidia size={size} color="#76B900" />;
        if (provider.includes('cohere')) return <Code size={size} color="#3B82F6" />;
        if (provider.includes('google')) return <SiGoogle size={size} color="#4285F4" />;
        if (provider.includes('openai')) return <Brain size={size} color="#10A37F" />;
        return <Bot size={size} color="var(--btn-primary)" />; // Varsayılan
    };

    // Modeller ve onlara özel İkonlar (Liste içi kullanım)
    const modelOptions = [
        {
            group: "Standart Modeller",
            items: [
                { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash", icon: <Sparkles size={14} color="#8A2BE2" /> },
                { value: "groq", label: "Groq Llama 3.3", icon: <Cpu size={14} color="#F97316" /> }
            ]
        },
        {
            group: "Nvidia (OpenRouter)",
            items: [
                { value: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron 3 Ultra", icon: <SiNvidia size={14} color="#76B900" /> },
                { value: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron 3 Super", icon: <SiNvidia size={14} color="#76B900" /> }
            ]
        },
        {
            group: "Diğerleri (OpenRouter)",
            items: [
                { value: "cohere/north-mini-code:free", label: "Cohere North Mini Code", icon: <Code size={14} color="#3B82F6" /> },
                { value: "google/gemma-4-26b-a4b-it:free", label: "Google Gemma 4 26B A4B", icon: <SiGoogle size={14} color="#4285F4" /> },
                { value: "openai/gpt-oss-20b:free", label: "OpenAI gpt-oss-20b", icon: <Brain size={14} color="#10A37F" /> }
            ]
        }
    ];

    // Seçili modeli bul (Ekranda ismini göstermek için)
    const selectedModel = modelOptions.flatMap(g => g.items).find(i => i.value === aiProvider);
    const selectedLabel = selectedModel ? selectedModel.label : "Model Seçin";

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            position: 'relative', zIndex: 100
        }}>
            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px', fontWeight: 'bold' }}>
                Log Analyzer Panel
            </h2>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

                {/* CUSTOM AI MODEL SEÇİCİ (Kendi Yazdığımız) */}
                <div ref={dropdownRef} style={{ position: 'relative', height: '42px' }}>

                    {/* Seçici Buton */}
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-input)',
                            padding: '0 15px', borderRadius: '6px', border: '1px solid var(--border-color)',
                            height: '100%', boxSizing: 'border-box', cursor: 'pointer',
                            color: 'var(--text-main)', fontWeight: 'bold', fontSize: '14px',
                            minWidth: '240px', justifyContent: 'space-between',
                            userSelect: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* YENİ: İkon dinamik olarak değişecek (Boyut 18px yapıldı ki Header'da tok dursun) */}
                            {getProviderIcon(aiProvider, 18)}
                            <span>{selectedLabel}</span>
                        </div>
                        <ChevronDown
                            size={16}
                            style={{
                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                    </div>

                    {/* Açılır Menü (Dropdown) */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                                    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                    borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    overflow: 'hidden', zIndex: 150
                                }}
                            >
                                {modelOptions.map((group, gIdx) => (
                                    <div key={gIdx}>
                                        <div style={{
                                            padding: '8px 15px', fontSize: '11px', textTransform: 'uppercase',
                                            color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)',
                                            fontWeight: 'bold', letterSpacing: '0.5px'
                                        }}>
                                            {group.group}
                                        </div>
                                        {group.items.map((item) => (
                                            <div
                                                key={item.value}
                                                onClick={() => {
                                                    setAiProvider(item.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '12px 15px', cursor: 'pointer', fontSize: '13px',
                                                    color: aiProvider === item.value ? 'var(--btn-primary)' : 'var(--text-main)',
                                                    transition: 'all 0.2s', fontWeight: aiProvider === item.value ? 'bold' : 'normal'
                                                }}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* TEMA DEĞİŞTİRİCİ */}
                <motion.button
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ opacity: 0.6 }}
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
                    style={{
                        width: '42px', height: '42px',
                        backgroundColor: 'var(--bg-input)', color: 'var(--text-main)',
                        border: '1px solid var(--border-color)', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', boxSizing: 'border-box'
                    }}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                {/* ÇIKIŞ YAP BUTONU */}
                <motion.button
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ opacity: 0.6 }}
                    onClick={handleLogout}
                    style={{
                        height: '42px', padding: '0 20px',
                        backgroundColor: 'var(--btn-danger)', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box'
                    }}>
                    <LogOut size={16} />
                    Çıkış Yap
                </motion.button>
            </div>
        </header>
    );
}

export default Header;