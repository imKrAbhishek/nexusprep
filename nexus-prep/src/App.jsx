// App.jsx — Thin root shell: providers only, no routes here
// All routes live in routes/index.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import Navbar            from './components/layout/Navbar';
import AppRoutes         from './routes/index';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
