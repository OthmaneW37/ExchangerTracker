import React from 'react';
import { useAlerts } from '../contexts/AlertsContext';

const AlertList = () => {
  const { alerts, removeAlert, toggleAlert } = useAlerts();
  
  // Si aucune alerte n'existe
  if (alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Alertes</h2>
        <p className="text-gray-500">Aucune alerte configurée. Utilisez le formulaire ci-dessus pour en ajouter.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Alertes</h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`border rounded-lg p-4 ${alert.active ? 'border-blue-500' : 'border-gray-300 opacity-60'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {alert.base} → {alert.target}
                </h3>
                <p className="text-sm text-gray-600">
                  Seuil: {alert.threshold} ({alert.mode === 'above' ? 'au-dessus' : 'en-dessous'})
                </p>
                <p className="text-sm text-gray-600">
                  Vérification: toutes les {alert.frequency / (60 * 1000)} minutes
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Créée le {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`px-3 py-1 rounded text-sm ${alert.active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  {alert.active ? 'Désactiver' : 'Activer'}
                </button>
                
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList;