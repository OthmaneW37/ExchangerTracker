import React, { useEffect, useCallback } from 'react';
import AlertForm from '../components/AlertForm';
import AlertList from '../components/AlertList';
import HistoryTable from '../components/HistoryTable';
import { useAlerts } from '../contexts/AlertsContext';
import useInterval from '../hooks/useInterval';
import { fetchRates, shouldTriggerAlert } from '../api/fetchRates';

const Home = () => {
  const { alerts, apiUrl, addHistoryEntry } = useAlerts();
  
  // Fonction pour afficher une notification
  const showNotification = useCallback((alertData, rate) => {
    if (!('Notification' in window)) {
      window.alert('Ce navigateur ne prend pas en charge les notifications desktop.');
      return;
    }
    
    if (Notification.permission === 'granted') {
      const title = `Alerte ${alertData.base}/${alertData.target}`;
      const body = `Le taux actuel est de ${rate} (seuil: ${alertData.threshold})`;
      
      // Utiliser le Service Worker pour afficher la notification
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/logo192.png',
            vibrate: [200, 100, 200],
            tag: `rate-alert-${alertData.id}`,
            data: { url: window.location.href }
          });
        });
      } else {
        // Fallback si le Service Worker n'est pas disponible
        new Notification(title, { body });
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  // Fonction pour vérifier une alerte
  const checkAlert = useCallback(async (alert) => {
    if (!alert.active) return;
    
    try {
      // Récupération des taux
      const result = await fetchRates(apiUrl, alert.base, alert.target);
      
      if (!result.success) {
        console.error('Erreur lors de la vérification:', result.error);
        return;
      }
      
      const currentRate = result.rate;
      const triggered = shouldTriggerAlert(alert, currentRate);
      
      // Ajout à l'historique
      addHistoryEntry({
        base: alert.base,
        target: alert.target,
        rate: currentRate,
        threshold: alert.threshold,
        mode: alert.mode,
        triggered,
      });
      
      // Si l'alerte est déclenchée, afficher une notification
      if (triggered) {
        showNotification(alert, currentRate);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'alerte:', error);
    }
  }, [apiUrl, addHistoryEntry, showNotification]);
  
  // Vérification périodique des alertes actives
  useInterval(() => {
    const activeAlerts = alerts.filter(alert => alert.active);
    activeAlerts.forEach(checkAlert);
  }, 60000); // Vérification toutes les minutes
  
  // Vérification initiale au chargement de la page
  useEffect(() => {
    const activeAlerts = alerts.filter(alert => alert.active);
    activeAlerts.forEach(checkAlert);
  }, [alerts, checkAlert]);
  
  return (
    <div className="space-y-6">
      <AlertForm />
      <AlertList />
      <HistoryTable />
    </div>
  );
};

export default Home;