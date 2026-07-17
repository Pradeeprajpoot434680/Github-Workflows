import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const API = "http://localhost:8080/users";

  const getUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API, form);

      setForm({
        username: "",
        email: "",
        password: "",
      });

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h1> GitHub Actions Demo</h1>

        <form onSubmit={addUser} className="form">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">
            Add User
          </button>

        </form>

        <button className="refresh" onClick={getUsers}>
          Refresh Users
        </button>

        <div className="users">

          {users.map((user) => (

            <div className="user-card" key={user.id}>

              <div className="avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>

                <h3>{user.username}</h3>

                <p>📧 {user.email}</p>

                <small>🔒 {user.password}</small>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

export default App;