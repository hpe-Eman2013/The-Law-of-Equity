import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const loc = useLocation();

  if (status === "loading") return <p>Loading…</p>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return <>{children}</>;
}
