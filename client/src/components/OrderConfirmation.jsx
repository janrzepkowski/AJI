import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../services";

const OrderConfirmation = ({ onClose }) => {
  const { cart, updateCart, removeFromCart, clearCart } = useCart();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      user_name: userName,
      email,
      phone_number: phoneNumber,
      products: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("accessToken");

    try {
      await api.createOrder(orderData, token);
      alert("Order confirmed!");
      clearCart();
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
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
          <h2 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-white font-bold py-2 px-4 rounded-full bg-gray-300 transition-colors duration-300 mr-2"
          >
            Close
          </button>
          <button
            type="submit"
            className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
          >
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderConfirmation;
