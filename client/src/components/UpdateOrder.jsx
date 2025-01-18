import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../services";

const UpdateOrder = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await services.getOrderById(id);

        setOrder(data);
        setEditOrder({
          ...data,
          status_id: data.status_id.id,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
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

    fetchOrder();
    fetchStatuses();
  }, [id]);

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
      navigate("/orders");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

  if (!order || !editOrder) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Order</h1>
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
            onClick={handleCancel}
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
  );
};

export default UpdateOrder;
