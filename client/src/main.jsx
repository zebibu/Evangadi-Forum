import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import DataContext from "./context/DataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DataContext>
        <App />
      </DataContext>
    </BrowserRouter>
  </StrictMode>
);
