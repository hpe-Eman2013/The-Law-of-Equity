import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContext";

export default function RequireGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, user } = useAuthContext();
  const location = useLocation();

  if (status === "loading") return null;

  // If already logged in, kick them out of /login
  if (user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
