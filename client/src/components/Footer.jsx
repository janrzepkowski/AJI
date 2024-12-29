import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">Bike Nation</h2>
            <p>
              Your one-stop shop for all your biking needs. From bikes to
              accessories, we have it all.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="#home" className="hover:underline">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#products" className="hover:underline">
                  Products
                </a>
              </li>
              <li className="mb-2">
                <a href="#customer-reviews" className="hover:underline">
                  Customer Reviews
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Email: support@bikenation.com</p>
            <p>Phone: +1 (800) 123-4567</p>
            <p>Address: 123 Bike Lane, Cycle City, CA 12345</p>
          </div>
        </div>
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} Bike Nation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
