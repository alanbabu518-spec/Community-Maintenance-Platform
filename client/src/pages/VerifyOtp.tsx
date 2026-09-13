import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyOtp } from "../services/api";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || ""; 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const result = await verifyOtp({
        email,
        otp,
      });

      console.log("OTP verification successful:", result);
      setMessage("Email verified successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "OTP verification failed"
      );
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
        />

        <button type="submit">Verify OTP</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default VerifyOtp;