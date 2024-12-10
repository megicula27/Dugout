"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast"; // Import toast
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const SignInForm = () => {
  const [state, setState] = useState({
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
      const result = await signIn("credentials", {
        redirect: false,
        email: state.email,
        password: state.password,
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error || "Sign-in failed. Please try again."); // Failure notification
      } else {
        router.push("/");
        toast.success("Signed in successfully!"); // Success notification
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      toast.error("An unexpected error occurred. Please try again."); // Failure notification for exceptions
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/" });
      toast.success("Signed in with Google successfully!"); // Success notification
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      toast.error("Google sign-in failed. Please try again."); // Failure notification
      console.error("Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ color: "rgba(51, 51, 51, 0.6)" }}>Sign in</h1>
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
          or use your account
        </span>
        {error && <div className="error-message">{error}</div>}
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
        <a href="#" className="forgot-password">
          Forgot your password?
        </a>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
