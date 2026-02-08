import React, { useCallback } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cartContext';
import { useTheme } from '../context/ThemeContext';

const NavLink = React.memo(({ id, isActive, onClick, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`${
      isActive ? 'text-amber-600' : 'text-[var(--color-muted)]'
    } hover:text-amber-600 transition px-3 py-2`}
    aria-current={isActive ? 'page' : undefined}
  >
    {children}
  </button>
));

NavLink.displayName = 'NavLink';

const NavbarOptimized = React.memo(({ 
  currentPage, 
  setCurrentPage, 
  onCartClick,
  isMenuOpen,
  setIsMenuOpen
}) => {
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = useCallback((page) => {
    setCurrentPage?.(page);
    setIsMenuOpen?.(false);
  }, [setCurrentPage, setIsMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center text-xl font-bold tracking-wide hover:opacity-80 transition"
          >
            <img
              src="/logo.png"
              alt="Sahumario Logo"
              width={70}
              height={70}
              loading="lazy"
            />
            <span className="text-amber-600">SAHUMä</span>RIO
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink id="home" isActive={currentPage === 'home'} onClick={handleNavClick}>
              Home
            </NavLink>
            <NavLink id="perfumes" isActive={currentPage === 'perfumes'} onClick={handleNavClick}>
              Perfumes
            </NavLink>
            <NavLink id="about" isActive={currentPage === 'about'} onClick={handleNavClick}>
              About
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--color-surface-muted)] transition"
              title="Toggle theme"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? '🌞' : '🌙'}
            </button>

            {/* Cart icon - always visible */}
            <button 
              className="relative p-2 rounded-full hover:bg-[var(--color-surface-muted)] transition" 
              title="Cart" 
              type="button" 
              onClick={onCartClick}
              aria-label={`Shopping cart with ${count} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-semibold">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-muted)] transition"
            onClick={() => setIsMenuOpen?.(!isMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            type="button"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav id="mobile-nav" className="md:hidden pb-3 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-3">
              <button 
                onClick={() => handleNavClick('home')} 
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-[var(--color-surface-muted)] transition"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('perfumes')} 
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-[var(--color-surface-muted)] transition"
              >
                Perfumes
              </button>
              <button 
                onClick={() => handleNavClick('about')} 
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-[var(--color-surface-muted)] transition"
              >
                About
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

NavbarOptimized.displayName = 'NavbarOptimized';

export default NavbarOptimized;
