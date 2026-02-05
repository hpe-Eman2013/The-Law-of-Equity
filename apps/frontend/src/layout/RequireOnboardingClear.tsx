import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function RequireOnboardingClear({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const o = user?.onboarding;

  if (o?.needsSponsorshipCode)
    return <Navigate to="/onboarding/verify-sponsorship" replace />;
  if (o?.mustResetPassword)
    return <Navigate to="/onboarding/reset-password" replace />;

  return <>{children}</>;
}
