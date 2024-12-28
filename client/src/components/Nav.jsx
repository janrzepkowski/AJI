import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import HeaderLogo from "../assets/logo.png";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="padding-x py-4 absolute z-10 w-full">
      <nav className="flex justify-between items-center max-container">
        <a href="#home" className="flex items-center">
          <img src={HeaderLogo} alt="logo" className="w-10 h-10 mx-2" />
          <span className="text-2xl font-bold">Bike Nation</span>
        </a>

        <ul className="hidden md:flex items-center">
          <li className="mr-4">
            <a href="#home" className="text-gray-600 hover:text-black">
              Home
            </a>
          </li>
          <li className="mr-4">
            <a href="#products" className="text-gray-600 hover:text-black">
              Products
            </a>
          </li>
          <li className="mr-4">
            <a href="#about" className="text-gray-600 hover:text-black">
              About
            </a>
          </li>
          <li className="mr-4">
            <a href="#contact" className="text-gray-600 hover:text-black">
              Contact
            </a>
          </li>
          <li>
            <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full">
              Sign Up
            </button>
          </li>
        </ul>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-3xl">
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
