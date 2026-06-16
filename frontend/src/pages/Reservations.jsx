import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../assets/Reservations.css";

function Reservations() {

  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newReservation, setNewReservation] = useState({
  customerName: "",
  phone: "",
  reservationTime: "",
  status: "BOOKED",
});
const [showEditForm, setShowEditForm] = useState(false);

const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data.reservations);
    } catch (error) {
      console.log(error);
    }
  };
const handleAddReservation = async () => {
  const year = new Date(
    newReservation.reservationTime
  ).getFullYear();

  if (year < 1000 || year > 9999) {
    alert("Year must be 4 digits");
    return;
  }

  try {
    await api.post("/reservations", {
      customerName:
        newReservation.customerName,
      phone: newReservation.phone,
      reservationTime:
        newReservation.reservationTime,
      status: newReservation.status,
    });

    await fetchReservations();

    window.dispatchEvent(
      new CustomEvent("sidebar-update", {
        detail: {
          type: "reservation",
        },
      })
    );

    setShowForm(false);

    setNewReservation({
      customerName: "",
      phone: "",
      reservationTime: "",
      status: "BOOKED",
    });

  } catch (error) {
    console.log(error);
  }
};
const handleDeleteReservation = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this reservation?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/reservations/${id}`);
    window.dispatchEvent(
  new CustomEvent("sidebar-update", {
    detail: {
      type: "reservation"
    }
  })
);

    await fetchReservations();

    alert("Reservation Deleted Successfully");

  } catch (error) {

    console.log(error);
    alert("Delete Failed");

  }
};
const handleUpdateReservation = async () => {
  const year = new Date(
  selectedReservation.reservationTime
).getFullYear();

if (year < 1000 || year > 9999) {
  alert("Year must be 4 digits");
  return;
}
  try {

    await api.put(
      `/reservations/${selectedReservation.id}`,
      {
        customerName: selectedReservation.customerName,
        phone: selectedReservation.phone,
        reservationTime: selectedReservation.reservationTime,
        status: selectedReservation.status,
      }
    );

    window.dispatchEvent(
  new CustomEvent("sidebar-update", {
    detail: {
      type: "reservation"
    }
  })
);

    await fetchReservations();

    setShowEditForm(false);

    alert("Reservation Updated Successfully");

  } catch (error) {

    console.log(error);
    alert("Update Failed");

  }
};
 useEffect(() => {
  const loadData = async () => {
    try {
      await fetchReservations();
    } catch (err) {
      console.log(err);
    }
  };

  loadData();
}, []);

  const filteredReservations = reservations.filter((r) => {

    const matchesSearch =
      r.customerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      r.phone.includes(search);

    const matchesStatus =
      statusFilter === ""
        ? true
        : r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalReservations = reservations.length;

  const bookedCount = reservations.filter(
    (r) => r.status === "BOOKED"
  ).length;

  const pendingCount = reservations.filter(
    (r) => r.status === "PENDING"
  ).length;

  const confirmedCount = reservations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;

  return (
    <>
      <Sidebar />

      <div
        className="res-dashboard-container"
        style={{
          marginLeft: "300px",
          padding: "30px",
        }}
      >
        {showEditForm && (
  <div className="res-popup-overlay">
    <div className="res-popup-form">

      <h2>Edit Reservation</h2>

      <input
        type="text"
        value={selectedReservation.customerName}
        onChange={(e) =>
          setSelectedReservation({
            ...selectedReservation,
            customerName: e.target.value,
          })
        }
      />

      <input
        type="text"
        value={selectedReservation.phone}
        onChange={(e) =>
          setSelectedReservation({
            ...selectedReservation,
            phone: e.target.value,
          })
        }
      />

      <input
        type="datetime-local"
        value={selectedReservation.reservationTime}
        onChange={(e) =>
          setSelectedReservation({
            ...selectedReservation,
            reservationTime: e.target.value,
          })
        }
      />

      <select
        value={selectedReservation.status}
        onChange={(e) =>
          setSelectedReservation({
            ...selectedReservation,
            status: e.target.value,
          })
        }
      >
        <option value="BOOKED">BOOKED</option>
        <option value="PENDING">PENDING</option>
        <option value="CONFIRMED">CONFIRMED</option>
      </select>

      <div className="res-popup-buttons">
        <button
          className="res-edit-btn"
          onClick={handleUpdateReservation}
        >
          Update
        </button>

        <button
          className="res-delete-btn"
          onClick={() => setShowEditForm(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

        {/* HEADER */}

      <div className="res-top-header">

  <div className="res-title-section">

    <h1>
      📅 Reservations
    </h1>

  <p className="res-subtitle">
  Smart reservation management with real-time booking updates.
</p>

  </div>

  <div className="res-header-controls">
<div className="res-search-box">
  <input
    type="text"
    placeholder="🔎 Search customer..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

    <select
      className="res-filter"
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
    >
      <option value="">
        All Status
      </option>

      <option value="BOOKED">
        Booked
      </option>

      <option value="PENDING">
        Pending
      </option>

      <option value="CONFIRMED">
        Confirmed
      </option>
    </select>

    <button
      className="res-add-btn"
      onClick={() => setShowForm(true)}
    >
      ➕ New Reservation
    </button>

  </div>

</div>

        {/* SUMMARY CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "15px",
            marginBottom: "25px"
          }}
        >

<div className="res-stat-card total-card">            <h3>Total</h3>
            <h1>{totalReservations}</h1>
          </div>

<div className="res-stat-card booked-card">            <h3>Booked</h3>
            <h1 style={{ color: "#00ff88" }}>
              {bookedCount}
            </h1>
          </div>

<div className="res-stat-card pending-card">            <h3>Pending</h3>
            <h1 style={{ color: "#ffb300" }}>
              {pendingCount}
            </h1>
          </div>

<div className="res-stat-card confirmed-card">            <h3>Confirmed</h3>
            <h1 style={{ color: "#4da6ff" }}>
              {confirmedCount}
            </h1>
          </div>

        </div>

        {/* RESERVATION CARDS */}
<div className="res-reservation-header">
  <div>Customer</div>
  <div>Phone</div>
  <div>Date & Time</div>
  <div>Status</div>
  <div>Actions</div>
</div>
        <div className="res-table-container">

          {filteredReservations.map((r) => (

            <div className="res-card" key={r.id}>

  
<div className="res-customer">
  <div
    className="res-avatar"
    style={{
      background: [
        "linear-gradient(135deg,#3b82f6,#8b5cf6)",
        "linear-gradient(135deg,#10b981,#06b6d4)",
        "linear-gradient(135deg,#f59e0b,#ef4444)",
        "linear-gradient(135deg,#ec4899,#8b5cf6)"
      ][r.id % 4]
    }}
  >
    {r.customerName.charAt(0).toUpperCase()}
  </div>

  <span className="res-customer-name">
    {r.customerName}
  </span>
</div>


  <p>📞 {r.phone}</p>

  <p>
    ⏰ {new Date(r.reservationTime).toLocaleString()}
  </p>

 <span
  className={`res-status-badge ${
    r.status.toLowerCase()
  }`}
>
  {r.status}
</span>

  {/* YAHAN ADD KARNA HAI */}
  <div className="res-card-actions">

  <button
  className="res-edit-btn"
  onClick={() => {
    setSelectedReservation({
      ...r,
      reservationTime: r.reservationTime.slice(0, 16),
    });

    setShowEditForm(true);
  }}
>
  Edit
</button>
   <button
  className="res-delete-btn"
  onClick={() => handleDeleteReservation(r.id)}
>
   Delete
</button>
 <a
    href={`tel:${r.phone}`}
    className="res-call-btn"
  >
    📞 Call
  </a>

  <a
    href={`https://wa.me/91${r.phone}?text=
Hello ${r.customerName},

Your reservation is currently ${r.status}.

Date: ${new Date(r.reservationTime).toLocaleString()}

Thank you for choosing SmartDine.
`}
    target="_blank"
    rel="noopener noreferrer"
    className="res-whatsapp-btn"
  >
    💬 WhatsApp
  </a>

  </div>

</div>

          ))}

        </div>
{showForm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >

    <div
      style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "15px",
        width: "400px",
      }}
    >

      <h2>Add Reservation</h2>

      <input
        type="text"
        placeholder="Customer Name"
        value={newReservation.customerName}
        onChange={(e) =>
          setNewReservation({
            ...newReservation,
            customerName: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="text"
        placeholder="Phone"
        value={newReservation.phone}
        onChange={(e) =>
          setNewReservation({
            ...newReservation,
            phone: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="datetime-local"
        value={newReservation.reservationTime}
        onChange={(e) =>
          setNewReservation({
            ...newReservation,
            reservationTime: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <select
        value={newReservation.status}
        onChange={(e) =>
          setNewReservation({
            ...newReservation,
            status: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <option value="BOOKED">BOOKED</option>
        <option value="PENDING">PENDING</option>
        <option value="CONFIRMED">CONFIRMED</option>
      </select>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleAddReservation}
          style={{
            flex: 1,
            background: "#f59e0b",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          Save
        </button>

        <button
          onClick={() => setShowForm(false)}
          style={{
            flex: 1,
            background: "#ef4444",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
      </div>
    </>
  );
}

export default Reservations;