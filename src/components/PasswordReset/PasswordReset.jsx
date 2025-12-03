import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { NavLink } from "react-router";
export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async () => {
    if (!email.trim()) return setError("Please enter an email.");
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setHasSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex items-center h-screen justify-center bg-[#f7faf9]">
      <div className="flex max-w-md flex-col items-center bg-[#fdfffe] gap-5 rounded-lg shadow-xl shadow-black/20 p-6">
        <h1 className="font-bold text-2xl mb-5">Password Reset</h1>
        {!hasSubmitted ? (
          <div className="flex flex-col gap-5">
            <p className="font-medium text-md text-[#1b2d45]">
              Enter your registered email address to reset password
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              name="email"
              className="
                    w-full rounded-lg p-3 pr-12 bg-[#f2f7f5] text-sm sm:text-base text-[#D90368] font-medium outline-none
                    "
            />
            {error && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {error}
              </p>
            )}
            <button
              className="mt-2 w-full inline-flex items-center justify-center bg-[#00ebc7] hover:bg-[#00d9b3] text-[#00214d]
                       font-medium rounded-md shadow-md px-4 py-3 text-sm sm:text-base transition-transform transform
                       hover:-translate-y-0.5 cursor-pointer"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        ) : (
          <div>
            {" "}
            <p className="text-center text-[#1b2d45]">
              A password reset email has been sent to{" "}
              <span className="font-bold">{email}</span>.Please check your inbox
              and click on the link to reset password.
              <span className="text-[18px] font-extrabold text-red-500">
                Once done,click on continue to login page
              </span>
            </p>
            <NavLink to="/"
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center bg-[#19ff34] hover:bg-[#00d9b3] text-[#00214d]
                       font-bold rounded-md shadow-md px-4 py-3 text-sm sm:text-base transition-transform transform
                       hover:-translate-y-0.5 cursor-pointer"
            >Continue to Login</NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
