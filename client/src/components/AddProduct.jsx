import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import services from "../services";

const AddProduct = ({ userRole }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    unit_price: "",
    unit_weight: "",
    category_id: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await services.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      category_id: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    setError("");
    setSuccessMessage("");
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        unit_price: newProduct.unit_price,
        unit_weight: newProduct.unit_weight,
        category_id: newProduct.category_id,
      };
      console.log("Sending POST request with data:", productData);
      await services.createProduct(productData, token);
      setSuccessMessage("Product added successfully!");
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="unit_price"
            value={newProduct.unit_price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Weight</label>
          <input
            type="number"
            name="unit_weight"
            value={newProduct.unit_weight}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category_id"
            value={newProduct.category_id || ""}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {successMessage && (
          <div className="mb-4 text-green-500">{successMessage}</div>
        )}
        <div className="flex justify-end items-center mb-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-white font-bold py-2 px-4 rounded-full bg-gray-300 transition-colors duration-300"
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
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
