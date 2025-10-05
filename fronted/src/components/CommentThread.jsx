import React from "react";

export default function CommentThread({ ticket }) {
  if (!ticket.comments?.length) return <p>No comments yet.</p>;

  return (
    <div className="comment-thread">
      {ticket.comments.map((c, index) => (
        <div key={index} className="comment">
          <strong>{c.author || "Anonymous"}</strong>
          <p>{c.message}</p>
          <small>{new Date(c.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
