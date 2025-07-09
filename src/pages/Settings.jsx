import React, { useState } from 'react';
import { useAlerts } from '../contexts/AlertsContext';
import { fetchRates } from '../api/fetchRates';

// Liste des APIs prédéfinies
const PREDEFINED_APIS = [
  { name: 'ExchangeRate-API', url: 'https://api.exchangerate-api.com/v4/latest' },
  { name: 'Frankfurter', url: 'https://api.frankfurter.app/latest' },
  { name: 'Open Exchange Rates', url: 'https://openexchangerates.org/api/latest.json' },
  { name: 'Albaraka Xchange (Scraper)', url: '/albarakaxchange' }
];

const Settings = () => {
  const { apiUrl, setApiUrl } = useAlerts();
  const [newApiUrl, setNewApiUrl] = useState(apiUrl);
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApi, setSelectedApi] = useState(() => {
    // Trouver l'API prédéfinie correspondant à l'URL actuelle
    const found = PREDEFINED_APIS.find(api => api.url === apiUrl);
    return found ? found.name : 'custom';
  });
  
  // Gestion du changement d'URL
  const handleChange = (e) => {
    setNewApiUrl(e.target.value);
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiUrl(newApiUrl);
    alert('URL de l\'API mise à jour avec succès!');
  };
  
  const handleApiSelection = (e) => {
    const selected = e.target.value;
    setSelectedApi(selected);
    
    if (selected !== 'custom') {
      const api = PREDEFINED_APIS.find(api => api.name === selected);
      if (api) {
        setApiUrl(api.url);
      }
    }
  };
  
  // Test de l'API
  const testApi = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await fetchRates(newApiUrl, 'EUR', 'USD');
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demande de permission pour les notifications
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Ce navigateur ne prend pas en charge les notifications desktop.');
      return;
    }
    
    const permission = await Notification.requestPermission();
    alert(`Permission de notification: ${permission}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Paramètres de l'API</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apiSelection">
              Sélectionner une API
            </label>
            <select
              id="apiSelection"
              value={selectedApi}
              onChange={handleApiSelection}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {PREDEFINED_APIS.map(api => (
                <option key={api.name} value={api.name}>{api.name}</option>
              ))}
              <option value="custom">Personnalisée</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apiUrl">
              URL de l'API de taux de change
            </label>
            <input
              type="url"
              id="apiUrl"
              value={newApiUrl}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="https://api.exchangerate.host/latest"
              required
            />
            {selectedApi === 'Albaraka Xchange (Scraper)' && (
              <p className="mt-1 text-sm text-gray-500">
                Cette option utilise un scraper pour extraire les taux depuis le site web d'Albaraka Xchange.
                Aucune clé API n'est nécessaire.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              L'API doit retourner les taux dans le format {`{ rates: { USD: 1.05, ... } }`}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enregistrer
            </button>
            
            <button
              type="button"
              onClick={testApi}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? 'Test en cours...' : 'Tester l\'API'}
            </button>
          </div>
        </form>
        
        {testResult && (
          <div className={`mt-4 p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className="font-medium">
              {testResult.success ? 'Test réussi!' : 'Échec du test'}
            </h3>
            {testResult.success ? (
              <div className="mt-2">
                <p>Taux EUR/USD: {testResult.rate}</p>
                <p className="text-xs text-gray-600">Timestamp: {testResult.timestamp}</p>
              </div>
            ) : (
              <p className="text-red-700">{testResult.error}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Paramètres des notifications</h2>
        
        <p className="mb-4">
          Pour recevoir des notifications, vous devez autoriser les notifications pour ce site.
        </p>
        
        <button
          onClick={requestNotificationPermission}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Autoriser les notifications
        </button>
      </div>
    </div>
  );
};

export default Settings;