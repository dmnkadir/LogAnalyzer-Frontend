import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiContext } from '../../context/AiContext';

function Header({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const { aiProvider, setAiProvider } = useContext(AiContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '20px' }}>Log Analyzer Panel</h2>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

                {/* GLOBAL AI MODEL SEÇİCİ */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-input)',
                    padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)'
                }}>
                    <span style={{ fontSize: '16px' }}>🤖</span>
                    <select
                        value={aiProvider}
                        onChange={(e) => setAiProvider(e.target.value)}
                        style={{
                            backgroundColor: 'transparent', color: 'var(--text-main)', border: 'none',
                            outline: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
                        }}
                    >
                        {/* GEMINI & GROQ */}
                        <option value="gemini-3.6-flash" style={{backgroundColor: 'var(--bg-card)'}}>✨ Gemini 3.6 Flash</option>
                        <option value="groq" style={{backgroundColor: 'var(--bg-card)'}}>Groq Llama 3.3</option>

                        {/* OPENROUTER FREE MODELLERİ (Nvidia ID'leri ekran görüntülerinden birebir işlendi) */}
                        <option value="nvidia/nemotron-3-ultra-550b-a55b:free" style={{backgroundColor: 'var(--bg-card)'}}>🟢 Nvidia Nemotron 3 Ultra</option>
                        <option value="nvidia/nemotron-3-super-120b-a12b:free" style={{backgroundColor: 'var(--bg-card)'}}>🟢 Nvidia Nemotron 3 Super</option>
                        <option value="cohere/north-mini-code:free" style={{backgroundColor: 'var(--bg-card)'}}>🔵 Cohere North Mini Code</option>
                        <option value="google/gemma-4-26b-a4b-it:free" style={{backgroundColor: 'var(--bg-card)'}}>🟣 Google Gemma 4 26B A4B</option>
                        <option value="openai/gpt-oss-20b:free" style={{backgroundColor: 'var(--bg-card)'}}>🟠 OpenAI gpt-oss-20b</option>
                    </select>
                </div>

                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
                    style={{
                        width: '45px', height: '45px', fontSize: '24px',
                        backgroundColor: 'var(--bg-input)', color: 'var(--text-main)',
                        border: '1px solid var(--border-color)', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
                    }}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <button
                    onClick={handleLogout}
                    style={{ padding: '10px 20px', backgroundColor: 'var(--btn-danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Çıkış Yap
                </button>
            </div>
        </header>
    );
}

export default Header;