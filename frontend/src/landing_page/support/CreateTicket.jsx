import { useState } from "react";

export default function CreateTicket() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.subject || !form.description) return;
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setForm({ subject: "", category: "", description: "" });
    }, 1800);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#387ED1",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "10px 18px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Lato', sans-serif",
        }}
      >
        + Create a ticket
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div style={{
            background: "#fff", borderRadius: 6, padding: 32,
            width: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            fontFamily: "'Lato', sans-serif",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Create a ticket</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#387ED1" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#387ED1" strokeWidth="2" style={{ display: "block", margin: "0 auto 12px" }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <p style={{ fontWeight: 600, fontSize: 16 }}>Ticket submitted successfully!</p>
              </div>
            ) : (
              <>
                <label style={labelStyle}>Subject *</label>
                <input
                  style={inputStyle}
                  placeholder="Brief description of your issue"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />

                <label style={labelStyle}>Category</label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option>Account Opening</option>
                  <option>Your Zerodha Account</option>
                  <option>Kite</option>
                  <option>Funds</option>
                  <option>Console</option>
                  <option>Coin</option>
                </select>

                <label style={labelStyle}>Description *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                  placeholder="Describe your issue in detail..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button onClick={handleSubmit} style={{
                    flex: 1, background: "#387ED1", color: "#fff", border: "none",
                    borderRadius: 4, padding: "11px 0", fontSize: 14, fontWeight: 600,
                    cursor: "pointer",
                  }}>
                    Submit ticket
                  </button>
                  <button onClick={() => setOpen(false)} style={{
                    flex: 1, background: "#f3f3f3", color: "#555", border: "1px solid #ddd",
                    borderRadius: 4, padding: "11px 0", fontSize: 14, fontWeight: 600,
                    cursor: "pointer",
                  }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#555",
  marginBottom: 6,
  marginTop: 16,
};

const inputStyle = {
  width: "100%",
  border: "1px solid #d0d0d0",
  borderRadius: 4,
  padding: "10px 12px",
  fontSize: 14,
  color: "#333",
  fontFamily: "'Lato', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};
