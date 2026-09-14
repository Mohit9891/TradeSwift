import React from "react";

// Order status dot: OPEN/PENDING pulse, COMPLETE filled, others flat.
const StatusPip = ({ status }) => {
  const s = (status || "COMPLETE").toLowerCase();
  return <span className={`pip ${s}`} title={status} />;
};

export default StatusPip;
