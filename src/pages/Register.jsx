import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // TEMA STATE VE HAFIZA YÖNETİMİ
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('appTheme', theme); // Temayı tarayıcıya kaydet
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await api.post('/auth/register', {
                username: username,
                email: email,
                password: password
            });

            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Kayıt başarısız. Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px' }}>

            {/* Tema Değiştirme Butonu */}
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'} /* Üzerine gelince ne işe yaradığını yazar */
                    style={{
                        width: '45px',           /* En */
                        height: '45px',          /* Boy */
                        fontSize: '24px',        /* İkon */
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', /* İkonu tam ortaya hizalar */
                        padding: '0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease' /* Tıklayınca yumuşak bir hissiyat verir */
                    }}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            <h2 style={{ marginBottom: '30px' }}>Sisteme Kayıt Ol</h2>

            <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '350px', padding: '30px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Kullanıcı Adı</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                           style={{ width: '100%', boxSizing: 'border-box', padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>E-Posta</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           style={{ width: '100%', boxSizing: 'border-box', padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Şifre</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           style={{ width: '100%', boxSizing: 'border-box', padding: '10px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                </div>

                {message && <p style={{ color: 'var(--color-info)', margin: '10px 0', fontSize: '14px', fontWeight: 'bold' }}>{message}</p>}
                {error && <p style={{ color: 'var(--color-error)', margin: '10px 0', fontSize: '14px', fontWeight: 'bold' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--btn-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    Kayıt Ol
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Zaten hesabın var mı? <Link to="/login" style={{ color: 'var(--color-info)', textDecoration: 'none', fontWeight: 'bold' }}>Giriş Yap</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;