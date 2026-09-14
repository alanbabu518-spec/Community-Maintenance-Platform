import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";
import Select from "../components/ui/Select";
import FormField from "../components/ui/FormField";
import SocialButtons from "../components/ui/SocialButtons";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<
    "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN"
  >("RESIDENT");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center px-4 py-6 font-['Montserrat']">
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

              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  bg-transparent
                  border-white
                  hover:bg-white
                  hover:text-[#2da0a8]
                "
              >
                Sign In
              </Button>
            </div>
          </div>

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
              className="w-full max-w-[360px] flex flex-col items-center gap-1"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Create Account
              </h1>

              <SocialButtons />

              <span className="text-xs text-[#333] mb-3 text-center">
                or use your email for registration
              </span>

              <FormField label="Name">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Password">
                <Input
                  type="password"
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </FormField>

              <FormField label="Role">
                <Select
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
                >
                  <option value="RESIDENT">Resident</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </Select>
              </FormField>

              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Creating...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Register;