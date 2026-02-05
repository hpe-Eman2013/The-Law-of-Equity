import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./layout/RequireAuth";
import RequireOnboardingClear from "./layout/RequireOnboardingClear";

import Intro from "./pages/Intro";
import Overview from "./pages/Overview";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import ModulesPage from "./pages/ModulesPage";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Refunds from "./pages/legal/Refunds";
import Disclaimer from "./pages/legal/Disclaimer";

import VerifySponsorship from "./pages/onboarding/VerifySponsorship";
import ResetPassword from "./pages/onboarding/ResetPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Intro />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Legal */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Onboarding (must be logged in) */}
            <Route
              path="/onboarding/verify-sponsorship"
              element={
                <RequireAuth>
                  <VerifySponsorship />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/reset-password"
              element={
                <RequireAuth>
                  <ResetPassword />
                </RequireAuth>
              }
            />

            {/* App (must be logged in AND onboarding cleared) */}
            <Route
              path="/modules"
              element={
                <RequireAuth>
                  <RequireOnboardingClear>
                    <ModulesPage />
                  </RequireOnboardingClear>
                </RequireAuth>
              }
            />

            {/* Default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
