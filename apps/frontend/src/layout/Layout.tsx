import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Layout() {
  const { user, status, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Law of Equity
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/overview">
                  Overview
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/pricing">
                  Pricing
                </NavLink>
              </li>
              {user && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/modules">
                    Modules
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {status === "loading" && (
                <span className="text-light small">Checking session…</span>
              )}

              {!user ? (
                <NavLink className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </NavLink>
              ) : (
                <>
                  <span className="text-light small">
                    Signed in as <strong>{user.username}</strong>
                  </span>
                  <button className="btn btn-outline-light btn-sm" onClick={logout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>

      <footer className="border-top py-3">
        <div className="container d-flex gap-3 flex-wrap small">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/refunds">Refunds</a>
          <a href="/disclaimer">Disclaimer</a>
        </div>
      </footer>
    </>
  );
}
