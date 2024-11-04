"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUpForm = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State to capture any error message
  const router = useRouter();

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setError(""); // Clear previous errors
    try {
      const res = await axios.post("/api/auth/signup", {
        username: state.username,
        email: state.email,
        password: state.password,
      });

      setState({
        username: "",
        email: "",
        password: "",
      });

      if (res.status === 201) {
        router.push("/login");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Capture specific error message from the API response
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <span>or use your email for registration</span>

        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />

        {/* Error message display */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
