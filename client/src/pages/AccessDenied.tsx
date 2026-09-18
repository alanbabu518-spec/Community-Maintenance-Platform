import { useNavigate } from "react-router-dom";
import ErrorPage from "../components/ui/ErrorPage";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <ErrorPage
      errorCode="403"
      title="Access Denied"
      message="You don't have permission to access this page."
      onBack={() => navigate("/dashboard")}
    />
  );
}

export default AccessDenied;