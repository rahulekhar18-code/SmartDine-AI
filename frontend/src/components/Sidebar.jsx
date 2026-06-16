import api from "../services/api";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaTable,
  FaClipboardList,
  FaBoxes,
  FaRobot,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";




function Sidebar() {
  const [reservationCount, setReservationCount] = useState(0);
const [tableCount, setTableCount] = useState(0);
const [inventoryCount, setInventoryCount] = useState(0);
const [tableUpdate, setTableUpdate] = useState(false);
const [reservationUpdate, setReservationUpdate] = useState(false);
const [inventoryUpdate, setInventoryUpdate] = useState(false);

const loadSidebarStats = async () => {
  try {

    const reservations = await api.get("/reservations");
    const tables = await api.get("/tables");
    const inventory = await api.get("/inventory");

    setReservationCount(
      reservations.data.reservations.length
    );

    setTableCount(
      tables.data.tables.length
    );

    setInventoryCount(
      inventory.data.inventory.length
    );

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadSidebarStats();

 const refreshSidebar = (e) => {


  if(e.detail?.type === "table"){
    setTableUpdate(true);
  }

  if(e.detail?.type === "inventory"){
    setInventoryUpdate(true);
  }

  if(e.detail?.type === "reservation"){
    setReservationUpdate(true);
  }
};
  window.addEventListener(
    "sidebar-update",
    refreshSidebar
  );

  return () => {
    window.removeEventListener(
      "sidebar-update",
      refreshSidebar
    );
  };

}, []);


  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ==========================
  // ADMIN MENU
  // ==========================

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />
    },
    {
      name: "Menu",
      path: "/menu",
      icon: <FaUtensils />
    },
    {
      name: "Reservations",
      path: "/reservations",
      icon: <FaClipboardList />
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <FaBoxes />
    },
    {
      name: "Tables",
      path: "/tables",
      icon: <FaTable />
    },
    {
      name: "AI Analytics",
      path: "/analytics",
      icon: <FaRobot />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />
    }
  ];

  // ==========================
  // MANAGER MENU
  // ==========================

  const managerMenu = [
    {
      name: "Menu",
      path: "/menu",
      icon: <FaUtensils />
    },
    {
      name: "Reservations",
      path: "/reservations",
      icon: <FaClipboardList />
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <FaBoxes />
    },
    {
      name: "Tables",
      path: "/tables",
      icon: <FaTable />
    },
    {
      name: "AI Analytics",
      path: "/analytics",
      icon: <FaRobot />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />
    }
  ];

  let menuItems = [];

  if (user?.role === "ADMIN") {
    menuItems = adminMenu;
  } else if (user?.role === "MANAGER") {
    menuItems = managerMenu;
  }

  return (
    <div className="sidebar">

      <h2 className="logo">🍽 SmartDine</h2>

      <div className="admin-profile">
        <img
          src={
  user?.role === "ADMIN"
    ? "https://i.pravatar.cc/150?img=1"
    : "https://i.pravatar.cc/150?img=2"
}
          alt="profile image"
        />

        <h4>{user?.name || "Admin"}</h4>

        <span>
          {user?.role === "ADMIN"
            ? "Restaurant Owner"
            : "Manager"}
        </span>
      </div>

      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
className={({ isActive }) =>
  isActive
    ? "sidebar-link active"
    : "sidebar-link"
}
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}

     <div className="sidebar-stats">

  <div className="mini-card">

  {reservationUpdate && (
    <span className="notify-dot"></span>
  )}

  <div className="mini-icon">📅</div>

  <div>
    <h4>{reservationCount}</h4>
    <p>Reservations</p>
  </div>

</div>

  <div className="mini-card">

  {tableUpdate && (
    <span className="notify-dot"></span>
  )}

  <div className="mini-icon">🍽</div>

  <div>
    <h4>{tableCount}</h4>
    <p>Occupied</p>
  </div>

</div>

  <div className="mini-card">

  {inventoryUpdate && (
    <span className="notify-dot"></span>
  )}

  <div className="mini-icon">📦</div>

  <div>
    <h4>{inventoryCount}</h4>
    <p>Inventory</p>
  </div>

</div>

  {user?.role === "ADMIN" && (
    <div className="mini-card revenue-card disabled-revenue">

  <div className="mini-icon">
    💰
  </div>

  <div>
    <h4>₹15K</h4>

    <p>Revenue</p>

    <small>
      ⚠ Manual Mode
    </small>
  </div>

</div>
  )}

</div>

      <div className="logout-section">
  <button
  className="logout-btn"
  onClick={handleLogout}
>
  <FaSignOutAlt className="logout-icon" />
  <span>Logout</span>
</button>
</div>

    </div>
  );
}

export default Sidebar;