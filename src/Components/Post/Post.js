import React from "react";

function Post({ title, content, socialNetworks, state, postingdate }) {
  return (
    <div className="post-container">
      <h2>{title}</h2>
      <p>{content}</p>
      <div className="post-details">
        <p>
          <strong>Redes Sociales:</strong>{" "}
          {socialNetworks.map((network) => network.name).join(", ")}
        </p>
        <p>
          <strong>Estado:</strong> {state}
        </p>
        <p>
          <strong>Fecha de Envío:</strong>{" "}
          {new Date(postingdate).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Post;
