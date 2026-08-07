import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      stats: { students: 1250, modules: 8, satisfaction: 98 },
      about: "فطنة هي منصة تعليمية تربوية تهدف لتأسيس أطفالنا وتطوير مهاراتهم باللعب والتفاعل.",
      contact: { whatsapp: "+213773650836", email: "info@fitna.dz", address: "الجزائر العاصمة", phone: "+213773650836" },
      fontFamily: "Cairo"
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
