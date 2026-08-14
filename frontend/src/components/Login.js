import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const login = () => {
    // Admin Login
    if (
      loginData.email === "admin@civiceye.com" &&
      loginData.password === "admin123"
    ) {
      if (rememberMe) {
        localStorage.setItem("rememberEmail", loginData.email);
      }
      onLogin();
      return;
    }

    // User Login
    const user = JSON.parse(localStorage.getItem("civiceye-user"));

    if (
      user &&
      user.email === loginData.email &&
      user.password === loginData.password
    ) {
      if (rememberMe) {
        localStorage.setItem("rememberEmail", loginData.email);
      }
      onLogin();
      return;
    }

    alert("Invalid Email or Password");
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

    alert("Account Created Successfully!");

    setRegisterData({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setIsLogin(true);
  };

  return (
    <div className="login-container">

  <div className="login-card">

    <h1>CivicEye AI</h1>

    <p className="subtitle">
      AI Powered Smart Public Issue Detection System
    </p>

    <div className="tab-buttons">

      <button
        className={isLogin ? "active" : ""}
        onClick={() => setIsLogin(true)}
      >
        Sign In
      </button>

      <button
        className={!isLogin ? "active" : ""}
        onClick={() => setIsLogin(false)}
      >
        Create Account
      </button>

    </div>

    {isLogin ? (

      <>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
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
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            Remember Me

          </label>

          <span className="forgot">

            Forgot Password?

          </span>

        </div>

        <button
          className="main-btn"
          onClick={login}
        >
          Login
        </button>

        <div className="admin-box">

          <strong>Demo Admin</strong>

          <br />

          admin@civiceye.com

          <br />

          admin123

        </div>

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

<button
  className="main-btn"
  onClick={register}
>
  Create Account
</button>

<p className="login-link">
  Already have an account?
  <span onClick={() => setIsLogin(true)}>
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