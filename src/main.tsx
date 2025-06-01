
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Please check your index.html file.");
}

// Create and render the React app
const root = createRoot(rootElement);

try {
  root.render(<App />);
  console.log("✅ iSpeech app loaded successfully");
} catch (error) {
  console.error("❌ Failed to render app:", error);
  
  // Fallback error display
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="margin-bottom: 20px; color: #8b5cf6;">⚠️ App Loading Error</h1>
      <p style="margin-bottom: 10px;">There was an error loading the iSpeech application.</p>
      <p style="color: #94a3b8; font-size: 14px;">Please refresh the page or check the console for more details.</p>
      <button 
        onclick="window.location.reload()" 
        style="
          margin-top: 20px;
          padding: 12px 24px;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
        "
      >
        Refresh Page
      </button>
    </div>
  `;
}
