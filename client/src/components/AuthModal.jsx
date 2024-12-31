import React, { useState } from "react";
import authService from "../services";

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("CLIENT");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login({
        username: loginUsername,
        password: loginPassword,
      });
      console.log("Login successful:", data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      onLogin(data.accessToken, data.role);
      onClose();
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.signup({
        username: signupUsername,
        password: signupPassword,
        role: signupRole,
      });
      console.log("Signup successful:", data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      onLogin(data.accessToken, data.role);
      onClose();
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data?.error || error.message
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="w-px bg-gray-300 mx-4"></div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
              >
                <option value="CLIENT">Client</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white font-bold py-2 px-4 rounded-full bg-[#10AEF6] hover:bg-[#0893D3] transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
