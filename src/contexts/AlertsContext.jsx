import React, { createContext, useState, useContext, useEffect } from 'react';

// Création du contexte
const AlertsContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAlerts = () => useContext(AlertsContext);

export const AlertsProvider = ({ children }) => {
  // État pour l'URL de l'API
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('apiUrl') || 'https://api.exchangerate.host/latest'
  );

  // État pour les alertes
  const [alerts, setAlerts] = useState(() => {
    const savedAlerts = localStorage.getItem('alerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });

  // État pour l'historique des vérifications
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Sauvegarde de l'URL de l'API dans localStorage
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
  }, [apiUrl]);

  // Sauvegarde des alertes dans localStorage
  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Sauvegarde de l'historique dans localStorage
  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  // Fonction pour ajouter une alerte
  const addAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAlerts([...alerts, newAlert]);
  };

  // Fonction pour supprimer une alerte
  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Fonction pour activer/désactiver une alerte
  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  // Fonction pour ajouter une entrée à l'historique
  const addHistoryEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setHistory([newEntry, ...history].slice(0, 100)); // Limiter à 100 entrées
  };

  // Valeur du contexte
  const value = {
    apiUrl,
    setApiUrl,
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    history,
    addHistoryEntry,
  };

  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  );
};