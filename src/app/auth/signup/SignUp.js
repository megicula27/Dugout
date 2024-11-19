"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { SignupSchema } from "@/schema/validationSchema";

config.autoAddCss = false;

const SignUpForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnSubmit = async (values) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/signup", values);

      if (res.status === 201) {
        toast.success("Account created successfully! Signing you in..."); // Success notification for sign-up

        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setError(result.error);
          toast.error(result.error || "Failed to sign in after registration."); // Failure notification for sign-in
        } else {
          toast.success("Signed in successfully!"); // Success notification for sign-in
          router.push("/");
        }
      } else if (res.status === 400) {
        setError(res.data.message);
        toast.error(res.data.message || "Failed to create account."); // Failure notification
      } else {
        setError("Failed to create account. Please try again.");
        toast.error("Failed to create account. Please try again."); // Generic failure notification
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      ); // Failure notification for exceptions
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
    <div className="form-container sign-up-container">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
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

            <div>
              <Field type="text" name="username" placeholder="Name" />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>
            <div>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>
            <div>
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpForm;
