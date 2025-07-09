import { useEffect, useRef } from 'react';

// Hook personnalisé pour exécuter une fonction à intervalles réguliers
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Se souvenir de la dernière fonction de callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configurer l'intervalle
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    // Si delay est null, ne pas configurer d'intervalle
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;