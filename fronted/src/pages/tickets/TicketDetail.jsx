import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentThread from "../../components/CommentThread";
import "./TicketDetail.css";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const token = localStorage.getItem("token");

  const fetchTicket = () => {
    fetch(`http://localhost:4000/api/tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setPriority(data.priority);
      })
      .catch(console.error);
  };

  useEffect(fetchTicket, [id, token]);

  const handleComment = async () => {
    if (!comment) return;
    await fetch(`http://localhost:4000/api/tickets/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: comment }),
    });
    setComment("");
    fetchTicket();
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "If-Match": ticket.version, // optimistic lock
        },
        body: JSON.stringify({ status, priority }),
      });

      if (res.status === 409) {
        alert("Update conflict! Someone else updated this ticket.");
        fetchTicket();
        return;
      }

      if (res.ok) {
        const updated = await res.json();
        setTicket(updated);
        alert("Ticket updated successfully!");
      } else {
        alert("Error updating ticket");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2>{ticket.title}</h2>
      </div>

      <div className="ticket-info">
        <p><strong>Description:</strong> {ticket.description}</p>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>

        <label>
          Priority:
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <p>SLA Due: {new Date(ticket.sla_due).toLocaleString()}</p>
        <button className="update-btn" onClick={handleUpdate}>Update Ticket</button>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        <CommentThread ticket={ticket} />
        <textarea
          className="comment-textarea"
          placeholder="Add comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="comment-button" onClick={handleComment}>
          Post Comment
        </button>
      </div>
    </div>
  );
}
