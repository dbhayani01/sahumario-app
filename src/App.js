import React, { useState, useCallback } from "react";
import NavbarOptimized from "./components/NavbarOptimized";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PerfumesPage from "./pages/PerfumesPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showCart, setShowCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goCheckout = useCallback(() => {
    setShowCart(false);
    setCurrentPage("checkout");
  }, []);

  const handleSetCurrentPage = useCallback((page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }, []);

  const handleCartClick = useCallback(() => {
    setShowCart(true);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero onExplore={() => handleSetCurrentPage("perfumes")} />
            <PerfumesPage />
          </>
        );
      case "perfumes":
        return <PerfumesPage />;
      case "about":
        return <AboutPage />;
      case "checkout":
        return <CheckoutPage setCurrentPage={handleSetCurrentPage} />;
      case "orders":
        return <OrdersPage />;
      default:
        return <PerfumesPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <NavbarOptimized
        currentPage={currentPage}
        setCurrentPage={handleSetCurrentPage}
        onCartClick={handleCartClick}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer setCurrentPage={handleSetCurrentPage} />

      <CartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={goCheckout}
      />
    </div>
  );
}
