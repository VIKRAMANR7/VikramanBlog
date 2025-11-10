import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../context/AppContext";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);
