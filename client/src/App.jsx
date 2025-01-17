import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Footer from "./components/Footer";
import Products from "./components/Products";
import Orders from "./components/Orders";
import { CartProvider } from "./context/CartContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const handleLogin = (token, role) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <header>
            <Nav
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLogout={handleLogout}
              onLogin={handleLogin}
            />
          </header>
          <main className="flex-grow mt-16">
            <Routes>
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />{" "}
              {/* Add the new route */}
              <Route
                path="/"
                element={
                  <>
                    <section
                      id="home"
                      className="bg-black xl-padding-1 wide:padding-r"
                    >
                      <Hero />
                    </section>
                    <section id="customer-reviews" className="p-6">
                      <CustomerReviews />
                    </section>
                    <section id="products" className="p-6">
                      <Products />
                    </section>
                  </>
                }
              />
            </Routes>
          </main>
          <footer className="mt-auto">
            <Footer />
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
