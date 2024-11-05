"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
// Import Font Awesome components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
// Import Font Awesome config
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;

const SignUpForm = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/signup", {
        username: state.username,
        email: state.email,
        password: state.password,
      });

      if (res.status === 201) {
        // Automatically sign in after successful registration
        const result = await signIn("credentials", {
          redirect: false,
          email: state.email,
          password: state.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/");
        }
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
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ color: "rgba(51, 51, 51, 0.6)" }}>Create Account</h1>
        <div className="social-container">
          <button
            type="button"
            className="social google-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </button>
          <button type="button" className="social facebook-btn">
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button type="button" className="social linkedin-btn">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </button>
        </div>
        <span style={{ color: "rgba(51, 51, 51, 0.6)" }}>
          or use your email for registration
        </span>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          name="username"
          value={state.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
