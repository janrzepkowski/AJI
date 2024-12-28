import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import HeaderLogo from "../assets/logo.png";
import Login from "./Login";
import Signup from "./Signup";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleSignup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
              <a href="#about" className="text-white hover:text-gray-300">
                About
              </a>
            </li>
            <li className="mr-4">
              <a href="#contact" className="text-white hover:text-gray-300">
                Contact
              </a>
            </li>
            <li className="mr-4">
              <button
                className="text-white font-bold hover:text-gray-300"
                onClick={toggleLogin}
              >
                Login
              </button>
            </li>
            <li>
              <button
                className="text-white font-bold hover:text-gray-300"
                onClick={toggleSignup}
              >
                Sign Up
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
                href="#about"
                className="text-gray-600 hover:text-black"
                onClick={toggleMobileMenu}
              >
                About
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
            <li className="mb-4">
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => {
                  toggleMobileMenu();
                  toggleLogin();
                }}
              >
                Login
              </button>
            </li>
            <li>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => {
                  toggleMobileMenu();
                  toggleSignup();
                }}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </header>
      <Login isOpen={isLoginOpen} onClose={toggleLogin} />
      <Signup isOpen={isSignupOpen} onClose={toggleSignup} />
    </>
  );
};

export default Nav;
