import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  FreindProfile,
  Home,
  Login,
  NotificationSettings,
  PasswordReset,
  Profile,
  Register,
  VerifyEmail,
  WelcomeBackScreen,
} from "./components/index.js";
import Layout from "./Layout.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="passwordReset" element={<PasswordReset/>}/>
        <Route path="verifyEmail" element={<VerifyEmail/>}/>
        <Route
          path="welcomeBack"
          element={
            <RequireAuth>
              <WelcomeBackScreen />
            </RequireAuth>
          }
        />
        <Route
        path="/freindProfile"
        element={
          <RequireAuth>
            <FreindProfile/>
          </RequireAuth>
        }/>
        <Route
          path="home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="home">
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="notify"
            element={
              <RequireAuth>
                <NotificationSettings />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="register" element={<Register />} />
      </Routes>
    </AuthContextProvider>
  </BrowserRouter>
);
