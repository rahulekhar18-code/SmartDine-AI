import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../assets/Users.css";
import { useNavigate } from "react-router-dom";


function Users() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    const fetchUsers = async () => {

      const res = await api.get("/users");

      setUsers(res.data);
    };

    fetchUsers();

  }, []);

  return (
    <>
      <Sidebar />

      <div className="users-page">

  <div className="users-header">

  <h1>👥 Registered Users</h1>

  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Search by name or email..."
      className="search-box"
    />
  </div>
  <button
  className="back-btn"
  onClick={() => navigate("/dashboard")}
>
  ← Back
</button>

</div>
  <div className="user-stats">

  <div className="user-stat-card">
    <h2>{users.length}</h2>
    <p>Total Users</p>
  </div>

  <div className="user-stat-card">
    <h2>
      {users.filter(u=>u.role==="CUSTOMER").length}
    </h2>
    <p>Customers</p>
  </div>

  <div className="user-stat-card">
    <h2>
      {users.filter(u=>u.role==="MANAGER").length}
    </h2>
    <p>Managers</p>
  </div>

</div>

  <div className="users-card">

    <table className="users-table">

      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Role</th>
          <th>Joined</th>
        </tr>
      </thead>

      <tbody>

        {users.map((user) => (

          <tr key={user.id}>

            <td>
              <div className="user-info">

               <div className="user-avatar">
  {user.name?.charAt(0).toUpperCase()}
</div>
                <div>
                  <div className="user-name">
                    {user.name}
                  </div>
                </div>

              </div>
            </td>

            <td>{user.email}</td>

            <td>
              <span
                className={`role-badge role-${user.role.toLowerCase()}`}
              >
                {user.role}
              </span>
            </td>

            <td>
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
    </>
  );
}

export default Users;