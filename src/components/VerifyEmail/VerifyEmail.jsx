import React, { useEffect, useState, useRef } from "react";

import { auth } from "../../config/firebase";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";

export default function VerifyEmail() {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const intervalRef = useRef(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!verificationSent) return;
    if (intervalRef.current) return;
    setCheckingVerification(true);
    intervalRef.current = setInterval(async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCheckingVerification(false);
          return;
        }
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCheckingVerification(false);
          try {
            await signOut(auth);
          } catch (e) {
            console.error(e);
          }
          navigate("/"); // or navigate to login
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [verificationSent]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((c) => Math.max(0, c - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [verificationSent]);

  const handleResend = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // No signed-in user — can't resend from client without extra flows.
        alert("Please sign in to resend verification or re-register.");
        return;
      }
      if (resendCooldown > 0) return;
      await sendEmailVerification(user);
      setResendCooldown(300);
      setVerificationSent(true);
      alert("Verification email resent.");
    } catch (err) {
      console.error("Resend error:", err);
      alert("Failed to resend verification email.");
    }
  };
  if (!verificationSent) {
    setVerificationSent(location.state.verificationSent);
    setResendCooldown(location.state.resendCooldownTimer);
  }
  return (
    <div className="flex items-center h-screen justify-center bg-[#f7faf9]">
      <div className="flex max-w-md flex-col items-center bg-[#fdfffe] gap-5 rounded-lg shadow-xl shadow-black/20 p-6">
        <h1 className="font-bold text-2xl mb-2">Verify your email</h1>
        <p className="text-center text-[#1b2d45]">
          A verification email has been sent to{" "}
          <span className="font-bold">{location.state.email}</span>. Please
          check your inbox and click the verification link.
        </p>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-6 w-6 text-[#00ebc7]"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <div className="text-sm text-gray-600">
              {checkingVerification
                ? "Waiting for verification..."
                : "Waiting..."}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            This page will redirect to the login page as soon as we detect
            verification.
          </div>

          <button
            onClick={() => handleResend(resendCooldown, setResendCooldown)}
            disabled={resendCooldown > 0}
            className={`mt-3 px-4 py-2 rounded ${
              resendCooldown > 0
                ? "bg-gray-300 text-gray-600"
                : "bg-[#00ebc7] text-[#00214d]"
            }`}
          >
            {resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "Resend verification email"}
          </button>
        </div>
      </div>
    </div>
  );
}
