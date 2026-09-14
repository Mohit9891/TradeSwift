import { useState } from "react";
import Hero from "./Hero";
import CreateTicket from "./CreateTicket";

const CATEGORIES = [
  {
    id: "account-opening",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    label: "Account Opening",
    items: [
      "How do I open a demo account?",
      "Is any KYC or money needed to practice?",
      "How long does signup take?",
      "Can I reset my demo account?",
      "How do I track my signup status?",
    ],
  },
  {
    id: "signal-account",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    label: "Your TradeSwift Account",
    items: [
      "How do I reset my password?",
      "How do I get more demo cash?",
      "How do sessions and logins work?",
      "How do I close my demo account?",
      "How do I switch products (CNC/MIS)?",
    ],
  },
  {
    id: "dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    label: "Dashboard",
    items: [
      "How do I place an order on the dashboard?",
      "What are the different order types?",
      "How do DAY, IOC and AMO validity work?",
      "How to use the chart and depth panels?",
      "How do watchlists work?",
    ],
  },
  {
    id: "funds",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    label: "Funds",
    items: [
      "How do I add demo funds to my account?",
      "How does the margin block work?",
      "What are MIS 20% / NRML 12% margins?",
      "How do I withdraw demo funds?",
      "Why is my available margin lower than balance?",
    ],
  },
  {
    id: "console",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 8 12 12 14 14" />
      </svg>
    ),
    label: "Reports",
    items: [
      "How do I view my tradebook?",
      "How to view my P&L report?",
      "How do I check my funds ledger?",
      "How are realized profits tracked?",
      "How to view holdings performance?",
    ],
  },
  {
    id: "coin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9" />
      </svg>
    ),
    label: "Learn",
    items: [
      "How do stop-loss orders trigger?",
      "What is the difference between CNC and MIS?",
      "How do F&O lot sizes work here?",
      "What happens on option expiry day?",
      "How do converts between products work?",
    ],
  },
];

const QUICK_LINKS = [
  "Track signup",
  "Order types guide",
  "Intraday margins",
  "Dashboard user manual",
  "Learn how to create a ticket",
];

const ANNOUNCEMENTS = [
  "Surveillance measure on scrips - May 2026",
  "Offer for sale (OFS) – May 2026",
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: "1px solid #e8e8e8",
      borderRadius: 4,
      marginBottom: 8,
      background: "#fff",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {item.icon}
          <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{item.label}</span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 20px 16px 56px" }}>
          {item.items.map((q, i) => (
            <a
              key={i}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                padding: "8px 0",
                color: "var(--signal)",
                fontSize: 14,
                textDecoration: "none",
                borderBottom: i < item.items.length - 1 ? "1px solid #f5f5f5" : "none",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {q}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-block",
              marginTop: 10,
              color: "var(--signal)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all articles →
          </a>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-body)" }}>

      {/* Hero */}
      <Hero />

      {/* Main content */}
      <div className="support-grid" style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 48px",
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 32,
        alignItems: "start",
      }}>
        {/* Left: Accordions */}
        <div>
          {CATEGORIES.map((cat) => (
            <AccordionItem key={cat.id} item={cat} />
          ))}
        </div>

        {/* Right: Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Announcements */}
          <div style={{
            background: "#FFF8EC",
            border: "3px solid #F0A500",
            borderLeft: "4px solid #F0A500",
            borderRadius: 4,
            padding: "16px 18px",
          }}>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < ANNOUNCEMENTS.length - 1 ? 10 : 0 }}>
                <span style={{ color: "#555", marginTop: 2 }}>•</span>
                <a href="#" onClick={(e) => e.preventDefault()} style={{
                  color: "var(--signal)", fontSize: 14, textDecoration: "none", lineHeight: 1.4,
                }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  {a}
                </a>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 18px",
              background: "#f7f7f7",
              borderBottom: "1px solid #e8e8e8",
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a1a",
            }}>
              Quick links
            </div>
            {QUICK_LINKS.map((link, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: "block",
                  padding: "13px 18px",
                  color: "var(--signal)",
                  fontSize: 14,
                  textDecoration: "none",
                  borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f7f9fd")}
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                {i + 1}. {link}
              </a>
            ))}
          </div>

          {/* Create Ticket */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 4,
            padding: "18px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>
              Can't find what you're looking for?
            </p>
            <CreateTicket />
          </div>
        </div>
      </div>
    </div>
  );
}
