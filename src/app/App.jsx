import React, { useState, useEffect } from 'react';
import Home from '../features/home/Home';
import AdminPage from '../features/admin/AdminPage';

const App = () => {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app">
      {route === '/admin' ? <AdminPage /> : <Home />}
    </div>
  );
};

export default App;
