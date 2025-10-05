import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TicketsList from "./pages/tickets/index";
import NewTicket from "./pages/tickets/new";
import TicketDetail from "./pages/tickets/TicketDetail";
import RegisterLogin from "./pages/RegisterLogin";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route
        path="/tickets"
        element={isLoggedIn ? <TicketsList /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets/new"
        element={isLoggedIn ? <NewTicket /> : <Navigate to="/login" />}
      />
      <Route
        path="/tickets/:id"
        element={isLoggedIn ? <TicketDetail /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/tickets" />} />
    </Routes>
  );
}

export default App;
