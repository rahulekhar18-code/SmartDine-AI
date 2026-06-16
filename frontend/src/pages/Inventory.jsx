import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../assets/Inventory.css";
function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
const [editingItem, setEditingItem] = useState(null);

const [formData, setFormData] = useState({
  itemName: "",
  quantity: "",
  threshold: ""
});

const fetchInventory = async () => {
  try {
    const res = await api.get("/inventory");


    setInventory(res.data.inventory);
  } catch (error) {
    console.log(error);
  }
};const handleSave = async () => {
  try {

    if (editingItem) {

      await api.put(
        `/inventory/${editingItem.id}`,
        {
          itemName: formData.itemName,
          quantity: Number(formData.quantity),
          threshold: Number(formData.threshold)
        }
      );

    } else {

      await api.post(
        "/inventory",
        {
          itemName: formData.itemName,
          quantity: Number(formData.quantity),
          threshold: Number(formData.threshold)
        }
      );

    }

window.dispatchEvent(
  new CustomEvent("sidebar-update", {
    detail: {
      type: "inventory"
    }
  })
);
    await fetchInventory();
    setEditingItem(null);

setFormData({
  itemName: "",
  quantity: "",
  threshold: ""
});

    setShowForm(false);

  } catch (error) {
    console.log(error);
  }
};
const totalItems = inventory.length;

const lowStockItems = inventory.filter(
  item => item.quantity <= item.threshold * 2
).length;

const healthyItems = inventory.filter(
  item => item.quantity > item.threshold * 2
).length;

const totalValue = inventory.reduce(
  (sum, item) => sum + item.quantity * 100,
  0
);

const filteredInventory = inventory.filter(item =>
  item.itemName
    .toLowerCase()
    .includes(search.toLowerCase())
);
 useEffect(() => {
  const loadData = async () => {
    await fetchInventory();
  };

  loadData();
}, []);

  return (
    <>
      <Sidebar />

    <div className="inv-container">

<div className="inv-reservation-hero">

  <div>
    <h1 className="inv-hero-title">
      📦 Inventory Management
    </h1>

    <p className="inv-hero-subtitle">
      Track stock levels, monitor low inventory and manage supplies efficiently.
    </p>
  </div>

  <div className="inv-hero-actions">

    <input
      type="text"
      placeholder="🔍 Search inventory..."
      className="inv-hero-search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <button
      className="inv-hero-add-btn"
      onClick={() => {
        setEditingItem(null);
        setFormData({
          itemName: "",
          quantity: "",
          threshold: ""
        });
        setShowForm(true);
      }}
    >
      ➕ Add Item
    </button>

  </div>

</div>

  <div className="inv-stats">

    <div className="inv-stat-card">
      <h2>{totalItems}</h2>
      <p>Total Items</p>
    </div>

    <div className="inv-stat-card warning">
      <h2>{lowStockItems}</h2>
      <p>Low Stock</p>
    </div>

    <div className="inv-stat-card success">
      <h2>{healthyItems}</h2>
      <p>Healthy Items</p>
    </div>

    <div className="inv-stat-card revenue">
      <h2>₹{totalValue}</h2>
      <p>Inventory Value</p>
    </div>

  </div>

  <div className="inv-grid">

    {filteredInventory.map((item) => {

      const percentage =
        Math.min(
          (item.quantity / (item.threshold * 5)) * 100,
          100
        );

      const status =
        item.quantity <= item.threshold
          ? "Critical"
          : item.quantity <= item.threshold * 2
          ? "Low Stock"
          : "Healthy";
      return (  

        <div
          className="inv-card"
          key={item.id}
        >

          <h3>{item.itemName}</h3>
          <button
  className="inv-edit-btn"
  onClick={() => {
    setEditingItem(item);

    setFormData({
      itemName: item.itemName,
      quantity: Number(item.quantity),
      threshold: Number(item.threshold)
    });
   window.dispatchEvent(
  new CustomEvent("sidebar-update", {
    detail: {
      type: "inventory"
    }
  })
);

    setShowForm(true);
  }}
>
  Edit
</button>
<button
  className="inv-delete-btn"
  onClick={async () => {

    if (!window.confirm("Delete Item ?"))
      return;

    await api.delete(
      `/inventory/${item.id}`
    );
window.dispatchEvent(
  new CustomEvent("sidebar-update", {
    detail: {
      type: "inventory"
    }
  })
);
    fetchInventory();

  }}
>
  Delete
</button>

          <div className="inv-qty">
            Stock: {item.quantity}
          </div>

          <div className="inv-progress">

            <div
              className="inv-progress-fill"
              style={{
                width: `${percentage}%`
              }}
            />

          </div>

          <div className="inv-threshold">
            Threshold: {item.threshold}
          </div>

          <div
            className={`inv-status ${
              status === "Healthy"
                ? "healthy"
                : status === "Low Stock"
                ? "low"
                : "critical"
            }`}
          >
            {status}
          </div>

        </div>

      );
      
    })}

  </div>
{showForm && (
  <div className="inv-modal">
    <div className="inv-modal-content">

      <h2>
        {editingItem ? "Edit Item" : "Add Item"}
      </h2>

      <input
        type="text"
        placeholder="Item Name"
        value={formData.itemName}
        onChange={(e) =>
          setFormData({
            ...formData,
            itemName: e.target.value
          })
        }
      />

      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) =>
          setFormData({
            ...formData,
            quantity: Number(e.target.value)
          })
        }
      />

      <input
        type="number"
        placeholder="Threshold"
        value={formData.threshold}
        onChange={(e) =>
          setFormData({
            ...formData,
            threshold: Number(e.target.value)
          })
        }
      />

      <div className="inv-modal-actions">
<button
  className="inv-save-btn"
  onClick={handleSave}
>
  Save
</button>


        <button
          className="inv-cancel-btn"
          onClick={() => setShowForm(false)}
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



export default Inventory;