import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email;

  const [timer, setTimer] = useState(30); // 30 sec
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ⏱️ Countdown logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔁 Resend email
  const handleResend = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:3000/users/confirmation", {
        user: { email },
      });

      setMessage("Email sent again ✅");
      setTimer(30); // reset timer
    } catch (err) {
      setMessage("Failed to resend ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p>No email found. Please signup again.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Check your email 📧</h1>

      <p className="mt-2 text-gray-600 text-center">
        We sent a confirmation link to <br />
        <span className="font-semibold">{email}</span>
      </p>

      {/* ⏱️ Timer */}
      {timer > 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          Resend available in {timer}s
        </p>
      ) : (
        <button
          onClick={handleResend}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      )}

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}