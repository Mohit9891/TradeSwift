# 📈 TradeSwift

> A full-stack stock trading platform inspired by Zerodha — featuring a live dashboard, portfolio overview, and order management, built with the MERN stack and real-time WebSocket updates.

![TradeSwift Banner](https://via.placeholder.com/1200x400?text=TradeSwift+–+Trade+Smarter)

---

## 🚀 Live Demo

- **Landing Page:** [tradeswift.vercel.app](https://tradeswift.vercel.app) *(update with your URL)*
- **Dashboard:** [tradeswift-dashboard.vercel.app](https://tradeswift-dashboard.vercel.app) *(update with your URL)*
- **Backend API:** [tradeswift-api.onrender.com](https://tradeswift-api.onrender.com) *(update with your URL)*

---

## ✨ Features

- 📊 Real-time dashboard with holdings and positions
- 🛒 Buy/Sell order placement
- 💼 Portfolio summary (P&L, net worth)
- 📉 Watchlist with live price simulation
- 🔴 Real-time updates via **Socket.IO**
- 👤 User authentication (JWT)
- 📱 Responsive across devices

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | React.js, React Router, CSS Modules     |
| Dashboard    | React.js, Chart.js / Recharts           |
| Backend      | Node.js, Express.js, Socket.IO          |
| Database     | MongoDB Atlas, Mongoose                 |
| Auth         | JWT, bcryptjs                           |
| Real-time    | Socket.IO (WebSockets)                  |
| Deployment   | Vercel (frontend + dashboard), Render (backend) |

---

## 📁 Project Structure

```
TradeSwift/
├── frontend/                # Landing page (React)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── dashboard/               # Trading dashboard (React)
│   └── src/
│       ├── components/
│       │   ├── WatchList.jsx
│       │   ├── Holdings.jsx
│       │   ├── Positions.jsx
│       │   └── Orders.jsx
│       └── App.jsx
├── backend/                 # Express + Socket.IO server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/              # Socket.IO event handlers
│   └── index.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tradeswift.git
cd tradeswift
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend (Landing Page)

```bash
cd frontend
npm install
```

Create a `.env` in `/frontend`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev   # Runs on http://localhost:5173
```

### 4. Setup the Dashboard

```bash
cd dashboard
npm install
```

Create a `.env` in `/dashboard`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev   # Runs on http://localhost:5174
```

---

## 🔌 WebSocket Events (Socket.IO)

| Event              | Direction         | Description                        |
|--------------------|-------------------|------------------------------------|
| `connection`       | Server → Client   | Client connects to socket server   |
| `market:update`    | Server → Client   | Live price update for watchlist    |
| `order:placed`     | Client → Server   | User places a buy/sell order       |
| `order:confirmed`  | Server → Client   | Order confirmation broadcast       |
| `portfolio:update` | Server → Client   | Updated holdings after trade       |

---

## 🌐 Deployment

### Frontend & Dashboard → Vercel

1. Deploy `frontend/` and `dashboard/` as **separate Vercel projects**
2. Set `VITE_API_URL` and `VITE_SOCKET_URL` in each project's environment variables

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `DASHBOARD_URL`)
3. Build: `npm install` | Start: `node index.js`
4. Enable **WebSocket support** in Render settings

> ⚠️ Render free tier spins down after inactivity — expect a ~30s cold start.

---

## 🔮 Upcoming Features

- [ ] Google OAuth login
- [ ] Candlestick charts (OHLC data)
- [ ] Paper trading mode
- [ ] Historical trade analytics
- [ ] Razorpay wallet integration

---

## 📸 Screenshots

> *(Add screenshots here)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/your-username">Mohit</a></p>
