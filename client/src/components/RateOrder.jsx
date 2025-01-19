import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import services from "../services";

const RateOrder = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await services.addOrderOpinion(id, { rating, content }, token);
      navigate("/orders");
    } catch (error) {
      console.error("Error adding opinion:", error);
      setError(
        error.response ? error.response.data.error : "An error occurred"
      );
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= (hoverRating || rating) ? (
          <FaStar
            key={i}
            className="text-yellow-500 cursor-pointer"
            style={{ fontSize: "2rem" }}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
          />
        ) : (
          <FaRegStar
            key={i}
            className="text-yellow-500 cursor-pointer"
            style={{ fontSize: "2rem" }}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
          />
        )
      );
    }
    return stars;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Rate Order</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Rating</label>
          <div className="flex">{renderStars()}</div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="text-white font-bold rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
          style={{ width: "120px", height: "40px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RateOrder;
