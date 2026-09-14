import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
    "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN"
  >("RESIDENT");

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");

      await registerUser({
        name,
        email,
        password,
        role,
      });

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center px-4 py-6 font-['Montserrat']">

      {/* Main Container */}
      <div
        className="
          w-full
          max-w-[900px]
          bg-white
          rounded-[30px]
          shadow-[0_5px_15px_rgba(0,0,0,0.35)]
          overflow-hidden
          flex
          flex-col
          md:flex-row
        "
      >

        {/* =========================
            WELCOME PANEL
        ========================== */}
        <div
          className="
            w-full
            md:w-1/2
            min-h-[230px]
            md:min-h-[520px]

            bg-gradient-to-r
            from-[#2da0a8]
            to-[#5c6bc0]

            text-white

            flex
            items-center
            justify-center

            text-center

            px-8
            py-10

            rounded-b-[80px]
            md:rounded-b-none
            md:rounded-r-[150px]
          "
        >
          <div className="max-w-[300px]">

            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome Back!
            </h1>

            <p className="text-sm leading-6 tracking-[0.3px] my-5">
              Enter your personal details to use all of site features.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                bg-transparent
                text-white
                text-xs
                px-[45px]
                py-[10px]
                border
                border-white
                rounded-lg
                font-semibold
                tracking-[0.5px]
                uppercase
                cursor-pointer

                hover:bg-white
                hover:text-[#2da0a8]

                transition
              "
            >
              Sign In
            </button>

          </div>
        </div>

        {/* =========================
            SIGN UP FORM
        ========================== */}
        <div
          className="
            w-full
            md:w-1/2

            flex
            items-center
            justify-center

            px-6
            sm:px-10
            py-10
            md:py-12
          "
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[360px] flex flex-col items-center"
          >

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Create Account
            </h1>

            {/* =========================
                SOCIAL ICONS
            ========================== */}
            <div className="flex gap-3 my-3">

              {/* Google */}
              <button
                type="button"
                aria-label="Continue with Google"
                className="
                  w-10
                  h-10
                  border
                  border-[#ccc]
                  rounded-[20%]
                  bg-white
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  transition
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.23-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.38Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.99c2.63 0 4.84-.87 6.45-2.38l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.99Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 14.05A5.86 5.86 0 0 1 6.23 12c0-.71.12-1.4.31-2.05V7.42H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.58l3.24-2.53Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.92c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.97 14.63 2 12 2a9.75 9.75 0 0 0-8.7 5.42l3.24 2.53C7.31 7.64 9.46 5.92 12 5.92Z"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                aria-label="Continue with Facebook"
                className="
                  w-10
                  h-10
                  border
                  border-[#ccc]
                  rounded-[20%]
                  bg-white
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  transition
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    fill="#1877F2"
                    d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.43H7.08v-3.5h3.05V9.4c0-3.04 1.79-4.72 4.55-4.72 1.32 0 2.7.24 2.7.24v2.99h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.5h-2.81V24C19.61 23.07 24 18.09 24 12.07Z"
                  />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                aria-label="Continue with GitHub"
                className="
                  w-10
                  h-10
                  border
                  border-[#ccc]
                  rounded-[20%]
                  bg-white
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  transition
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-[#333]"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.1c-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.29-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.94 10.94 0 0 1 12 5.89c.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.41-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                aria-label="Continue with LinkedIn"
                className="
                  w-10
                  h-10
                  border
                  border-[#ccc]
                  rounded-[20%]
                  bg-white
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  transition
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    fill="#0A66C2"
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.3ZM5.34 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V8.98H3.56v11.47Z"
                  />
                </svg>
              </button>

            </div>

            <span className="text-xs text-[#333] mb-3 text-center">
              or use your email for registration
            </span>

            {/* Name */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="
                w-full
                bg-[#eee]
                border-none
                outline-none
                rounded-lg
                px-[15px]
                py-[11px]
                text-[13px]
                my-1
              "
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full
                bg-[#eee]
                border-none
                outline-none
                rounded-lg
                px-[15px]
                py-[11px]
                text-[13px]
                my-1
              "
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="
                w-full
                bg-[#eee]
                border-none
                outline-none
                rounded-lg
                px-[15px]
                py-[11px]
                text-[13px]
                my-1
              "
            />

            {/* Role */}
            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as
                    | "ADMIN"
                    | "MANAGER"
                    | "RESIDENT"
                    | "TECHNICIAN",
                )
              }
              className="
                w-full
                bg-[#eee]
                border-none
                outline-none
                rounded-lg
                px-[15px]
                py-[11px]
                text-[13px]
                my-1
                text-gray-700
              "
            >
              <option value="RESIDENT">Resident</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs mt-2 text-center">
                {error}
              </p>
            )}

            {/* Sign Up */}
            <button
              type="submit"
              className="
                bg-[#2da0a8]
                text-white
                text-xs
                px-[45px]
                py-[10px]
                border
                border-transparent
                rounded-lg
                font-semibold
                tracking-[0.5px]
                uppercase
                mt-4
                cursor-pointer
                hover:bg-[#248991]
                transition
              "
            >
              Sign Up
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;