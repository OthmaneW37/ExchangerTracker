import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useEffect } from 'react';

function App() {
  // Demande de permission pour les notifications
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Permission de notification:', permission);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
