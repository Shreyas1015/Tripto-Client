import React from "react";

const Loading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="loading-backdrop">
      <div className="loading-content">
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;
