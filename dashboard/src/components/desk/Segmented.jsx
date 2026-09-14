import React from "react";

// Chip group. options: string[] | [{value, label, title}].
const Segmented = ({ options, value, onChange, signal = false }) => (
  <div className={`seg${signal ? " signal" : ""}`}>
    {options.map((o) => {
      const v = typeof o === "string" ? o : o.value;
      const label = typeof o === "string" ? o : o.label;
      const title = typeof o === "string" ? v : o.title;
      return (
        <button key={v} type="button" title={title} className={value === v ? "on" : ""} onClick={() => onChange(v)}>
          {label}
        </button>
      );
    })}
  </div>
);

export default Segmented;
