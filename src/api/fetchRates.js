import axios from 'axios';
import { scrapeAlbarakaRates } from './albarakaScraper';

/**
 * Récupère les taux de change depuis l'API spécifiée
 * @param {string} apiUrl - URL de base de l'API
 * @param {string} base - Devise de base
 * @param {string} target - Devise cible
 * @returns {Promise<Object>} - Résultat de la requête
 */
export const fetchRates = async (apiUrl, base, target) => {
  try {
    // Vérifier si l'URL est celle d'albarakaxchange.com
    if (apiUrl.includes('albarakaxchange.com') || apiUrl.includes('/albarakaxchange')) {
      // Utiliser le scraper pour albarakaxchange.com
      const result = await scrapeAlbarakaRates();
      
      if (!result.success) {
        return result;
      }
      
      // Conversion des taux pour correspondre à la devise de base demandée
      if (base !== result.data.base) {
        // Si la base demandée n'est pas MAD, on doit convertir les taux
        const baseRate = result.data.rates[base];
        
        if (!baseRate) {
          return {
            success: false,
            error: `La devise de base ${base} n'est pas disponible`,
            timestamp: new Date().toISOString()
          };
        }
        
        // Conversion des taux
        const convertedRates = {};
        Object.keys(result.data.rates).forEach(currency => {
          convertedRates[currency] = result.data.rates[currency] / baseRate;
        });
        
        // Mise à jour des données
        result.data.base = base;
        result.data.rates = convertedRates;
      }
      
      // Récupération du taux pour la devise cible
      if (target) {
        result.rate = result.data.rates[target] || null;
      }
      
      return result;
    }
    
    // Pour les autres APIs, utiliser la méthode standard
    // Construction de l'URL avec les paramètres
    const url = new URL(apiUrl);
    
    // Ajout des paramètres à l'URL
    if (!url.searchParams.has('base')) {
      url.searchParams.append('base', base);
    }
    
    if (!url.searchParams.has('symbols') && target) {
      url.searchParams.append('symbols', target);
    }
    
    // Exécution de la requête
    const response = await axios.get(url.toString());
    
    return {
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
      rate: target ? response.data.rates[target] : null
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des taux:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Vérifie si une alerte doit être déclenchée
 * @param {Object} alert - L'alerte à vérifier
 * @param {number} currentRate - Le taux actuel
 * @returns {boolean} - True si l'alerte doit être déclenchée
 */
export const shouldTriggerAlert = (alert, currentRate) => {
  if (!alert || !alert.active || currentRate === null) return false;
  
  const threshold = parseFloat(alert.threshold);
  
  if (alert.mode === 'above') {
    return currentRate > threshold;
  } else if (alert.mode === 'below') {
    return currentRate < threshold;
  }
  
  return false;
};