import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateEnvVariables } from '@/config/validate-env'

// Validate environment variables on startup
try {
  validateEnvVariables();
} catch (error) {
  console.error('Application startup error:', error);
  // Render error UI instead of normal app
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
        <h1 style="color: #e11d48;">Configuration Error</h1>
        <p>${error.message}</p>
        <p>Please check your environment configuration and reload the page.</p>
      </div>
    `;
  }
  // Prevent normal app rendering
  throw error;
}

createRoot(document.getElementById("root")!).render(<App />);
