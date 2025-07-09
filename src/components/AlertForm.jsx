import React, { useState } from 'react';
import { useAlerts } from '../contexts/AlertsContext';

const AlertForm = () => {
  const { addAlert } = useAlerts();
  
  // État initial du formulaire
  const [formData, setFormData] = useState({
    base: 'EUR',
    target: 'USD',
    threshold: '',
    mode: 'above',
    frequency: 5, // minutes
  });
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.base || !formData.target || !formData.threshold) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Conversion de la fréquence en millisecondes
    const frequencyMs = parseInt(formData.frequency) * 60 * 1000;
    
    // Ajout de l'alerte
    addAlert({
      ...formData,
      threshold: parseFloat(formData.threshold),
      frequency: frequencyMs,
    });
    
    // Réinitialisation du formulaire
    setFormData({
      base: 'EUR',
      target: 'USD',
      threshold: '',
      mode: 'above',
      frequency: 5,
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ajouter une alerte</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="base">
              Devise de base
            </label>
            <input
              type="text"
              id="base"
              name="base"
              value={formData.base}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="EUR"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="target">
              Devise cible
            </label>
            <input
              type="text"
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="USD"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="threshold">
              Seuil
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              step="0.0001"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="1.05"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mode">
              Mode
            </label>
            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="above">Au-dessus</option>
              <option value="below">En-dessous</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
              Fréquence de vérification (minutes)
            </label>
            <input
              type="number"
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter l'alerte
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlertForm;