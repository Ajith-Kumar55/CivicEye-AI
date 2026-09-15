import React, { useState } from "react";
import "./Login.css";

const API_BASE_URL = "https://civiceye-ai-backend.onrender.com";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("citizen"); // "citizen" or "admin"
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    if (!loginData.email || !loginData.password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    // Municipality Admin Verification via Backend API
    if (role === "admin") {
      let authSuccess = false;
      let adminToken = "";
      let adminUser = null;
      let errorMessage = "";

      // 1. Try Primary Backend URL
      try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            role: "admin"
          })
        });

        const data = await response.json();

        if (response.ok && data.success && data.role === "admin") {
          authSuccess = true;
          adminToken = data.token;
          adminUser = data.user || { name: "Municipality Administrator", email: loginData.email };
        } else {
          errorMessage = data.error || "Invalid Municipality Admin credentials.";
        }
      } catch (err) {
        console.warn("Primary API Login fetch notice, trying local backend API:", err);

        // 2. Try Local Backend URL (http://127.0.0.1:5000)
        try {
          const localRes = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: loginData.email,
              password: loginData.password,
              role: "admin"
            })
          });
          const localData = await localRes.json();
          if (localRes.ok && localData.success && localData.role === "admin") {
            authSuccess = true;
            adminToken = localData.token;
            adminUser = localData.user || { name: "Municipality Administrator", email: loginData.email };
          } else {
            errorMessage = localData.error || "Invalid Municipality Admin credentials.";
          }
        } catch (localErr) {
          errorMessage = "Unable to connect to authentication server. Please check your connection.";
        }
      }

      if (authSuccess) {
        if (rememberMe) {
          localStorage.setItem("rememberEmail", loginData.email);
        }
        sessionStorage.setItem("civiceye_admin_token", adminToken);
        sessionStorage.setItem("civiceye_role", "admin");

        if (typeof onLogin === "function") {
          onLogin("admin", adminUser);
        }
        setLoading(false);
        return;
      } else {
        alert(errorMessage || "Invalid Municipality Admin credentials.");
        setLoading(false);
        return;
      }
    }

    // Citizen Login Verification
    const user = JSON.parse(localStorage.getItem("civiceye-user"));

    if (
      user &&
      user.email === loginData.email &&
      user.password === loginData.password
    ) {
      if (rememberMe) {
        localStorage.setItem("rememberEmail", loginData.email);
      }
      sessionStorage.setItem("civiceye_role", "citizen");
      if (typeof onLogin === "function") {
        onLogin("citizen", user);
      }
      setLoading(false);
      return;
    }

    // Backend Citizen Auth Check
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: "citizen"
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.role === "citizen") {
        if (rememberMe) {
          localStorage.setItem("rememberEmail", loginData.email);
        }
        sessionStorage.setItem("civiceye_role", "citizen");
        if (typeof onLogin === "function") {
          onLogin("citizen", data.user);
        }
        setLoading(false);
        return;
      }
    } catch (e) {
      // Backend offline fallback
    }

    alert("Invalid Email or Password");
    setLoading(false);
  };

  const register = () => {
    if (
      !registerData.name ||
      !registerData.phone ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "civiceye-user",
      JSON.stringify(registerData)
    );

    alert("Account Created Successfully! You can now log in as a Citizen.");

    setRegisterData({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setIsLogin(true);
    setRole("citizen");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CivicEye AI</h1>

        <p className="subtitle">
          AI Powered Smart Public Issue Detection System
        </p>

        {/* ROLE & AUTH SELECTION TABS */}
        <div className="tab-buttons" style={{ flexWrap: "wrap", gap: "5px" }}>
          <button
            className={isLogin && role === "citizen" ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setRole("citizen");
            }}
          >
            👤 Citizen Sign In
          </button>

          <button
            className={isLogin && role === "admin" ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setRole("admin");
            }}
          >
            🏛️ Municipality Admin
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setRole("citizen");
            }}
          >
            📝 Create Account
          </button>
        </div>

        {isLogin ? (
          <>
            {role === "admin" && (
              <div
                style={{
                  background: "#0284c7",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                  textAlign: "center"
                }}
              >
                🏛️ Municipality Admin Secure Portal
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder={
                role === "admin" ? "Admin Email (e.g. admin@civiceye.com)" : "Email Address"
              }
              value={loginData.email}
              onChange={handleLoginChange}
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
              />

              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>

              <span className="forgot">Forgot Password?</span>
            </div>

            <button
              className="main-btn"
              onClick={login}
              disabled={loading}
            >
              {loading ? "Authenticating..." : role === "admin" ? "Login as Admin" : "Login"}
            </button>

            {role === "admin" && (
              <div className="admin-box" style={{ marginTop: "15px", fontSize: "12px" }}>
                <strong>Municipality Officer Access</strong>
                <br />
                Credentials verified via backend API
              </div>
            )}
          </>
        ) : (
          <>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={registerData.name}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={registerData.phone}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />

              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
              />
            </div>

            <button className="main-btn" onClick={register}>
              Create Account
            </button>

            <p className="login-link">
              Already have an account?
              <span
                onClick={() => {
                  setIsLogin(true);
                  setRole("citizen");
                }}
              >
                {" "}Sign In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;