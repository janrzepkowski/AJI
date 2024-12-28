import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import HeaderLogo from "../assets/logo.png";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <li>
            <button className="bg-white text-black hover:bg-gray-300 px-4 py-2 rounded-full">
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
          <li>
            <button
              className="text-gray-600 hover:text-black"
              onClick={toggleMobileMenu}
            >
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Nav;
