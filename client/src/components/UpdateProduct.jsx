import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../services";

const UpdateProduct = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await services.getProductById(id);
        setProduct(data);
        setEditProduct({
          ...data,
          category_id: data.category_id,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await services.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      category_id: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const productData = {
        name: editProduct.name,
        description: editProduct.description,
        unit_price: editProduct.unit_price,
        unit_weight: editProduct.unit_weight,
        category_id: editProduct.category_id,
      };
      console.log("Sending PUT request with data:", productData);
      await services.updateProduct(editProduct.id, productData, token);
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (!product || !editProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={editProduct.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={editProduct.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="unit_price"
            value={editProduct.unit_price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Weight</label>
          <input
            type="number"
            name="unit_weight"
            value={editProduct.unit_weight}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category_id"
            value={editProduct.category_id || ""}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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

export default UpdateProduct;
