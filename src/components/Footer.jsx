import React, { useCallback } from "react";

const FooterLink = React.memo(({ onClick, children }) => (
  <button
    onClick={onClick}
    className="hover:text-gray-900 transition-colors"
  >
    {children}
  </button>
));

FooterLink.displayName = 'FooterLink';

const Footer = React.memo(({ setCurrentPage }) => {
  const handleNavClick = useCallback((page) => {
    setCurrentPage?.(page);
  }, [setCurrentPage]);

  const handleEmailClick = useCallback(() => {
    window.location.href = 'mailto:sahumariofragnance@gmail.com';
  }, []);

  return (
    <footer className="mt-12 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        {/* Column 1 */}
        <div>
          <button 
            onClick={() => handleNavClick("home")} 
            className="text-left hover:opacity-80 transition"
          >
            <h4 className="text-lg font-semibold">SAHUMäRIO</h4>
          </button>
          <p className="mt-2 text-gray-600">
            Authentic oil-based perfumes that last all day.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h5 className="font-medium">Quick Links</h5>
          <ul className="mt-2 space-y-1 text-gray-600">
            <li>
              <FooterLink onClick={() => handleNavClick("home")}>
                Home
              </FooterLink>
            </li>
            <li>
              <FooterLink onClick={() => handleNavClick("perfumes")}>
                Perfumes
              </FooterLink>
            </li>
            <li>
              <FooterLink onClick={() => handleNavClick("about")}>
                About
              </FooterLink>
            </li>
            <li>
              <FooterLink onClick={handleEmailClick}>
                Contact
              </FooterLink>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h5 className="font-medium">Connect</h5>
          <p className="mt-2 text-gray-600">
            Email: <a href="mailto:sahumariofragnance@gmail.com" className="hover:text-gray-900 transition-colors">sahumariofragnance@gmail.com</a>
          </p>
          <p className="text-gray-600">Phone: <a href="tel:+919974599911" className="hover:text-gray-900 transition-colors">+91 9974599911</a></p>
          <p className="mt-4 text-gray-500">© 2025 SAHUMäRIO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
