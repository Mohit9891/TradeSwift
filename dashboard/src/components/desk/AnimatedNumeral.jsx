import React, { useEffect, useRef, useState } from "react";

// Mono numeral that washes teal/sienna on change — direction is never color-alone.
const AnimatedNumeral = ({ value, format, className = "" }) => {
  const [dir, setDir] = useState(null);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    setDir(value > prev.current ? "rise" : "fall");
    prev.current = value;
    const t = setTimeout(() => setDir(null), 500);
    return () => clearTimeout(t);
  }, [value]);

  const text = format ? format(value) : value;
  return (
    <span className={`num ${dir ? `flash-${dir}` : ""} ${className}`}>
      {text}
    </span>
  );
};

export default AnimatedNumeral;
