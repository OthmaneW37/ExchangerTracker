import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Détermine si un lien est actif
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl">Change Watcher</span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              Accueil
            </Link>
            <Link 
              to="/settings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/settings') ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              Paramètres
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;