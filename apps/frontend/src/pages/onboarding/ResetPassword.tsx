import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function ResetPassword() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();

  const needsReset = Boolean(user?.onboarding?.mustResetPassword);

  const [pw1, setPw1] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!needsReset) nav("/modules", { replace: true });
  }, [needsReset, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (pw1.length < 10)
      return setError("Password must be at least 10 characters.");
    if (pw1 !== pw2) return setError("Passwords do not match.");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: pw1 }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(
          json?.error?.message ?? `${res.status} ${res.statusText}`,
        );
      }

      await refresh();
      nav("/modules", { replace: true });
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <h1 className="mb-3">Set a New Password</h1>
        <p className="text-muted">
          For security, you must change your temporary password before
          continuing.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit} className="card">
          <div className="card-body">
            <label className="form-label" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              className="form-control mb-3"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              required
            />

            <label className="form-label" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              className="form-control mb-3"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
            />

            <button className="btn btn-dark w-100" type="submit">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
