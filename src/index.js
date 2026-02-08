import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { OrdersProvider } from "./context/OrdersContext";
import { CartProvider } from "./context/cartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
