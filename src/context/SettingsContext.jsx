import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      stats: { students: 1200, modules: 9, satisfaction: 98 },
      about: "فطنة هي أكاديمية رائدة تهدف إلى إعداد الجيل القادم وتزويدهم بالمهارات الحياتية الضرورية.",
      contact: { whatsapp: "+213795375422", email: "info@fitna.dz", address: "الجزائر العاصمة" },
      fontFamily: "Tajawal"
    };
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('siteSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
