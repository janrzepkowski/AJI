import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Footer from "./components/Footer";
import Products from "./components/Products";
import Orders from "./components/Orders";
import OrderConfirmation from "./components/OrderConfirmation";
import UpdateOrder from "./components/UpdateOrder";
import UpdateProduct from "./components/UpdateProduct";
import AddProduct from "./components/AddProduct";
import AuthModal from "./components/AuthModal";
import { CartProvider } from "./context/CartContext";
import authService from "./services";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [userPhoneNumber, setUserPhoneNumber] = useState(
    localStorage.getItem("userPhoneNumber")
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = (token, role, username, email, phoneNumber) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", username);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhoneNumber", phoneNumber);
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(username);
    setUserEmail(email);
    setUserPhoneNumber(phoneNumber);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoneNumber");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setUserEmail(null);
    setUserPhoneNumber(null);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const refreshAccessToken = async () => {
    try {
      const data = await authService.refreshToken();
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const phoneNumber = localStorage.getItem("userPhoneNumber");
    if (token && role && username && email && phoneNumber) {
      handleLogin(token, role, username, email, phoneNumber);
    }

    const interval = setInterval(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000); // 55 minutes

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <header>
            <Nav
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              userName={userName}
              onLogout={handleLogout}
              onLogin={handleLogin}
              toggleAuthModal={toggleAuthModal}
            />
          </header>
          <main className="flex-grow mt-16">
            <Routes>
              <Route path="/orders" element={<Orders userRole={userRole} />} />
              <Route
                path="/products"
                element={<Products userRole={userRole} />}
              />
              <Route
                path="/order-confirmation"
                element={
                  <OrderConfirmation
                    userName={userName}
                    userEmail={userEmail}
                    userPhoneNumber={userPhoneNumber}
                  />
                }
              />
              <Route
                path="/orders/:id"
                element={<UpdateOrder userRole={userRole} />}
              />
              <Route
                path="/products/:id"
                element={<UpdateProduct userRole={userRole} />}
              />
              <Route
                path="/add-product"
                element={<AddProduct userRole={userRole} />}
              />
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
                      <Products userRole={userRole} />
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={toggleAuthModal}
        onLogin={handleLogin}
      />
    </CartProvider>
  );
};

export default App;
