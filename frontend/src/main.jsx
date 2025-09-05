import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import { AuthProvider } from "./store/AuthContext.js"
import { StyleProvider } from "./store/StyleContext.js"

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <StyleProvider>
        <App />
      </StyleProvider>
    </AuthProvider>
  </BrowserRouter>
  ,
)
