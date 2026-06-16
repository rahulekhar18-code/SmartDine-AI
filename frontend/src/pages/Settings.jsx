import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../assets/Settings.css";

function Settings() {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Sidebar />

      <div className="settings-container">

        <div className="settings-hero">

          <div>
            <h1>⚙️ Settings</h1>

            <p>
              Customize your dashboard appearance
              and preferences.
            </p>
          </div>

        </div>

        <div className="settings-grid">

          <div className="settings-card">

            <h2>🎨 Theme Settings</h2>

            <p>
              Select your preferred dashboard theme.
            </p>

            <div className="theme-buttons">

              <button
                className={
                  theme === "dark"
                    ? "theme-btn active-dark"
                    : "theme-btn"
                }
                onClick={() => setTheme("dark")}
              >
                🌙 Dark Mode
              </button>

              <button
                className={
                  theme === "light"
                    ? "theme-btn active-light"
                    : "theme-btn"
                }
                onClick={() => setTheme("light")}
              >
                ☀️ Light Mode
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Settings;