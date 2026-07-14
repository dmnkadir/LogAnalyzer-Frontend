import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Güvenlik duvarımız

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Site açıldığında direkt login'e yönlendir */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Herkese Açık Sayfalar */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Sadece Giriş Yapanlara Açık Sayfalar */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;