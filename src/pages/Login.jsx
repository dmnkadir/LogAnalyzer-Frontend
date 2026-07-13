import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engeller

        try {
            // Backend'e Axios ile POST isteği atıyoruz
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            // Backend şifre yanlışsa "Hata:..." diye bir string dönüyordu hatırlarsan
            if (response.data.startsWith('Hata')) {
                setError(response.data);
            } else {
                // Şifre doğruysa gelen Token'ı tarayıcının hafızasına kaydet!
                localStorage.setItem('token', response.data);
                alert('Giriş Başarılı! Pasaport alındı.');
                navigate('/dashboard'); // Başarılıysa Dashboard'a yönlendir
            }
        } catch (err) {
            setError('Sunucuya ulaşılamadı. Backend açık mı?');
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
            </form>
        </div>
    );
}

export default Login;