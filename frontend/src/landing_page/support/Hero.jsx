import { useState } from "react";

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) onSearch(query);
  };

  return (
    <div style={{
      background: "#f3f3f3",
      padding: "40px 48px 48px",
      borderBottom: "1px solid #e0e0e0",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 24,
            fontFamily: "'Lato', sans-serif",
          }}>
            Support Portal
          </h1>

          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            border: "1px solid #d0d0d0",
            borderRadius: 4,
            padding: "0 16px",
            maxWidth: 780,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Eg: How do I open my account, How do I activate F&O..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "14px 12px",
                fontSize: 15,
                color: "#333",
                fontFamily: "'Lato', sans-serif",
                background: "transparent",
              }}
            />
          </div>
        </div>

        <button
          style={{
            background: "#387ED1",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Lato', sans-serif",
            whiteSpace: "nowrap",
            marginTop: 48,
            marginLeft: 32,
          }}
          onClick={() => window.alert("My Tickets clicked")}
        >
          My tickets
        </button>
      </div>
    </div>
  );
}
