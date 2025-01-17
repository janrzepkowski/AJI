import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import HeaderLogo from "../assets/logo.png";
import Cart from "./Cart";
import { useCart } from "../context/CartContext";

const Nav = ({ isLoggedIn, userRole, userName, onLogout, toggleAuthModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItemCount } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        <nav className="flex justify-between items-center max-container padding-x py-4">
          <Link to="/" className="flex items-center">
            <img src={HeaderLogo} alt="logo" className="w-10 h-10 mx-2" />
            <span className="text-2xl font-bold text-white">Bike Nation</span>
          </Link>

          <ul className="hidden md:flex items-center">
            <li className="mr-4">
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li className="mr-4">
              <Link to="/products" className="text-white hover:text-gray-300">
                Products
              </Link>
            </li>
            <li className="mr-4">
              <Link to="/#contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
            </li>
            {isLoggedIn && (
              <li className="mr-4">
                <Link to="/orders" className="text-white hover:text-gray-300">
                  Orders
                </Link>
              </li>
            )}
            {isLoggedIn && userRole === "EMPLOYEE" && (
              <>
                <li className="mr-4">
                  <Link
                    to="/#manage-products"
                    className="text-white hover:text-gray-300"
                  >
                    Manage Products
                  </Link>
                </li>
                <li className="mr-4">
                  <Link
                    to="/#manage-orders"
                    className="text-white hover:text-gray-300"
                  >
                    Manage Orders
                  </Link>
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
              <Link
                to="/"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/products"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Products
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/#contact"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
            </li>
            {isLoggedIn && (
              <li className="mb-4">
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-black"
                  onClick={toggleMobileMenu}
                >
                  Orders
                </Link>
              </li>
            )}
            {isLoggedIn && userRole === "EMPLOYEE" && (
              <>
                <li className="mb-4">
                  <Link
                    to="/#manage-products"
                    className="text-gray-600 hover:text-black"
                    onClick={toggleMobileMenu}
                  >
                    Manage Products
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/#manage-orders"
                    className="text-gray-600 hover:text-black"
                    onClick={toggleMobileMenu}
                  >
                    Manage Orders
                  </Link>
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
