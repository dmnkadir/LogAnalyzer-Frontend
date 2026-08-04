import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {

    // Mesaj geldiğinde 3 saniye sonra otomatik kapanmasını sağlar
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const getToastConfig = () => {
        switch (type) {
            case 'success': return { bg: 'var(--btn-success)', icon: <CheckCircle size={20} /> };
            case 'error': return { bg: 'var(--color-error)', icon: <XCircle size={20} /> };
            case 'warn': return { bg: 'var(--color-warn)', icon: <AlertTriangle size={20} /> };
            default: return { bg: 'var(--btn-primary)', icon: <Info size={20} /> };
        }
    };

    const config = getToastConfig();

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    style={{
                        position: 'fixed', bottom: '30px', right: '30px',
                        backgroundColor: config.bg, color: 'white',
                        padding: '12px 20px', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        zIndex: 9999, fontWeight: 'bold', fontSize: '14px'
                    }}
                >
                    {config.icon}
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;