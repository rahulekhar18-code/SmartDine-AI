import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../assets/Tables.css";

function Tables() {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingTable, setEditingTable] = useState(null);

  const [tableNo, setTableNo] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  const fetchTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data.tables);
    } catch (error) {
      console.log(error);
    }
  };
  const openEditModal = (table) => {
    setEditingTable(table);

    setTableNo(table.tableNo);
    setCapacity(table.capacity);
    setStatus(table.status);

    setShowModal(true);
  };
  const filteredTables = tables.filter((table) =>
    table.tableNo.toString().includes(search),
  );

  const availableTables = tables.filter((t) => t.status === "AVAILABLE").length;

  const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;

  const reservedTables = tables.filter((t) => t.status === "RESERVED").length;
  const handleAddTable = async () => {
    try {
      await api.post("/tables", {
        tableNo: Number(tableNo),
        capacity: Number(capacity),
        status,
      });

      window.dispatchEvent(new Event("sidebar-update"));
      setShowModal(false);

      setTableNo("");
      setCapacity("");
      setStatus("AVAILABLE");

      fetchTables();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditTable = async () => {
    try {
      await api.put(`/tables/${editingTable.id}`, {
        tableNo: Number(tableNo),
        capacity: Number(capacity),
        status,
      });
      window.dispatchEvent(
        new CustomEvent("sidebar-update", {
          detail: {
            type: "table",
          },
        }),
      );
      setShowModal(false);
      setEditingTable(null);

      fetchTables();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteTable = async (id) => {
    const confirmDelete = window.confirm("Delete Table ?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/tables/${id}`);
      window.dispatchEvent(
        new CustomEvent("sidebar-update", {
          detail: {
            type: "table",
          },
        }),
      );

      fetchTables();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await fetchTables();
    };

    loadData();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="tables-container">
        <div className="reservation-hero">
          <div>
            <h1 className="hero-title">🍽 Restaurant Tables</h1>

            <p className="hero-subtitle">
              Manage table availability, reservations and occupancy in
              real-time.
            </p>
          </div>

          <div className="hero-actions">
            <input
              type="text"
              placeholder="🔍 Search Table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hero-search"
            />

            <button
              className="hero-add-btn"
              onClick={() => {
                setEditingTable(null);
                setShowModal(true);
              }}
            >
              ➕ Add Table
            </button>
          </div>
        </div>

        <div className="tab-stats">
          <div className="tab-stat-card">
            <h2>{tables.length}</h2>
            <p>Total Tables</p>
          </div>

          <div className="tab-stat-card">
            <h2>{availableTables}</h2>
            <p>Available</p>
          </div>

          <div className="tab-stat-card">
            <h2>{occupiedTables}</h2>
            <p>Occupied</p>
          </div>

          <div className="tab-stat-card">
            <h2>{reservedTables}</h2>
            <p>Reserved</p>
          </div>
        </div>

        <div className="tab-grid">
          {filteredTables.map((table) => (
            <div className="tab-card" key={table.id}>
              <h2>Table #{table.tableNo}</h2>

              <h3>Capacity : {table.capacity}</h3>

              <span
                className={
                  table.status === "AVAILABLE"
                    ? "tab-status-green"
                    : table.status === "OCCUPIED"
                      ? "tab-status-orange"
                      : "tab-status-yellow"
                }
              >
                {table.status}
              </span>

              <div className="tab-btns">
                <button
                  className="tab-edit-btn"
                  onClick={() => openEditModal(table)}
                >
                  Edit
                </button>

                <button
                  className="tab-delete-btn"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="tab-modal">
            <div className="tab-modal-content">
              <h2>{editingTable ? "Edit Table" : "Add Table"}</h2>

              <input
                type="number"
                placeholder="Table Number"
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="AVAILABLE">AVAILABLE</option>

                <option value="OCCUPIED">OCCUPIED</option>

                <option value="RESERVED">RESERVED</option>
              </select>

              <div className="tab-modal-buttons">
                <button
                  className="tab-save-btn"
                  onClick={editingTable ? handleEditTable : handleAddTable}
                >
                  Save
                </button>

                <button
                  className="tab-cancel-btn"
                  onClick={() => setShowModal(false)}
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

export default Tables;
