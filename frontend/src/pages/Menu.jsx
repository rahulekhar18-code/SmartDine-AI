import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showForm, setShowForm] = useState(false);
 
  const [newItem, setNewItem] = useState({
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: ""
});
const getFoodImage = (item) => {
  const name = item.name.toLowerCase();

  if (name.includes("pizza"))
    return "/menu/pizza.jpg";

  if (name.includes("burger"))
    return "/menu/burger.jpg";

  if (name.includes("pasta"))
    return "/menu/pasta.jpg";

  if (name.includes("biryani"))
    return "/menu/biryani.jpg";

  if (name.includes("coffee"))
    return "/menu/coffee.jpg";

  if (name.includes("brownie"))
    return "/menu/brownie.jpg";

  if (name.includes("chicken"))
    return "/menu/chicken.jpg";

  if (name.includes("fried rice"))
    return "/menu/fried-rice.jpg";

  if (name.includes("noodles"))
    return "/menu/noodles.jpg";

  if (name.includes("fish"))
    return "/menu/fish-curry.jpg";

  if (name.includes("ice cream"))
    return "/menu/ice-cream.jpg";

  if (name.includes("gulab"))
    return "/menu/gulab-jamun.jpg";

  if (name.includes("paneer"))
    return "/menu/paneer-tikka.jpg";

  if (name.includes("crispy"))
    return "/menu/crispy-corn.jpg";

  if (name.includes("dal"))
    return "/menu/dal-tadka.jpg";

  if (name.includes("manchurian"))
    return "/menu/manchurian.jpg";

  if (name.includes("lime"))
    return "/menu/limesoda.jpg";

  if (name.includes("mojito"))
    return "/menu/virgin-mojito.jpg";

  if (name.includes("mango"))
    return "/menu/mangoshake.jpg";

  return "/menu/pizza.jpg";
};
  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenuItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this menu item?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/menu/${id}`);

    fetchMenu();

  } catch (error) {
    console.log(error);
  }
};
const handleAddItem = async () => {
  try {

    console.log(newItem); // check imageUrl aa raha hai ya nahi

    await api.post("/menu", {
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      category: newItem.category,
      imageUrl: newItem.imageUrl
    });

    fetchMenu();
    setShowForm(false);

  } catch (error) {
    console.log(error.response?.data);
    console.log(error);
  }
};
const handleEdit = (item) => {

  console.log("EDIT ITEM =", item);

  setNewItem({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl
  });

  setShowForm(true);
};
const handleUpdateItem = async () => {
  try {
    console.log("UPDATE CLICKED");
console.log(newItem);
    await api.put(`/menu/${newItem.id}`, {
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      category: newItem.category,
      imageUrl: newItem.imageUrl
    });

    fetchMenu();

    setShowForm(false);

    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: ""
    });

  } catch (error) {
    console.log(error);
  }
};

 useEffect(() => {
  const loadData = async () => {
    await fetchMenu();
  };

  loadData();
}, []);
const filteredItems = menuItems
  .filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === ""
        ? true
        : item.category === category;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Sidebar />
      {
showForm && (

<div className="popup-overlay">

  <div className="popup-form">

  <h2>
  {newItem.id
    ? "Edit Menu Item"
    : "Add Menu Item"}
</h2>
 <p style={{ color: "white" }}>
    ID : {newItem.id}
  </p>
    <input
  placeholder="Name"
  value={newItem.name}
  onChange={(e)=>
    setNewItem({
      ...newItem,
      name:e.target.value
    })
  }
/>

    <input
      placeholder="Description"
      value={newItem.description}
      onChange={(e)=>
      setNewItem({
        ...newItem,
        description:e.target.value
      })}
    />

    <input
      placeholder="Price"
      value={newItem.price}
      onChange={(e)=>
      setNewItem({
        ...newItem,
        price:Number(e.target.value)
      })}
    />

    <input
      placeholder="Category"
      value={newItem.category}
      onChange={(e)=>
      setNewItem({
        ...newItem,
        category:e.target.value
      })}
    />
    <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewItem({
        ...newItem,
        imageUrl: reader.result
      });
    };

    reader.readAsDataURL(file);

  }}
/>
{newItem.imageUrl && (
  <button
    className="remove-image-btn"
    onClick={() => {
      setNewItem({
        ...newItem,
        imageUrl: ""
      });
    }}
  >
    ❌ Remove Image
  </button>
)}
{newItem.imageUrl && (
  <img
    src={newItem.imageUrl}
    alt="preview"
    style={{
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "12px",
      marginTop: "10px"
    }}
  />
)}
<div className="menu-form-buttons">

  <button
    className="save-btn"
    onClick={
      newItem.id
        ? handleUpdateItem
        : handleAddItem
    }
  >
    {
      newItem.id
        ? "Update Item"
        : "Save Item"
    }
  </button>

  <button
    className="cancel-btn"
    onClick={() => {
      setShowForm(false);

      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
      });

      // setPreview(null); // agar preview state hai
      // setImage(null);   // agar image state hai
    }}
  >
    Cancel
  </button>

</div>

  </div>

</div>

)}
       <div className="menu-topbar">

  <div className="search-box">
    <input
      type="text"
      placeholder="🔍 Search dishes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="filter-group">

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      <option value="Pizza">🍕 Pizza</option>
      <option value="Burger">🍔 Burger</option>
      <option value="Main Course">🍛 Main Course</option>
      <option value="Chinese">🥡 Chinese</option>
      <option value="Dessert">🍰 Dessert</option>
      <option value="Beverage">🥤 Beverage</option>
    </select>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="">Sort By</option>
      <option value="low">💰 Price Low → High</option>
      <option value="high">💎 Price High → Low</option>
    </select>
<button
  className="add-item-btn"
  onClick={() => setShowForm(true)}
>
  + Add Item
</button>

  </div>

</div>
     <div
  className="cards menu-cards"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px"
  }}
>
  {filteredItems.map((item) => (
    <div
      key={item.id}
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}
    >
    <img
  src={
    item.imageUrl?.startsWith("data:image")
      ? item.imageUrl
      : getFoodImage(item)
  }
  alt={item.name}
  onError={(e) => {
    e.target.src = "/menu/pizza.jpg";
  }}
  style={{
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px"
  }}
/>

      <h2 style={{ marginTop: "15px" }}>
        {item.name}
      </h2>

      <p>{item.description}</p>

      <h3 style={{ color: "#f59e0b" }}>
        ₹ {item.price}
      </h3>

      <span
        style={{
          background: "#f59e0b",
          color: "black",
          padding: "5px 10px",
          borderRadius: "20px",
          fontWeight: "bold"
        }}
      >
        {item.category}
      </span>
      <div className="menu-actions">

  <button
  className="edit-btn"
  onClick={() => handleEdit(item)}
>
  Edit
</button>
<button
  className="delete-btn"
  onClick={() => handleDelete(item.id)}
>
  Delete
</button>

</div>
    </div>
  ))}

      </div>
    </>
  );
}

export default Menu;