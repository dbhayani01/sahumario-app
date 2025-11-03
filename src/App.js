// src/App.jsx (or App.js)
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PerfumesPage from "./pages/PerfumesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import CartDrawer from "./components/CartDrawer";

// ✅ get auth state from context
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showCart, setShowCart] = useState(false);

  const { user } = useAuth(); // user is null when not logged in

  const goCheckout = () => {
    setShowCart(false);
    // If you also want to protect checkout, redirect to login when not logged in:
    if (!user) return setCurrentPage("login");
    setCurrentPage("checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onCartClick={() => setShowCart(true)}
      />

      <main className="flex-1">
        {currentPage === "home" && <Hero onExplore={() => setCurrentPage("perfumes")} />}
        {currentPage === "perfumes" && <PerfumesPage />}
        {currentPage === "about" && <AboutPage />}

        {currentPage === "login" && (
          <LoginPage setCurrentPage={setCurrentPage} />
        )}

        {/* 🔒 Protect Orders: show Login if not authenticated */}
        {currentPage === "orders" && (user ? (
          <OrdersPage />
        ) : (
          <LoginPage setCurrentPage={setCurrentPage} />
        ))}

        {/* (Optional) Protect Checkout similarly */}
        {currentPage === "checkout" && (user ? (
          <CheckoutPage setCurrentPage={setCurrentPage} />
        ) : (
          <LoginPage setCurrentPage={setCurrentPage} />
        ))}
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      <CartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={goCheckout}
      />
    </div>
  );
}
