import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppProvider } from "./context/AppProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);
