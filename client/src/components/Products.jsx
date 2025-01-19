import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import services from "../services";
import { useCart } from "../context/CartContext";

const Products = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await services.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
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

    fetchProducts();
    fetchCategories();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const token = localStorage.getItem("accessToken");
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        await services.initProducts(data, token);
        const updatedProducts = await services.getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error initializing products:", error);
      }
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesCategory = filterCategory
      ? product.category_id === filterCategory
      : true;
    return matchesName && matchesCategory;
  });

  const handleProductClick = (productId) => {
    if (userRole === "EMPLOYEE") {
      navigate(`/products/${productId}`);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {userRole === "EMPLOYEE" && (
        <div className="mb-6">
          <button
            onClick={() => navigate("/add-product")}
            className="text-white font-bold py-2 px-4 rounded-full bg-green-600 hover:bg-green-800 transition-colors duration-300"
          >
            Add New Product
          </button>
        </div>
      )}
      {userRole === "EMPLOYEE" && products.length === 0 && (
        <div className="mb-6">
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 p-4 mt-4 text-center"
          >
            <input {...getInputProps()} />
            <p>Drag & drop a JSON file here, or click to select a file</p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 ${
                  userRole === "EMPLOYEE" ? "cursor-pointer" : ""
                }`}
                onClick={() => handleProductClick(product.id)}
              >
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.description}</td>
                <td className="py-2 px-4 border-b">
                  ${product.unit_price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">
                  {getCategoryName(product.category_id)}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="text-white font-bold rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
                    style={{ width: "120px", height: "40px" }}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
