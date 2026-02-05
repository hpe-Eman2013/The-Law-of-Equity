import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (user) nav("/modules", { replace: true });
  }, [user, nav]);

  const from = loc.state?.from ?? "/modules";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      nav(from, { replace: true });
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <h1 className="mb-3">Login</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit} className="card">
          <div className="card-body">
            <label className="form-label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              className="form-control mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />

            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button className="btn btn-dark w-100" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
