import React from "react";

// Pure SVG sparkline with trailing dot. tone: 'rise' | 'fall' | 'flat'.
const COLORS = { rise: "#0e7c6b", fall: "#c4552d", flat: "#6b6f7a" };

const Sparkline = ({ data = [], width = 120, height = 32, tone = "flat" }) => {
  if (data.length < 2) return <svg className="spark" width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => `${((i / (data.length - 1)) * width).toFixed(1)},${(height - 3 - ((v - min) / span) * (height - 6)).toFixed(1)}`)
    .join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg className="spark" width={width} height={height}>
      <polyline points={pts} fill="none" stroke={COLORS[tone]} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={COLORS[tone]} />
    </svg>
  );
};

export default Sparkline;
