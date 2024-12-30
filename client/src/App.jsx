import React, { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Footer from "./components/Footer";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const handleLogin = (token) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <header>
          <Nav
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLogin={handleLogin}
          />
        </header>
        <main className="flex-grow">
          <section id="home" className="bg-black xl-padding-1 wide:padding-r">
            <Hero />
          </section>
          <section id="customer-reviews" className="p-6">
            <CustomerReviews />
          </section>
          <section id="products" className="p-6">
            <Products />
          </section>
        </main>
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
