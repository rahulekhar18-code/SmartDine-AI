import { useEffect, useState, useCallback } from "react";

// import { useEffect, useState } from "react";
import api from "../services/api";
// import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import socket from "../socket";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };
const markAllAsRead = useCallback(async () => {
  try {
    const unread = notifications.filter(
      (n) => !n.isRead
    );

    for (const n of unread) {
      await api.put(
        `/notifications/${n.id}/read`
      );
    }

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
  } catch (error) {
    console.log(error);
  }
}, [notifications]);


  const fetchActivities = async () => {
    try {
      const res = await api.get("/activity");

      setActivities(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const barData = [
    {
      name: "Users",
      value: stats.totalUsers || 0,
    },
    {
      name: "Menu",
      value: stats.totalMenuItems || 0,
    },
    {
      name: "Reservations",
      value: stats.totalReservations || 0,
    },
    {
      name: "Inventory",
      value: stats.totalInventoryItems || 0,
    },
  ];

const pieData = [
  {
    name: "Booked",
    value: stats.bookedCount || 0,
  },
  {
    name: "Confirmed",
    value: stats.confirmedCount || 0,
  },
  {
    name: "Pending",
    value: stats.pendingCount || 0,
  },
];

  const revenueData = [
    { day: "Mon", revenue: 12000 },
    { day: "Tue", revenue: 18000 },
    { day: "Wed", revenue: 22000 },
    { day: "Thu", revenue: 15000 },
    { day: "Fri", revenue: 30000 },
    { day: "Sat", revenue: 45000 },
    { day: "Sun", revenue: 35000 },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role !== "ADMIN") {
      window.location.href = "/menu";
    }
    const loadData = async () => {
      await fetchDashboard();
      await fetchActivities();
      await fetchNotifications();
    };

    loadData();
  }, []);
  useEffect(() => {
    
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);
useEffect(() => {
  document.body.style.overflow =
    showNotifications ? "hidden" : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showNotifications]);
  return (
    <>
      <Sidebar />

      <div className="dashboard-container">
        <div
          style={{
            background: "#1e293b",
            padding: "40px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>Welcome Back, Admin 👋</h1>

              <p>Monitor restaurant performance in real-time</p>

              <span>{new Date().toDateString()}</span>
            </div>

            <div className="header-right">
              <div
                className="notification"
onClick={async () => {
  const nextState = !showNotifications;

  setShowNotifications(nextState);

  if (nextState) {
    await markAllAsRead();
  }
}}       >
                🔔
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
                
                  
              </div>

              <div className="user-chip">Admin</div>

              <div className="header-btns">
                <button>Add Menu</button>
                <button>New Reservation</button>
              </div>
            </div>
            {showNotifications && (
  <div
    className="notification-modal-overlay"
    onClick={() => setShowNotifications(false)}
  >
    <div
      className="notification-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="notification-modal-header">
        <div>
          <h2>🔔 Notifications</h2>
          <p>{notifications.length} Total Notifications</p>
        </div>

        <button
          className="clear-btn"
          onClick={() => {
            setNotifications([]);
          }}
        >
          Clear All
        </button>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            🔕 No Notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${n.type}`}
            >
              <div className="notification-icon">
                {n.type === "SUCCESS" && "✅"}
                {n.type === "INFO" && "ℹ️"}
                {n.type === "DELETE" && "🗑"}
                {n.type === "WARNING" && "⚠️"}
              </div>

              <div className="notification-content">
                <p>{n.message}</p>

                <small>
                  {new Date(
                    n.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}      
          </div>
        </div>
        <div className="quick-stats">
          <div>
            <h3>127</h3>
            <span>Orders Today</span>
          </div>

          <div>
            <h3>58</h3>
            <span>Customers</span>
          </div>

          <div>
            <h3>4.8 ⭐</h3>
            <span>Rating</span>
          </div>

          <div>
            <h3>₹45K</h3>
            <span>Revenue</span>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card users">
            <h4>Total Users</h4>
            <h1>{stats.totalUsers || 0}</h1>
            <span>Registered Users</span>
          </div>

          <div className="stat-card menu">
            <h4>Menu Items</h4>
            <h1>{stats.totalMenuItems || 0}</h1>
            <span>Available Dishes</span>
          </div>

          <div className="stat-card reservations">
            <h4>Reservations</h4>
            <h1>{stats.totalReservations || 0}</h1>
            <span>Active Bookings</span>
          </div>

          <div className="stat-card inventory">
            <h4>Inventory</h4>
            <h1>{stats.totalInventoryItems || 0}</h1>
            <span>Stock Items</span>
          </div>

          <div className="stat-card revenue">
            <h4>Revenue</h4>
            <h1>₹{stats.totalRevenue?.toLocaleString() || "0"}</h1>
            <span>Today's Sales</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2>📈 Business Overview</h2>

            <div className="overview-list">
              <p>👥 Users : {stats.totalUsers}</p>
              <p>🍽 Menu Items : {stats.totalMenuItems}</p>
              <p>📅 Reservations : {stats.totalReservations}</p>
              <p>📦 Inventory : {stats.totalInventoryItems}</p>
            </div>
          </div>

          <div className="dashboard-box">
            <h2>🤖 AI Insight</h2>

            <div className="ai-insight">
              <p>📈 Reservations increased by 18%</p>
              <p>🍕 Top Selling Item: Farmhouse Pizza</p>
              <p>📦 Inventory Status: Healthy</p>
              <p>⭐ Peak Time: 7 PM - 9 PM</p>
            </div>
          </div>
        </div>
        <div className="charts-grid">
          <div className="chart-card">
            <h2>📊 Business Statistics</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>🥧 Reservation Status</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>📈 Revenue Trend</h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-box">
          <h2>🔔 Recent Activity</h2>

          <div className="activity-list">
            {activities.map((log) => (
              <div key={log.id} className="activity-item">
                <strong>{log.user.name}</strong> {log.details}
                <small>{new Date(log.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
