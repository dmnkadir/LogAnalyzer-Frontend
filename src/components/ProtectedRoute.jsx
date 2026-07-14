import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    // Tarayıcı hafızasında token var mı kontrol et
    const token = localStorage.getItem('token');

    // Eğer token yoksa (giriş yapmamışsa) direkt login sayfasına şutla
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Token varsa gitmek istediği sayfayı (children) göster
    return children;
}

export default ProtectedRoute;