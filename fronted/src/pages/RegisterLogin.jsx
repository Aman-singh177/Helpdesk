import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterLogin() {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister
      ? "http://localhost:4000/api/auth/register"
      : "http://localhost:4000/api/auth/login";

    const body = isRegister
      ? { name, email, password, role }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error?.code || "Unknown"));
        return;
      }

      if (isRegister) {
        alert("Registration successful! You can now login.");
        setIsRegister(false); // switch to login
      } else {
        // Login successful, store token and redirect
        localStorage.setItem("token", data.token);
        navigate("/tickets");
      }
    } catch (err) {
      console.error(err);
      alert("Network error, try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "10px", textAlign: "center" }}>
        {isRegister ? (
          <>
            Already registered?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsRegister(false)}
            >
              Login
            </span>
          </>
        ) : (
          <>
            New user?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setIsRegister(true)}
            >
              Register
            </span>
          </>
        )}
      </p>
    </div>
  );
}
