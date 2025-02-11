import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import services from "../services";

const Orders = ({ userRole, userName }) => {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOpinion, setSelectedOpinion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await services.getOrders();
        if (userRole === "CLIENT") {
          const filteredOrders = data.filter(
            (order) => order.user_name === userName
          );
          setOrders(filteredOrders);
        } else {
          setOrders(data);
        }
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
  }, [userRole, userName]);

  const handleFilterStatusChange = async (e) => {
    const { value } = e.target;
    setFilterStatus(value);
    if (value) {
      try {
        const filteredOrders = await services.getOrdersByStatus(value);
        if (userRole === "CLIENT") {
          const clientFilteredOrders = filteredOrders.filter(
            (order) => order.user_name === userName
          );
          setOrders(clientFilteredOrders);
        } else {
          setOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching orders by status:", error);
      }
    } else {
      const allOrders = await services.getOrders();
      if (userRole === "CLIENT") {
        const clientFilteredOrders = allOrders.filter(
          (order) => order.user_name === userName
        );
        setOrders(clientFilteredOrders);
      } else {
        setOrders(allOrders);
      }
    }
  };

  const handleOrderClick = (orderId) => {
    if (userRole === "EMPLOYEE") {
      navigate(`/orders/${orderId}`);
    }
  };

  const handleRateOrderClick = (orderId) => {
    navigate(`/orders/${orderId}/opinions`);
  };

  const handleOpinionClick = (opinion) => {
    setSelectedOpinion(opinion);
  };

  const closeOpinionModal = () => {
    setSelectedOpinion(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="flex space-x-4 mb-6">
        <select
          value={filterStatus}
          onChange={handleFilterStatusChange}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Statuses</option>
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
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`hover:bg-gray-50 ${
                  userRole === "EMPLOYEE" ? "cursor-pointer" : ""
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
                <td className="py-2 px-4 border-b">
                  {order.opinions && order.opinions.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpinionClick(order.opinions[0]);
                      }}
                      className="text-white font-bold rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
                      style={{ width: "100px", height: "50px" }}
                    >
                      View Opinion
                    </button>
                  )}
                  {userRole === "CLIENT" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRateOrderClick(order.id);
                      }}
                      className="text-white font-bold rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300 ml-2"
                      style={{ width: "100px", height: "50px" }}
                    >
                      Rate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOpinion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg relative w-1/2 h-1/2 flex flex-col justify-center items-center">
            <button
              onClick={closeOpinionModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Opinion</h2>
            <p>
              <strong>Rating:</strong> {selectedOpinion.rating}/5
            </p>
            <p>
              <strong>Content:</strong> {selectedOpinion.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
