import React from "react";
import { useCart } from "../context/CartContext";

const Cart = ({ onClose }) => {
  const { cart, updateCart, removeFromCart } = useCart();

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
                <th className="py-2 px-4 border-b text-right">Actions</th>
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
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Close
        </button>
        <button
          onClick={() => alert("Order placed!")}
          className="bg-green-500 text-white py-2 px-4 rounded ml-2"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
