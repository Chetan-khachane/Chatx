import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Navigate, useLocation, NavLink } from "react-router";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../config/firebase.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validateErrors, setValidateErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (verificationSent) {
      navigate("/verifyEmail", {
        replace: true,
        state: {
          email: user.email,
          resendCooldownTimer: 300,
          verificationSent,
        },
      });
    }
  }, [verificationSent]);

  if (!loading && user) {
    //no user so false
    if (user.emailVerified) {
      return <Navigate to="/welcomeBack" replace />;
    } else {
      try {
        if (!verificationSent) {
          sendEmailVerification(user);
          setVerificationSent(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const from = location.state?.from?.pathname || "/welcomeBack";

  const checkErrors = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    return errors;
  };

  const handleSignIn = async () => {
    try {
      const errors = checkErrors();
      setValidateErrors(errors);
      if (Object.keys(errors).length < 1) {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const signedInUser = userCredentials.user;
        if (signedInUser) {
          await signedInUser.getIdToken(true);
        }
        if (signedInUser && !signedInUser.emailVerified) {
          await sendEmailVerification(signedInUser);
          setVerificationSent(true);
        }
        navigate(from, { replace: true ,state:null});
      } else return;
    } catch (e) {
      console.error(e);
      // Example mapping for firebase error (optional)
      setValidateErrors({ submit: "Invalid Email or Password" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf9] p-4">
      <div className="md:w-[30%] max-w-md sm:max-w-lg relative bg-[#fdfffe] rounded-lg shadow-xl shadow-black/20 p-6 py-10 flex flex-col sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#00214d] text-center">
          Sign In
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="mt-8 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-[#1b2d45] mb-1"
            >
              Enter your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  rounded-lg p-3 bg-[#f2f7f5] text-sm sm:text-base text-[#D90368] font-medium outline-none
                         "
              placeholder="you@example.com"
            />
            {validateErrors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {validateErrors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-[#1b2d45] mb-1"
            >
              Enter your password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg p-3 pr-12 bg-[#f2f7f5] text-sm sm:text-base text-[#D90368] font-medium outline-none
                        "
              placeholder="••••••••"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 sm:top-10 p-1 text-[#1b2d45] rounded-md hover:bg-black/5"
            >
              {showPassword ? (
                // eye-off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
              ) : (
                // eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>

            {validateErrors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {validateErrors.password}
              </p>
            )}
          </div>

          {validateErrors.submit && (
            <p className="text-red-600 text-sm text-center">
              {validateErrors.submit}
            </p>
          )}
          <NavLink
            className={"self-end hover:text-pink-600"}
            to={"passwordReset"}
          >
            Forgot Password?
          </NavLink>
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center bg-[#00ebc7] hover:bg-[#00d9b3] text-[#00214d]
                       font-medium rounded-md shadow-md px-4 py-3 text-sm sm:text-base transition-transform transform
                       hover:-translate-y-0.5 cursor-pointer"
          >
            Sign In
          </button>

          <p className="text-center mt-3 text-sm sm:text-base text-[#334155]">
            Not Registered?{" "}
            <NavLink
              to={"/register"}
              className="text-[#D90368] hover:text-[#3454D1]"
            >
              Click here
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
