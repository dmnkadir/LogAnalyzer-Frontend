import React, { createContext, useState, useEffect } from 'react';

export const AiContext = createContext();

export const AiProvider = ({ children }) => {
    // Sayfa yenilendiğinde LocalStorage'dan son seçili modeli alır, yoksa gemini-auto yapar.
    const [aiProvider, setAiProvider] = useState(() => {
        return localStorage.getItem('aiProvider') || 'gemini-auto';
    });

    // Seçim her değiştiğinde bunu LocalStorage'a kaydederiz.
    useEffect(() => {
        localStorage.setItem('aiProvider', aiProvider);
    }, [aiProvider]);

    return (
        <AiContext.Provider value={{ aiProvider, setAiProvider }}>
            {children}
        </AiContext.Provider>
    );
};