import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
    "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN"
  >("RESIDENT");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const result = await registerUser({
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful:", result);

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <select
          value={role}
          onChange={(event) =>
            setRole(
              event.target.value as
                | "ADMIN"
                | "MANAGER"
                | "RESIDENT"
                | "TECHNICIAN",
            )
          }
        >
          <option value="RESIDENT">Resident</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
