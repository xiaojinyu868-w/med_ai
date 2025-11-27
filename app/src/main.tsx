import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./store";
import { theme } from "./theme";
import "./styles/index.css";

const rootEl = document.getElementById("root") as HTMLElement | null;

const renderApp = () => {
  if (!rootEl) {
    console.error("Root element #root not found");
    return;
  }
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
};

const start = async () => {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
    } catch (err) {
      console.error("MSW init failed, fallback to direct API calls", err);
    }
  }
  renderApp();
};

start();
