import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const credentials = {
    admin: "admin1 / admin123 | registry / registry123 | ictadmin / lasustech",
    verifier: "verifier1 / verify123 | security / secure456 | external / external789",
    student: "Use matric number after admin uploads student record"
  };

  async function login(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        role,
        username: username.trim(),
        password: password.trim()
      });

      if (response.data.success) {
        onLogin(response.data.user);
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Could not connect to backend. Check backend server or API URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-info">
        <span className="badge">Secure Portal</span>
        <h1>Welcome to EduVerify</h1>
        <p>
          Select your role and sign in. The system separates admin, student,
          and verifier access for a realistic academic credential workflow.
        </p>
      </div>

      <form className="login-card" onSubmit={login}>
        <h2>Role Login</h2>

        <label>Account Role</label>
        <select className="input" value={role} onChange={(e) => { setRole(e.target.value); setUsername(""); setPassword(""); setMessage(""); }}>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="verifier">Verifier</option>
        </select>

        <label>{role === "student" ? "Matric Number" : "Username"}</label>
        <input
          className="input"
          value={username}
          placeholder={role === "student" ? "e.g. LASUSTECH/CSC/001" : "Enter username"}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {role !== "student" && (
          <>
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        <div className="hint-box">Demo: {credentials[role]}</div>

        {message && <div className="error-box">{message}</div>}

        <button className="primary-btn full" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </section>
  );
}
