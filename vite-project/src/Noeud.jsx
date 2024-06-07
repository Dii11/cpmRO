// src/components/NodeCustom.js
import React from "react";

const NodeCustom = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid black",
        borderRadius: 5,
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ borderLeft: "2px solid black" }}>
          {data.dateDebutPlusTot}
        </div>
        <div>{data.datePlustard}</div>
      </div>
    </div>
  );
};

export default NodeCustom;
