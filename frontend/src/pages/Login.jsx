import { useState } from "react";
import api from "../services/api";
import "./Login.css";

function Login() {

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState("");
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

  const handleCreateAccount = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      alert("Enter name, email and a password of at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: "CUSTOMER"
      });

      alert("Account created successfully. You can now login.");
      setIsCreatingAccount(false);
      setName("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create account");
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
        <h1>{isCreatingAccount ? "Create Account" : "SmartDine"}</h1>
        <p>{isCreatingAccount ? "Register as a customer" : "Restaurant Management System"}</p>
      </div>

      {isCreatingAccount && (
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

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
      {!isCreatingAccount && <div className="login-options">

  <label className="remember-me">
    <input type="checkbox" />
    Remember Me
  </label>

  <a href="#" className="forgot-password">
    Forgot Password?
  </a>

</div>}
      <button
        className="login-btn"
        onClick={isCreatingAccount ? handleCreateAccount : handleLogin}
      >
        {isCreatingAccount ? "Create Customer Account" : "Login"}
      </button>

      <button
        type="button"
        className="create-account-toggle"
        onClick={() => setIsCreatingAccount(!isCreatingAccount)}
      >
        {isCreatingAccount ? "Back to Login" : "Create Account"}
      </button>

    </div>

  </div>
);

}

export default Login;
