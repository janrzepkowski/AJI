import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import services from "../services";

const Orders = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

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

  const handleFilterStatusChange = async (e) => {
    const { value } = e.target;
    setFilterStatus(value);
    if (value) {
      try {
        const filteredOrders = await services.getOrdersByStatus(value);
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders by status:", error);
      }
    } else {
      const allOrders = await services.getOrders();
      setOrders(allOrders);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Filter by Status</label>
        <select
          value={filterStatus}
          onChange={handleFilterStatusChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
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
                onClick={() => handleOrderClick(order.id)}
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
                      key={`${order.id}-${
                        product.product_id ? product.product_id.id : product.id
                      }-${index}`}
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
    </div>
  );
};

export default Orders;
