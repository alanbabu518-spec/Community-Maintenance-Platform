import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";
import FormField from "../components/ui/FormField";
import SocialButtons from "../components/ui/SocialButtons";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);

      navigate("/Home");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Invalid email or password",
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
              md:rounded-l-[150px]
              md:order-2
            "
          >
            <div className="max-w-[300px]">
              <h1 className="text-3xl md:text-4xl font-bold">Hello, Friend!</h1>

              <p className="text-sm leading-6 tracking-[0.3px] my-5">
                Register with your personal details to use all of site features.
              </p>

              <Button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  bg-transparent
                  border-white
                  hover:bg-white
                  hover:text-[#2da0a8]
                "
              >
                Sign Up
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
              md:order-1
            "
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[360px] flex flex-col items-center gap-1"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Sign In
              </h1>

              <SocialButtons />

              <span className="text-xs text-[#333] mb-3 text-center">
                or use your email for login
              </span>

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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <button
                type="button"
                className="text-xs text-gray-600 hover:text-[#2da0a8] hover:underline mt-2"
              >
                Forgot your password?
              </button>

              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
              )}

              <Button type="submit" className="mt-4" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;
