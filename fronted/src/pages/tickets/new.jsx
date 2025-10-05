import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to create a ticket.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": Date.now().toString(),
        },
        body: JSON.stringify({ title, description, priority }),
      });

      const data = await res.json();

      if (res.ok) { 
        alert("Ticket created successfully!");
        setTitle("");
        setDescription("");
        setPriority("medium");
        navigate("/tickets");
      } else { 
        alert("Error creating ticket: " + (data.error?.code || "Unknown"));
        console.error("Backend error:", data);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error while creating ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
