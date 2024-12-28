import React from "react";
import HeroImage from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bike Nation</h1>
        <p className="text-xl mb-8">Your one-stop shop for all things biking</p>
        <a
          href="#products"
          className="text-white font-bold py-2 px-4 rounded-full"
          style={{
            backgroundColor: "#10AEF6",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0893D3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#10AEF6")}
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default Hero;
