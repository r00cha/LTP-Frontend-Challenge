
import { useState } from "react";
import {NavLink} from "react-router";

export const Header = ({cartCount}: {cartCount: number}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 flex bg-brand rounded-2xl items-center justify-between py-4 px-6 md:px-12 w-[95vw] max-w-7xl z-50 transition-shadow duration-300 ${
        isMenuOpen ? '' : 'shadow-lg'
      }`}>
        {/* Logo */}
        <div className="flex items-center">
          {/* Hamburger Menu Button - Mobile only */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="mr-4 lg:hidden active:scale-90 transition-all duration-150"
          >
            <HamburgerIcon isOpen={isMenuOpen} />
          </button>
          
          <NavLink to="/" className="flex items-center cursor-pointer">
            <img src="/logo-ltp-white.png" alt="LTP Logo" className="h-10 md:h-12 w-auto" />
            <span className="hidden sm:block text-white font-bold text-lg md:text-xl ml-2">Store</span>
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:block font-grotesk">
          <NavLink to="#" className="hover-underline active-scale text-white px-4 py-2 text-lg">Home</NavLink>
          <NavLink to="#shop" className="hover-underline active-scale text-white px-4 py-2 text-lg">Shop</NavLink>
          <NavLink to="#" className="hover-underline active-scale text-white px-4 py-2 text-lg">About</NavLink>
          <NavLink to="#" className="hover-underline active-scale text-white px-4 py-2 text-lg">Contact</NavLink>
          <NavLink to="#" className="hover-underline active-scale text-white px-4 py-2 text-lg">Blog</NavLink>
        </nav>

        {/* Right side: Icon Buttons + Hamburger */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Icon Buttons - Always visible */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search icon */}
            <IconButton ariaLabel="Search" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" x2="16.65" y1="21" y2="16.65"/>
              </svg>
            </IconButton>

            {/* Profile icon */}
            <IconButton ariaLabel="Profile" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </IconButton>

            {/* Cart icon */}
            <IconButton ariaLabel="Shopping Cart" onClick={() => isMenuOpen && setIsMenuOpen(false)} className="relative">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10,20a1,1,0,0,1-1-.8L6.66,7.41A3,3,0,0,0,3.72,5H2A1,1,0,0,1,2,3H3.72a5,5,0,0,1,4.9,4L11,18.8A1,1,0,0,1,10.2,20Z"/>
                <path d="M11,27H9.14a4.14,4.14,0,0,1-.38-8.26l18.41-1.67L28.78,9H8A1,1,0,0,1,8,7H30a1,1,0,0,1,.77.37A1,1,0,0,1,31,8.2l-2,10a1,1,0,0,1-.89.8L8.94,20.74A2.13,2.13,0,0,0,9.14,25H11a1,1,0,0,1,0,2Z"/>
                <path d="M26,30a4,4,0,1,1,4-4A4,4,0,0,1,26,30Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,26,24Z"/>
                <path d="M14,30a4,4,0,1,1,4-4A4,4,0,0,1,14,30Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,14,24Z"/>
                <path d="M23,27H17a1,1,0,0,1,0-2h6a1,1,0,0,1,0,2Z"/>
              </svg>
              {cartCount > 0 ? (
                <span className="no-rotate absolute -right-2 -top-1 border-2 sm:border-2 border-[#013033] flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-rose-500 text-sm font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </IconButton>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand z-40 lg:hidden transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-[100dvh] gap-8 font-grotesk">
          <NavLink
            to="#"
            onClick={toggleMenu}
            className="active-scale hover-underline text-white text-3xl font-semibold hover:text-white/80 transition-colors"
          >
            Home
          </NavLink>
          <NavLink
            to="#shop"
            onClick={toggleMenu}
            className="active-scale hover-underline text-white text-3xl font-semibold hover:text-white/80 transition-colors"
          >
            Shop
          </NavLink>
          <NavLink
            to="#"
            onClick={toggleMenu}
            className="active-scale hover-underline text-white text-3xl font-semibold hover:text-white/80 transition-colors"
          >
            About
          </NavLink>
          <NavLink
            to="#"
            onClick={toggleMenu}
            className="active-scale hover-underline text-white text-3xl font-semibold hover:text-white/80 transition-colors"
          >
            Contact
          </NavLink>
          <NavLink
            to="#"
            onClick={toggleMenu}
            className="active-scale hover-underline text-white text-3xl font-semibold hover:text-white/80 transition-colors"
          >
            Blog
          </NavLink>
        </nav>
      </div>
    </>
  );
};

// Reusable IconButton component
interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

const IconButton = ({ children, onClick, ariaLabel, className }: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group p-2 sm:p-3 bg-primary text-brand rounded-full hover:opacity-80 active:scale-80 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ${className}`}
    >
      <div className="[&>*:not(.no-rotate)]:group-hover:rotate-360 [&>*:not(.no-rotate)]:transition-transform [&>*:not(.no-rotate)]:duration-500 [&>*:not(.no-rotate)]:ease-[cubic-bezier(0.4,0,0.2,1)]">
        {children}
      </div>
    </button>
  );
};

// Animated Hamburger Icon component
interface HamburgerIconProps {
  isOpen: boolean;
}

const HamburgerIcon = ({ isOpen }: HamburgerIconProps) => {
  return (
    <div className="w-5 h-5 flex flex-col justify-center items-center gap-[0.1875rem] sm:gap-1 cursor-pointer" >
      {/* Top bar */}
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'rotate-45 translate-y-[0.3125rem] sm:translate-y-[0.375rem]' : ''
        }`}
      />
      {/* Middle bar */}
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Bottom bar */}
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? '-rotate-45 -translate-y-[0.3125rem] sm:-translate-y-[0.375rem]' : ''
        }`}
      />
    </div>
  );
};
