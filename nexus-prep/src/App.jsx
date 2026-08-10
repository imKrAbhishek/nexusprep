// App.jsx — Thin root shell: providers only, no routes here
// All routes live in routes/index.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar            from './components/layout/Navbar';
import AppRoutes         from './routes/index';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="977554169653-1vlfedl5jp0112588brh52u8efurlcje.apps.googleusercontent.com">
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;