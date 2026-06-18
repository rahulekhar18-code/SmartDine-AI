import { useState } from "react";
import api from "../services/api";
import "./Login.css";
import toast from "react-hot-toast";

function Login() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      console.log("LOGIN RESPONSE =>", res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("USER SAVED");
      console.log(localStorage.getItem("user"));

      if (res.data.user.role === "ADMIN") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/menu";
      }
    } catch (err) {
      console.log(err);

      toast.error("Invalid Credentials");
    }
  };

  const handleCreateAccount = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      toast.error("Enter name, email and a password of at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: "CUSTOMER",
      });

      toast.success("Account created successfully. You can now login.");
      setIsCreatingAccount(false);
      setName("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to create account");
    }
  };
  const sendOtp = async () => {
    try {
      await api.post("/otp/send-otp", {
        email,
      });

      toast.success("OTP Sent");
      setOtpSent(true);
    } catch {
toast.error("Failed to send OTP");    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/otp/verify-otp", {
        email,
        otp,
      });

      toast.success("OTP Verified");
      setOtpVerified(true);
    } catch {
      toast.error("Invalid OTP");
    }
  };
  const resetPassword = async () => {
    try {
      await api.post("/auth/reset-password", {
        email,
        password,
      });

      toast.success("Password Updated Successfully");

      setIsForgotPassword(false);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch {
toast.error("Failed to Reset Password");    }
  };
  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="hero-content">
        <h1>🍽 SmartDine</h1>

        <p>Manage your restaurant efficiently with one powerful dashboard.</p>

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
        <div className="logo-circle">🍽</div>

        <div className="brand">
          <h1>
            {isForgotPassword
              ? "Reset Password"
              : isCreatingAccount
                ? "Create Account"
                : "SmartDine"}
          </h1>
          <p>
            {isForgotPassword
              ? "Recover your account"
              : isCreatingAccount
                ? "Register as a customer"
                : "Restaurant Management System"}
          </p>{" "}
        </div>
        {isForgotPassword && (
          <>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </div>

            {!otpSent && (
              <button className="login-btn" onClick={sendOtp}>
                Send OTP
              </button>
            )}

            {otpSent && !otpVerified && (
              <>
                <div className="input-group">
                  <label>OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </div>

                <button className="login-btn" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </>
            )}

            {otpVerified && (
              <>
                <div className="input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                  />
                </div>

                <button className="login-btn" onClick={resetPassword}>
                  Reset Password
                </button>
                <button
                  className="create-account-toggle"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp("");
                  }}
                >
                  Back to Login
                </button>
              </>
            )}
          </>
        )}
{!isForgotPassword && (
  <>
    {isCreatingAccount && otpVerified && (
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
        {isCreatingAccount && otpSent && !otpVerified && (
          <>
            <div className="input-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button className="login-btn" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {/* Password */}
        {(!isCreatingAccount || otpVerified) && (
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        {isCreatingAccount && !otpSent && (
          <button className="login-btn" onClick={sendOtp}>
            Send OTP
          </button>
        )}
        {!isCreatingAccount && (
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember Me
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
        )}
        {(!isCreatingAccount || otpVerified) && (
          <button
            className="login-btn"
            onClick={isCreatingAccount ? handleCreateAccount : handleLogin}
          >
            {isCreatingAccount ? "Create Customer Account" : "Login"}
          </button>
        )}

        <button
          type="button"
          className="create-account-toggle"
          onClick={() => setIsCreatingAccount(!isCreatingAccount)}
        >
          {isCreatingAccount ? "Back to Login" : "Create Account"}
        </button>
        </>
)}
      </div>
    </div>
  );
}

export default Login;
