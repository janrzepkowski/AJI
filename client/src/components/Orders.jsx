import React, { useState, useEffect } from "react";
import services from "../services";

const Orders = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await services.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const data = await services.getStatuses();
        setStatuses(data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchOrders();
    fetchStatuses();
  }, []);

  const handleOrderClick = (order) => {
    if (userRole === "EMPLOYEE") {
      setSelectedOrder(order);
      setEditOrder({ ...order });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    const selectedStatus = statuses.find((status) => status.id === value);
    setEditOrder((prevOrder) => ({
      ...prevOrder,
      status_id: selectedStatus.id,
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...editOrder.products];
    updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    setEditOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
  };

  const handleProductRemove = (index) => {
    const updatedProducts = [...editOrder.products];
    updatedProducts.splice(index, 1);
    setEditOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const patchData = [
        { op: "replace", path: "/user_name", value: editOrder.user_name },
        { op: "replace", path: "/email", value: editOrder.email },
        { op: "replace", path: "/phone_number", value: editOrder.phone_number },
        { op: "replace", path: "/status_id", value: editOrder.status_id },
        {
          op: "replace",
          path: "/products",
          value: editOrder.products.map((product) => ({
            product_id: product.product_id.id || product.product_id,
            quantity: product.quantity,
          })),
        },
      ];
      console.log("Sending PATCH request with data:", patchData);
      await services.updateOrder(editOrder.id, patchData, token);
      const updatedOrders = await services.getOrders();
      setOrders(updatedOrders);
      setSelectedOrder(null);
      setEditOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">User Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone Number</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  userRole === "EMPLOYEE" ? "hover:underline" : ""
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.user_name}</td>
                <td className="py-2 px-4 border-b">{order.email}</td>
                <td className="py-2 px-4 border-b">{order.phone_number}</td>
                <td className="py-2 px-4 border-b">
                  {order.status_id ? order.status_id.name : "Unknown"}
                </td>
                <td className="py-2 px-4 border-b">
                  {order.products.map((product, index) => (
                    <div
                      key={
                        product.product_id ? product.product_id.id : product.id
                      }
                    >
                      {product.product_id ? product.product_id.name : "Unknown"}{" "}
                      (x{product.quantity})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">User Name</label>
              <input
                type="text"
                name="user_name"
                value={editOrder.user_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editOrder.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={editOrder.phone_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                name="status_id"
                value={editOrder.status_id}
                onChange={handleStatusChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Products</label>
              {editOrder.products.map((product, index) => (
                <div
                  key={product.product_id ? product.product_id.id : product.id}
                  className="mb-2 flex items-center"
                >
                  <div className="mb-2 flex-1">{product.product_id.name}</div>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    min="1"
                    onChange={(e) => handleProductChange(index, e)}
                    className="w-20 p-2 border border-gray-300 rounded mx-2"
                    placeholder="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => handleProductRemove(index)}
                    className="text-white font-bold py-2 px-4 rounded-full bg-red-500 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setEditOrder(null);
                }}
                className="text-white font-bold py-2 px-4 rounded-full bg-gray-300 transition-colors duration-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Orders;
