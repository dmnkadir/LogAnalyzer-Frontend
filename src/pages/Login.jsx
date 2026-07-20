import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            // Token direkt string gelmiyor, JSON objesinin içinde 'token' anahtarıyla geliyor.
            localStorage.setItem('token', response.data.data.token);
            alert('Giriş Başarılı! Pasaport alındı.');
            navigate('/dashboard');

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Sunucuya ulaşılamadı. Backend açık mı?');
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Log Analyzer Sistemi</h2>

            <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Kullanıcı Adı</label><br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Şifre</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Hata varsa kırmızı renkte yazdır */}
                {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '8px' }}>Giriş Yap</button>

                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                    Hesabın yok mu? <Link to="/register" style={{ color: '#007bff' }}>Kayıt Ol</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;