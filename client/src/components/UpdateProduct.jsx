import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../services";

const UpdateProduct = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [seoDescription, setSeoDescription] = useState("");

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

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await services.deleteProduct(id, token);
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchSeoDescription = async () => {
    try {
      const response = await services.getProductSeoDescription(id);
      setSeoDescription(response);
      setEditProduct((prevProduct) => ({
        ...prevProduct,
        description: response,
      }));
    } catch (error) {
      console.error("Error fetching SEO description:", error);
    }
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
          <button
            type="button"
            onClick={handleDelete}
            className="text-white font-bold py-2 px-4 rounded-full bg-red-600 hover:bg-red-800 transition-colors duration-300 ml-2"
          >
            Delete
          </button>
        </div>
      </form>
      <div className="mt-6">
        <button
          type="button"
          onClick={fetchSeoDescription}
          className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
        >
          Fetch SEO Description
        </button>
        {seoDescription && (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-2">SEO Description</h2>
            <p>{seoDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
