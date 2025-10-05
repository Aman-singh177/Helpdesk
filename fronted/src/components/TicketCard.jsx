import React from "react";
import { Link } from "react-router-dom";

export default function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>SLA Due: {new Date(ticket.sla_due).toLocaleString()}</p>
      <Link to={`/tickets/${ticket._id}`}>View Details</Link>
    </div>
  );
}
