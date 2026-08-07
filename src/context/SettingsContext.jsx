import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://fitna-backend-production.up.railway.app/api/v1';

// Default local settings (used before API loads)
const DEFAULT_SETTINGS = {
  stats: { students: 1250, modules: 8, satisfaction: 98 },
  about: "فطنة هي منصة تعليمية تربوية تهدف لتأسيس أطفالنا وتطوير مهاراتهم باللعب والتفاعل.",
  contact: { whatsapp: "+213773650836", email: "info@fitna.dz", address: "الجزائر العاصمة", phone: "+213773650836" },
  fontFamily: "Cairo",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // siteSettings holds the full API response (social links, landing page fields, etc.)
  const [siteSettings, setSiteSettings] = useState(() => {
    const cached = localStorage.getItem('apiSiteSettings');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Fetch the public site settings from the API once on app mount
    axios.get(`${API_BASE}/public-site-settings/`)
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
      localStorage.setItem('siteSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, siteSettings, setSiteSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
