
import { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const transactions = [
  {
    id: 1,
    amount: -100.0,
    desc: "VIA GTWORLD 101CT0000000006165000848-2349065979423-AIRTIME",
    timestamp: "2025-11-22 13:45",
    status: "success",
  },
  {
    id: 2,
    amount: -948.0,
    desc: "SMS ALERT CHARGE",
    timestamp: "2025-11-22 09:12",
    status: "success",
  },
  {
    id: 3,
    amount: -71.10,
    desc: "VAT CHARGES",
    timestamp: "2025-11-21 23:58",
    status: "success",
  },
  {
    id: 4,
    amount: -10.0,
    desc: "COMMISSION ON NIP",
    timestamp: "2025-11-21 14:06",
    status: "success",
  },
  {
    id: 5,
    amount: -100.0,
    desc: "ELECTRONIC MONEY TRANSFER LEVY (EMTL)",
    timestamp: "2025-11-20 18:30",
    status: "success",
  },
  {
    id: 6,
    amount: -150.0,
    desc: "SMS charges",
    timestamp: "2025-11-19 00:00",
    status: "success",
  },
];



  async function explain(tx) {
    setLoading(true);
    setExplanation("");

    try {
      const response = await fetch("http://127.0.0.1:8000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      setExplanation("AI explanation failed. Check connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900">
      <h1 className="text-xl font-bold mb-4">Transaction History</h1>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => setSelected(tx)}
            className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:border hover:border-red-500"
          >
            <div className="font-semibold">{tx.desc}</div>
            <div className="text-sm opacity-70">{tx.timestamp}</div>
            <div className={tx.amount < 0 ? "text-red-500" : "text-green-600"}>
              {tx.amount} NGN
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-2xl border-t mt-4 animate-slide-up transition">
          <h2 className="text-lg font-bold mb-2">{selected.desc}</h2>
          <p className="opacity-70 text-sm mb-4">{selected.timestamp}</p>

          <button
            onClick={() => explain(selected)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            Explain this
          </button>

          {loading && <p className="mt-4 animate-pulse">Generating explanation…</p>}

          {explanation && (
            <p className="mt-4 p-3 bg-gray-100 rounded-xl text-sm leading-relaxed">
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}