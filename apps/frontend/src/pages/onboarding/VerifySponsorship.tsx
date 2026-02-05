import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function VerifySponsorship() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();

  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const needs = Boolean(user?.onboarding?.needsSponsorshipCode);

  React.useEffect(() => {
    if (!needs) nav("/modules", { replace: true });
  }, [needs, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/verify-sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message ?? `${res.status} ${res.statusText}`);
      }

      await refresh();
      nav("/onboarding/reset-password", { replace: true });
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <h1 className="mb-3">Verify Sponsorship</h1>
        <p className="text-muted">
          Enter the sponsorship code provided to you. This finalizes your onboarding and ties your account
          to your sponsor.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit} className="card">
          <div className="card-body">
            <label className="form-label">Sponsorship Code</label>
            <input
              className="form-control mb-3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="EQTY-XXXX-XXXX"
              required
            />
            <button className="btn btn-primary w-100" type="submit">
              Verify Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
