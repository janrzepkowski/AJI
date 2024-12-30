import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";

const Cart = ({ onClose, onLogin }) => {
  const { cart, updateCart, removeFromCart } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      alert("Order placed!");
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    onLogin(token);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Quantity</th>
                <th className="py-2 px-4 border-b text-right"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">
                    ${item.unit_price.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCart(item.id, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-white font-bold py-2 px-4 rounded-full bg-red-500 transition-colors duration-300 mr-2"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <h2 className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h2>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="text-white font-bold py-2 px-4 rounded-full bg-gray-300 transition-colors duration-300 mr-2"
        >
          Close
        </button>
        <button
          onClick={handleCheckout}
          className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
        >
          Checkout
        </button>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Cart;
