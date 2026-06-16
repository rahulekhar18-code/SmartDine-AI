import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/Analytics.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
function Analytics() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [stats, setStats] = useState({});
  // const [inventory, setInventory] = useState([]);
  const [date, setDate] = useState(new Date());
  const [staffs, setStaffs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [staffForm, setStaffForm] = useState({
    name: "",
    position: "",
    phone: "",
    whatsapp: "",
  });
  const deleteStaff = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/staff/${id}`);

      setStaffs(staffs.filter((staff) => staff.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const saveStaff = async () => {
    try {
      if (editId) {
        await api.put(`/staff/${editId}`, staffForm);
      } else {
        await api.post("/staff", staffForm);
      }

      fetchData();

      setShowModal(false);

      setEditId(null);
      setStaffForm({
        name: "",
        position: "",
        phone: "",
        whatsapp: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const askAI = () => {
    if (question.toLowerCase().includes("sales")) {
      setAnswer("Add combo meals and weekend offers.");
    } else {
      setAnswer("SmartDine AI recommendation available.");
    }
  };
  const fetchData = async () => {
    try {
      const dashboard = await api.get("/dashboard");
      setStats(dashboard.data.stats);

      const inv = await api.get("/inventory");
      // setInventory(inv.data.inventory);

      const lowStock = inv.data.inventory.filter(
        (item) => item.quantity <= item.threshold,
      );

      setLowStockItems(lowStock);

      const staff = await api.get("/staff");
      setStaffs(staff.data);

      const feedback = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSUux4E5Ru0Cqk4lvFCJ6LyLUBcrDyWrv5mmhSlJdyrL5MrKfnTcp7BL2Pi-KF7APetxZcPKiWyw5K7lJ0kop52jhRKUOcUBO2Xa2qudWsD9jyVrY6iku-GBazgAmm1tDfZQkWG1YKSDTg1GhsdfEwa0Hz1ZeoBh2BIlgZ6lT_Ry_EzPTgbOFMJLe4WSsXGV-DRZFiaJ5JdICyU5bzuHw_G_R4Hu41Ho7-tKrKGY5-EDlvWCOl2_W4d8ftOktS9nktvQKi2BmF62P2pm2E&lib=M2wgsIQHbG4bUrpmyPKOTtjY1r34qOMV5",
      );

      const data = await feedback.json();


      setFeedbacks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };

    loadData();
  }, []);

  const expectedRevenue = (stats.totalReservations || 0) * 700;

  const expectedReservations = (stats.totalReservations || 0) + 8;

  const chefs = Math.ceil(expectedReservations / 20);

  const waiters = Math.ceil(expectedReservations / 10);

  const foodCost = (stats.totalInventoryItems || 0) * 100;

  const profit = expectedRevenue - foodCost;

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      "https://docs.google.com/forms/d/e/1FAIpQLSc8N_ewYyMq6KzfoX6rLM5BXfxU3ZtKBanlSy2PpQPiEwdwcA/viewform?pli=1&pli=1",
    );
    alert("✅ Link Copied Successfully!");
  };

  return (
    <>
      <Sidebar />
      {showModal && (
        <div className="staff-modal">
          <div className="staff-modal-content">
            <h2>Add Staff</h2>

            <input
              placeholder="Name"
              value={staffForm.name}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Position"
              value={staffForm.position}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  position: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={staffForm.phone}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="WhatsApp"
              value={staffForm.whatsapp}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  whatsapp: e.target.value,
                })
              }
            />

            <button onClick={saveStaff}>Save</button>

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="analytics-container">
        <div className="analytics-hero">
          <h1>🤖 SmartDine AI Analytics</h1>

          <p>AI-powered restaurant insights and business recommendations.</p>
        </div>
        <div className="section-one">
          <div className="top-row">
            <div className="analytics-card calendar-card">
              <h2>📅 Restaurant Calendar</h2>
              <div className="calendar-card-content">
                <div className="calendar-left">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    showNeighboringMonth={false}
                    tileClassName={({ date, view }) => {
                      if (view !== "month") return null;

                      const lastDay = new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        0,
                      ).getDate();

                      if (date.getDate() === lastDay) return "holiday-red";

                      if (date.getDay() === 6) return "peak-day";

                      return null;
                    }}
                  />
                </div>

                <div className="calendar-right">
                  <h3> #Restaurant Operations :</h3>
                  <div className="info-card green">
                    <h4>🟢 Open Daily</h4>
                    <p>09:00 AM - 11:00 PM</p>
                  </div>

                  <div className="info-card red">
                    <h4>🔴 Monthly Closure</h4>
                    <p>Last Day Of Every Month</p>
                  </div>

                  <div className="info-card orange">
                    <h4>🎨 Holi Holiday</h4>
                    <p>Restaurant Closed</p>
                  </div>

                  <div className="info-card purple">
                    <h4>🪔 Diwali</h4>
                    <p>Half Day Service</p>
                  </div>

                  <div className="info-card blue">
                    <h4>📈 Peak Day</h4>
                    <p>Saturday</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="staff-header">
                <h2>👨‍🍳 Staff Management</h2>

                <div className="staff-actions">
                  <button
                    className="add-btn"
                    onClick={() => {
                      setEditId(null);

                      setStaffForm({
                        name: "",
                        position: "",
                        phone: "",
                        whatsapp: "",
                      });

                      setShowModal(true);
                    }}
                  >
                    + Add Staff
                  </button>
                </div>
              </div>

              <div className="staff-table">
                <div className="staff-table-header">
                  <span>Name</span>
                  <span>Position</span>
                  <span>Phone</span>
                  <span>WhatsApp</span>
                  <span>Actions</span>
                </div>

                {staffs.map((staff) => (
                  <div key={staff.id} className="staff-row">
                    <span>{staff.name}</span>

                    <span>{staff.position}</span>

                    <span>{staff.phone}</span>

                    <span>
                      <a
                        href={`https://wa.me/91${staff.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="whatsapp-btn"
                      >
                        WhatsApp
                      </a>
                    </span>

                    <span className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditId(staff.id);

                          setStaffForm({
                            name: staff.name,
                            position: staff.position,
                            phone: staff.phone,
                            whatsapp: staff.whatsapp,
                          });

                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteStaff(staff.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="feedback-row">
            <div className="analytics-card feedback-card">
              <h2>📝 Customer Feedback</h2>
              <div className="feedback-layout">
                <div className="feedback-left">
                  <img src="/qr/qr1.png" alt="QR" className="feedback-qr" />
                </div>

                <div className="feedback-right">
                  <h4>🔗 Share Feedback Link</h4>

                  <input
                    value="https://docs.google.com/forms/d/e/1FAIpQLSc8N_ewYyMq6KzfoX6rLM5BXfxU3ZtKBanlSy2PpQPiEwdwcA/viewform?pli=1&pli=1"
                    readOnly
                    className="feedback-link"
                  />

                  <button className="share-btn" onClick={copyLink}>
                    Copy Link
                  </button>
                  <div className="recent-feedback">
                    <h4>⭐ Recent Feedback</h4>

                    {feedbacks.map((item, index) => (
                      <div key={index} className="review-card">
                        <strong>{item.customerName}</strong>

                        <div className="rating">
                          ⭐ {item.overallExperience}/5
                        </div>

                        <div className="item">🍽️ {item.favoriteItem}</div>

                        <div className="suggestion">💬 {item.suggestion}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="feedback-buttons">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSc8N_ewYyMq6KzfoX6rLM5BXfxU3ZtKBanlSy2PpQPiEwdwcA/viewform?pli=1&pli=1"
                  className="feedback-btn"
                >
                  Submit Feedback
                </a>

                <a
                  href="https://docs.google.com/spreadsheets/d/1Ih1sD5QJBA9iwIrlwhvbKMz7NCf50Is0u6KvuJyfLig/edit?resourcekey=&gid=2086227389#gid=2086227389"
                  className="view-feedback-btn"
                >
                  View Responses
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="section-two">
          <div className="forecast-row">
            <div className="analytics-card">
              <h2>📈 Revenue Forecast</h2>
              <h1>₹{expectedRevenue}</h1>
              <p>Expected Revenue</p>
            </div>

            <div className="analytics-card">
              <h2>📅 Reservation Forecast</h2>
              <h1>{expectedReservations}</h1>
              <p>Expected Reservations</p>
            </div>

            <div className="analytics-card inventory-card">
              <div className="inventory-header">
                <h2>📦 Inventory Alert</h2>

                <span className="alert-badge">{lowStockItems.length}</span>
              </div>

              {lowStockItems.length > 0 ? (
                <div className="inventory-list">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className={`inventory-alert-item ${
                        item.quantity <= item.threshold / 2
                          ? "critical"
                          : "warning"
                      }`}
                    >
                      <div className="item-info">
                        <h3>{item.itemName}</h3>
                        <p>Threshold : {item.threshold}</p>
                      </div>

                      <div
                        className={`stock-count ${
                          item.quantity <= item.threshold / 2
                            ? "critical"
                            : "warning"
                        }`}
                      >
                        {item.quantity} Left
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="healthy-stock">✅ All Inventory Healthy</div>
              )}
            </div>
          </div>

          <div className="planning-row">

  <div className="analytics-card staff-card">
    <h2>👨‍🍳 Staff Planning</h2>

    <div className="staff-grid">
      <div className="staff-box">
        <span>Chefs</span>
        <h3>{chefs}</h3>
      </div>

      <div className="staff-box">
        <span>Waiters</span>
        <h3>{waiters}</h3>
      </div>

      <div className="staff-box">
        <span>Cashiers</span>
        <h3>2</h3>
      </div>
    </div>
  </div>

  <div className="analytics-card menu-card">
    <h2>🍽️ Menu Suggestions</h2>

    <div className="menu-list">
      <div className="menu-item">🍕 Paneer Tikka Pizza</div>
      <div className="menu-item">🍟 Peri Peri Fries</div>
      <div className="menu-item">🥭 Mango Milkshake</div>
      <div className="menu-item">☕ Cold Coffee</div>
    </div>
  </div>

  <div className="analytics-card profit-card">
    <h2>💰 Profit Analyzer</h2>

    <div className="profit-center">
      <h1>₹{profit}</h1>

      <div className="profit-stats">
        <div>
          <span>Revenue</span>
          <strong>₹{expectedRevenue}</strong>
        </div>

        <div>
          <span>Food Cost</span>
          <strong>₹{foodCost}</strong>
        </div>
      </div>
    </div>
  </div>

</div>
        </div>

        <div className="section-three">
          <div className="bottom-row">
            <div className="analytics-card">
              <h2>🏢 Restaurant Information</h2>

              <p>
                <strong>Name:</strong> SmartDine
              </p>

              <p>
                <strong>Owner:</strong> Rahul
              </p>

              <p>
                <strong>Location:</strong> Nagpur
              </p>

              <p>
                <strong>Contact:</strong> 9876543210
              </p>

              <p>
                <strong>Working Hours:</strong> 9 AM - 11 PM
              </p>
            </div>

            <div className="analytics-card chatbot-card">
              <h2>🤖 SmartDine Assistant</h2>

              <input
                className="chat-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything..."
              />

              <button className="ask-btn" onClick={askAI}>
                Ask AI
              </button>

              <div className="chat-answer">{answer}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
