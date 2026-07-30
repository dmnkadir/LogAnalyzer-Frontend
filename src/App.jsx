import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DummyLogGenerator from './pages/DummyLogGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import IncidentReport from './pages/IncidentReport';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* DASHBOARD MAIN LAYOUT'UN İÇİNDE! */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Log Generator Kısmı */}
                <Route
                    path="/dummy-generator"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DummyLogGenerator />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Rapor Geçmişi Sayfası */}
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <IncidentReport />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;