import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Inventory from "./pages/Inventory";
import Tables from "./pages/Tables";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Footer from "./components/Footer";

function App() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>

      <Routes>

      <Route
           path="/"
           element={<Navigate to="/login" />}
        />

        <Route
           path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            user?.role === "ADMIN"
              ? <Dashboard />
              : <Navigate to="/menu" />
          }
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/reservations"
          element={<Reservations />}
        />

       <Route
  path="/inventory"
  element={
    ["ADMIN","MANAGER"].includes(user?.role)
      ? <Inventory />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/tables"
  element={
    ["ADMIN","MANAGER"].includes(user?.role)
      ? <Tables />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/analytics"
  element={<Analytics />}
/>
<Route
  path="/settings"
  element={<Settings />}
/>

      </Routes>
      <Footer />

    </BrowserRouter>
  );
}

export default App;
