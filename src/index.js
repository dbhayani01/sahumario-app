import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { OrdersProvider } from "./context/OrdersContext";
import { CartProvider } from "./context/cartContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <OrdersProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </OrdersProvider>
    </ThemeProvider>
  </React.StrictMode>
);
