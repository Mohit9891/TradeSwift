import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import GeneralContext from "./GeneralContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartPanel = () => {
  const { selectedSymbol, livePrices, priceHistory } =
    useContext(GeneralContext);

  if (!selectedSymbol) {
    return (
      <div style={{ padding: 16, color: "#666" }}>
        Click any watchlist row to chart it live.
      </div>
    );
  }

  const live = livePrices[selectedSymbol];
  const hist = priceHistory[selectedSymbol] || [];
  const data = {
    labels: hist.map((_, i) => i + 1),
    datasets: [
      {
        label: `${selectedSymbol} ${live ? `₹${live.price}` : ""}`,
        data: hist.map((h) => h.p),
        borderColor: live?.isDown ? "rgb(255,99,132)" : "rgb(75,192,192)",
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div style={{ padding: 12 }}>
      <h3 className="title">
        {selectedSymbol} — live {hist.length} ticks
      </h3>
      {live && (
        <p style={{ fontSize: 13, color: "#555" }}>
          O {live.open} &nbsp; H {live.high} &nbsp; L {live.low} &nbsp;
          Vol {Number(live.volume || 0).toLocaleString("en-IN")}
        </p>
      )}
      {hist.length < 2 ? (
        <p>Waiting for live ticks…</p>
      ) : (
        <Line data={data} options={{ responsive: true, animation: false }} />
      )}
    </div>
  );
};

export default ChartPanel;
