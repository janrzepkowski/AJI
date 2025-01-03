import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import HeaderLogo from "../assets/logo.png";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import { useCart } from "../context/CartContext";
import authService from "../services";

const Nav = ({ isLoggedIn, userRole, onLogout, onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItemCount } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const data = await authService.refreshToken();
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      onLogout();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      onLogin(token, role);
    }

    const interval = setInterval(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000); // 55 minutes

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-black" : "bg-transparent"
        }`}
      >
        <nav className="flex justify-between items-center max-container padding-x py-4">
          <a href="#home" className="flex items-center">
            <img src={HeaderLogo} alt="logo" className="w-10 h-10 mx-2" />
            <span className="text-2xl font-bold text-white">Bike Nation</span>
          </a>

          <ul className="hidden md:flex items-center">
            <li className="mr-4">
              <a href="#home" className="text-white hover:text-gray-300">
                Home
              </a>
            </li>
            <li className="mr-4">
              <a href="#products" className="text-white hover:text-gray-300">
                Products
              </a>
            </li>
            <li className="mr-4">
              <a href="#contact" className="text-white hover:text-gray-300">
                Contact
              </a>
            </li>
            {isLoggedIn && userRole === "EMPLOYEE" && (
              <>
                <li className="mr-4">
                  <a
                    href="#manage-products"
                    className="text-white hover:text-gray-300"
                  >
                    Manage Products
                  </a>
                </li>
                <li className="mr-4">
                  <a
                    href="#manage-orders"
                    className="text-white hover:text-gray-300"
                  >
                    Manage Orders
                  </a>
                </li>
              </>
            )}
            {isLoggedIn ? (
              <li className="mr-4">
                <button
                  className="text-white font-bold hover:text-gray-300"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="mr-4">
                <button
                  className="text-white font-bold hover:text-gray-300"
                  onClick={toggleAuthModal}
                >
                  Login / Sign Up
                </button>
              </li>
            )}
            <li className="relative">
              <button className="text-white text-3xl" onClick={toggleCart}>
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </li>
          </ul>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white text-3xl">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>

        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <ul className="flex flex-col items-start p-4">
            <li className="mb-4">
              <a
                href="#home"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Home
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#products"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Products
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#contact"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Contact
              </a>
            </li>
            {isLoggedIn && userRole === "EMPLOYEE" && (
              <>
                <li className="mb-4">
                  <a
                    href="#manage-products"
                    className="text-gray-600 hover:text-black"
                    onClick={toggleMobileMenu}
                  >
                    Manage Products
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#manage-orders"
                    className="text-gray-600 hover:text-black"
                    onClick={toggleMobileMenu}
                  >
                    Manage Orders
                  </a>
                </li>
              </>
            )}
            {isLoggedIn ? (
              <li className="mb-4">
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => {
                    toggleMobileMenu();
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="mb-4">
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => {
                    toggleMobileMenu();
                    toggleAuthModal();
                  }}
                >
                  Sign In / Register
                </button>
              </li>
            )}
            <li>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => {
                  toggleMobileMenu();
                  toggleCart();
                }}
              >
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={toggleAuthModal}
        onLogin={onLogin}
      />
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
            <button
              className="absolute top-2 right-2 text-black text-2xl"
              onClick={toggleCart}
            >
              <FaTimes />
            </button>
            <Cart onClose={toggleCart} />
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
