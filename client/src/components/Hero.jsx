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
        <p className="text-xl mb-8">Where every journey begins on two wheels</p>
        <button
          onClick={() => (window.location.href = "#products")}
          className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
