import React, { useEffect, useState } from "react";
import service from "../services";
import { FaStar, FaRegStar } from "react-icons/fa";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const orders = await service.getOrders();
        const allReviews = orders.flatMap((order) =>
          order.opinions.map((opinion) => ({
            ...opinion,
            username: order.user_name,
          }))
        );
        setReviews(allReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  if (reviews.length === 0) {
    return <p>No reviews available</p>;
  }

  const currentReview = reviews[currentIndex];

  return (
    <section id="customer-reviews">
      <div className="flex justify-center items-center">
        <button
          onClick={handlePrev}
          className="text-white mr-4 p-2 bg-[#10AEF6] rounded-full"
        >
          {"<"}
        </button>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <div className="flex justify-center mb-2">
            {renderStars(currentReview.rating)}
          </div>
          <p className="text-xl font-semibold mb-2">{currentReview.content}</p>
          <p className="text-gray-500 text-sm">- {currentReview.username}</p>
        </div>
        <button
          onClick={handleNext}
          className="text-white ml-4 p-2 bg-[#10AEF6] rounded-full"
        >
          {">"}
        </button>
      </div>
    </section>
  );
};

export default CustomerReviews;
