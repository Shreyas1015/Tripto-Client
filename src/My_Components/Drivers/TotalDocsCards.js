import React from "react";

const TotalDocsCards = (props) => {
  return (
    <>
      <div className="card mx-auto my-5" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{props.doc_name}</h5>
          <span>{props.value}</span>
        </div>
      </div>
    </>
  );
};

export default TotalDocsCards;
