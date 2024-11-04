"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Assuming NextAuth is being used

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
      // Sign in using NextAuth for credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email: state.email,
        password: state.password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/"); // Redirect to the desired page on successful sign-in
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Sign in using Google provider
      const result = await signIn("google", { callbackUrl: "/" });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/"); // Redirect to the desired page on successful sign-in
      }
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <button type="button" className="social" onClick={handleGoogleSignIn}>
            <i className="fab fa-google-plus-g"></i> Sign in with Google
          </button>
          <a href="#" className="social">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <span>or use your account</span>
        {error && <p className="error">{error}</p>}
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
        <a href="#">Forgot your password?</a>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
