import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleMapsProvider } from './components/GoogleMapsProvider';

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleMapsProvider>

      <App />
    </GoogleMapsProvider>

  </StrictMode>,
);
