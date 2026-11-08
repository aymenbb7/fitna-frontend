import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const SettingsContext = createContext();

// Default local settings (used before API loads)
const DEFAULT_SETTINGS = {
  stats: { students: 1250, modules: 8, satisfaction: 98 },
  about: "فطنة هي منصة تعليمية تربوية تهدف لتأسيس أطفالنا وتطوير مهاراتهم باللعب والتفاعل.",
  contact: { whatsapp: "+213773650836", email: "info@fitna.dz", address: "الجزائر العاصمة", phone: "+213773650836" },
  fontFamily: "Cairo",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('siteSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // siteSettings holds the full API response (social links, landing page fields, etc.)
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('apiSiteSettings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Fetch the public site settings from the API once on app mount
    api.get('/public-site-settings/')
      .then(res => {
        setSiteSettings(res.data);
        // Cache for next load
        try {
          localStorage.setItem('apiSiteSettings', JSON.stringify(res.data));
        } catch {}
      })
      .catch(() => {
        // Silently fall back to cached or null — components handle null gracefully
      });
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('siteSettings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, siteSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
