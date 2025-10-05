import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TicketCard from "../../components/TicketCard";
import "./index.css";

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:4000/api/tickets?limit=20&offset=0", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTickets(data.items || []))
      .catch(console.error);
  }, [token]);

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h2>Tickets</h2>
        <Link className="create-ticket-link" to="/tickets/new">
          Create New Ticket
        </Link>
      </div>

      <div className="tickets-list">
        {tickets.length > 0 ? (
          tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
}
