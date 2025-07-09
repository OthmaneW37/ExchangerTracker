import axios from 'axios';

/**
 * Récupère les taux de change depuis le site albarakaxchange.com
 * @returns {Promise<Object>} - Résultat de la requête avec les taux de change
 */
export const scrapeAlbarakaRates = async () => {
  try {
    // Récupération de la page HTML via notre proxy
    const response = await axios.get('/albarakaxchange');
    const html = response.data;
    
    // Initialisation de l'objet qui contiendra les taux
    const rates = {};
    
    // Utilisation d'expressions régulières pour extraire les taux
    // Format attendu: "1 EURO = 10,3500 MAD" et "1 EURO = 10,6500 MAD"
    
    // Recherche des taux d'achat ("Achat / Nous achetons")
    const buyRateRegex = /Achat[\s\/]*Nous achetons[\s\n]*1\s+([A-Za-z]+)\s*=\s*(\d+[,.]\d+)\s*MAD/g;
    let buyMatch;
    while ((buyMatch = buyRateRegex.exec(html)) !== null) {
      const currency = buyMatch[1];
      const rate = parseFloat(buyMatch[2].replace(',', '.'));
      
      // Conversion des codes de devise pour correspondre aux standards
      let currencyCode;
      switch (currency.toUpperCase()) {
        case 'EURO':
          currencyCode = 'EUR';
          break;
        case 'USD':
        case 'DOLLAR':
          currencyCode = 'USD';
          break;
        case 'GBP':
        case 'LIVRE':
        case 'STERLING':
          currencyCode = 'GBP';
          break;
        case 'CHF':
        case 'FRANC':
          currencyCode = 'CHF';
          break;
        case 'CAD':
          currencyCode = 'CAD';
          break;
        case 'JPY':
        case 'YEN':
          currencyCode = 'JPY';
          break;
        case 'SAR':
        case 'RIYAL':
          currencyCode = 'SAR';
          break;
        case 'AED':
        case 'DIRHAM':
          currencyCode = 'AED';
          break;
        default:
          currencyCode = currency;
      }
      
      // Stockage du taux
      if (!rates[currencyCode]) {
        rates[currencyCode] = {
          buy: rate,
          sell: null
        };
      } else {
        rates[currencyCode].buy = rate;
      }
    }
    
    // Recherche des taux de vente ("Vente / Nous vendons")
    const sellRateRegex = /Vente[\s\/]*Nous vendons[\s\n]*1\s+([A-Za-z]+)\s*=\s*(\d+[,.]\d+)\s*MAD/g;
    let sellMatch;
    while ((sellMatch = sellRateRegex.exec(html)) !== null) {
      const currency = sellMatch[1];
      const rate = parseFloat(sellMatch[2].replace(',', '.'));
      
      // Conversion des codes de devise
      let currencyCode;
      switch (currency.toUpperCase()) {
        case 'EURO':
          currencyCode = 'EUR';
          break;
        case 'USD':
        case 'DOLLAR':
          currencyCode = 'USD';
          break;
        case 'GBP':
        case 'LIVRE':
        case 'STERLING':
          currencyCode = 'GBP';
          break;
        case 'CHF':
        case 'FRANC':
          currencyCode = 'CHF';
          break;
        case 'CAD':
          currencyCode = 'CAD';
          break;
        case 'JPY':
        case 'YEN':
          currencyCode = 'JPY';
          break;
        case 'SAR':
        case 'RIYAL':
          currencyCode = 'SAR';
          break;
        case 'AED':
        case 'DIRHAM':
          currencyCode = 'AED';
          break;
        default:
          currencyCode = currency;
      }
      
      // Stockage du taux
      if (!rates[currencyCode]) {
        rates[currencyCode] = {
          buy: null,
          sell: rate
        };
      } else {
        rates[currencyCode].sell = rate;
      }
    }
    
    // Si aucun taux n'a été trouvé avec les regex, essayons une approche plus générique
    if (Object.keys(rates).length === 0) {
      // Recherche des blocs de texte qui pourraient contenir des taux
      const euroMatch = html.match(/Europe[\s\S]*?1\s+EURO\s*=\s*(\d+[,.]\d+)\s*MAD[\s\S]*?1\s+EURO\s*=\s*(\d+[,.]\d+)\s*MAD/);
      const usdMatch = html.match(/Etat Unis[\s\S]*?1\s+USD\s*=\s*(\d+[,.]\d+)\s*MAD[\s\S]*?1\s+USD\s*=\s*(\d+[,.]\d+)\s*MAD/);
      const gbpMatch = html.match(/Royaume Unis[\s\S]*?1\s+GBP\s*=\s*(\d+[,.]\d+)\s*MAD[\s\S]*?1\s+GBP\s*=\s*(\d+[,.]\d+)\s*MAD/);
      
      if (euroMatch) {
        rates['EUR'] = {
          buy: parseFloat(euroMatch[1].replace(',', '.')),
          sell: parseFloat(euroMatch[2].replace(',', '.'))
        };
      }
      
      if (usdMatch) {
        rates['USD'] = {
          buy: parseFloat(usdMatch[1].replace(',', '.')),
          sell: parseFloat(usdMatch[2].replace(',', '.'))
        };
      }
      
      if (gbpMatch) {
        rates['GBP'] = {
          buy: parseFloat(gbpMatch[1].replace(',', '.')),
          sell: parseFloat(gbpMatch[2].replace(',', '.'))
        };
      }
    }
    
    // Conversion au format attendu par l'application
    const formattedRates = {};
    Object.keys(rates).forEach(currency => {
      // On utilise le taux d'achat comme référence (ou de vente si l'achat n'est pas disponible)
      formattedRates[currency] = rates[currency].buy || rates[currency].sell;
    });
    
    // Ajout du MAD (Dirham marocain) comme devise de base avec un taux de 1
    formattedRates['MAD'] = 1;
    
    return {
      success: true,
      data: {
        base: 'MAD',
        rates: formattedRates
      },
      timestamp: new Date().toISOString(),
      rate: formattedRates['USD'] // Taux par défaut pour la compatibilité
    };
  } catch (error) {
    console.error('Erreur lors du scraping d\'albarakaxchange:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};