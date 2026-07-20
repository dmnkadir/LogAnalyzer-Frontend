import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

            setMessage(response.data.message); // "Harika! Kullanıcı başarıyla kaydedildi."
            // 2 saniye bekle ve login sayfasına yönlendir
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Kayıt başarısız. Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Sisteme Kayıt Ol</h2>

            <form onSubmit={handleRegister} style={{ display: 'inline-block', textAlign: 'left', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', minWidth: '300px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Kullanıcı Adı</label><br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>E-Posta</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Şifre</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                {message && <p style={{ color: 'green', margin: '10px 0', fontWeight: 'bold' }}>{message}</p>}
                {error && <p style={{ color: 'red', margin: '10px 0', fontWeight: 'bold' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Kayıt Ol
                </button>

                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                    Zaten hesabın var mı? <Link to="/login" style={{ color: '#007bff' }}>Giriş Yap</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;