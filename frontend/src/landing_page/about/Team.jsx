import React from "react";
import "./Team.css";

const teamMembers = {
  leadership: [
    {
      img: "media/images/Nikhil.jpg",
      name: "Nikhil Kamath",
      role: "Co-founder",
      bio: "Co-founded Zerodha alongside Nithin. Oversees True Beacon and multiple investment ventures.",
    },
    {
      img: "media/images/Kailash.jpg",
      name: "Kailash Nadh",
      role: "CTO",
      bio: "Leads technology and engineering at Zerodha. Polyglot programmer and open-source advocate.",
    },
    {
      img: "media/images/Venu.jpg",
      name: "Venu Madhav",
      role: "COO",
      bio: "Manages operations and regulatory affairs across Zerodha's business units.",
    },
  ],
  team: [
    {
      img: "media/images/Hanan.jpg",
      name: "Hanan Delvi",
      role: "Marketing",
      bio: "Drives brand and community initiatives at Zerodha.",
    },
    {
      img: "media/images/Seema.jpg",
      name: "Seema",
      role: "Operations",
      bio: "Handles key operational workflows and customer experience.",
    },
    {
      img: "media/images/karthik.jpg",
      name: "Karthik Rangappa",
      role: "VP — Education",
      bio: "Author of Varsity, Zerodha's flagship financial education platform.",
    },
    {
      img: "media/images/Austin.jpg",
      name: "Austin Prakash",
      role: "Design",
      bio: "Crafts Zerodha's visual identity and product design language.",
    },
  ],
};

function MemberCard({ img, name, role, bio }) {
  return (
    <div className="team-card">
      <div className="team-card-img-wrap">
        <img src={img} alt={name} className="team-card-img" />
      </div>
      <div className="team-card-body">
        <h6 className="team-card-name">{name}</h6>
        <p className="team-card-role">{role}</p>
        <p className="team-card-bio">{bio}</p>
      </div>
    </div>
  );
}

function Team() {
  return (
    <div className="team-page">
      <div className="container">

        {/* Hero */}
        <div className="hero-section">
          <div className="hero-img-wrap">
            <img src="media/images/nithinKamath.jpg" alt="Nithin Kamath" className="founder-img" />
          </div>
          <div className="hero-content">
            <span className="section-tag">Our People</span>
            <h2 className="founder-name">Nithin Kamath</h2>
            <p className="founder-title">Founder & CEO</p>
            <p className="hero-bio">
              Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced
              during his decade long stint as a trader. Today, Zerodha has changed the landscape
              of the Indian broking industry.
            </p>
            <p className="hero-bio">
              He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the
              Market Data Advisory Committee (MDAC).
            </p>
            <p className="hero-bio">Playing basketball is his zen.</p>
            <div className="connect-links">
              <a href="#">Homepage</a>
              <a href="#">TradingQnA</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>

        <hr className="team-divider" />

        {/* Leadership */}
        <div className="team-section">
          <p className="team-section-label">Leadership</p>
          <div className="cards-grid">
            {teamMembers.leadership.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </div>

        <hr className="team-divider" />

        {/* Team */}
        <div className="team-section">
          <p className="team-section-label">Team</p>
          <div className="cards-grid">
            {teamMembers.team.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Team;