import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Kendi yaptığımız Dashboard'u içeri aldık

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Site açıldığında direkt login'e yönlendir */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Giriş Sayfası */}
                <Route path="/login" element={<Login />} />

                {/* İŞTE GERÇEK DASHBOARD SAYFAMIZ */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;