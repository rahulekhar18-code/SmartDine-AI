import { useState } from "react";
import api from "../services/api";
import "./Login.css";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await api.post("/auth/login",{
        email,
        password
      });

      localStorage.setItem(
        "token",
        res.data.token
      );
console.log("LOGIN RESPONSE =>", res.data.user);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

    console.log("USER SAVED");
    console.log(localStorage.getItem("user"));

      if(res.data.user.role === "ADMIN"){
        window.location.href="/dashboard";
      }else{
        window.location.href="/menu";
      }

    } catch(err){
      console.log(err);

      alert("Invalid Credentials");

    }

  };

  return (
  <div className="login-container">

    {/* LEFT SIDE */}
    <div className="hero-content">

      <h1>🍽 SmartDine</h1>

      <p>
        Manage your restaurant efficiently with
        one powerful dashboard.
      </p>

      

      <div className="features-grid">

  <div className="feature-card">
    <span>🍽</span>
    <h4>Menu</h4>
  </div>

  <div className="feature-card">
    <span>📖</span>
    <h4>Reservations</h4>
  </div>

  <div className="feature-card">
    <span>📦</span>
    <h4>Inventory</h4>
  </div>

  <div className="feature-card">
    <span>🪑</span>
    <h4>Tables</h4>
  </div>

  <div className="feature-card">
    <span>📊</span>
    <h4>Analytics</h4>
  </div>

  <div className="feature-card">
    <span>🤖</span>
    <h4>AI Powered</h4>
  </div>

</div>

    </div>

    {/* RIGHT SIDE */}
    <div className="login-card">

      <div className="logo-circle">
        🍽
      </div>

      <div className="brand">
        <h1>SmartDine</h1>
        <p>Restaurant Management System</p>
      </div>

      {/* Email */}
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="login-options">

  <label className="remember-me">
    <input type="checkbox" />
    Remember Me
  </label>

  <a href="#" className="forgot-password">
    Forgot Password?
  </a>

</div>
      <button
        className="login-btn"
        onClick={handleLogin}
      >
        Login
      </button>

    </div>

  </div>
);

}

export default Login;