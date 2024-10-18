import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";
import "sweetalert2/src/sweetalert2.scss";
import ToastContainer from "./components/Toast/ToastContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <App />
          <ToastContainer />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
