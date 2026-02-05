import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Pricing() {
  const { user } = useAuth();
  const sponsorDiscountActive = Boolean(user); // v1: must be logged in

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h1 className="mb-3">Pricing & Credits</h1>

        <p className="text-muted">
          Credits are used to unlock course access and assessments. Exact credit rules will be shown at checkout.
        </p>

        {sponsorDiscountActive ? (
          <div className="alert alert-success" role="alert">
            ✅ <strong>Sponsor Discount:</strong> Logged-in sponsors receive <strong>20% off</strong> when
            sponsoring a student. Applied automatically at checkout.
          </div>
        ) : (
          <div className="alert alert-secondary" role="alert">
            Log in to unlock the <strong>20% sponsor discount</strong> for sponsored students.
            <div className="mt-2">
              <Link className="btn btn-sm btn-outline-dark" to="/login">Login</Link>
            </div>
          </div>
        )}

        <h5 className="mt-4">Credit packages (example)</h5>
        <div className="row g-3">
          {[
            { name: "Starter", credits: 50, note: "Good for initial access" },
            { name: "Standard", credits: 150, note: "Best value for steady progress" },
            { name: "Pro", credits: 300, note: "For intensive study" },
          ].map((p) => (
            <div className="col-md-4" key={p.name}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    <strong>{p.credits}</strong> credits
                    <br />
                    <span className="text-muted">{p.note}</span>
                  </p>
                  <button className="btn btn-dark w-100" disabled>
                    Checkout (coming soon)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <h5>Sponsor a student (v1)</h5>
        <p className="text-muted">
          In v1, sponsoring requires login. The sponsored student will receive a temporary password and a
          sponsorship code. They must enter the code to finalize onboarding.
        </p>

        <button className="btn btn-primary" disabled>
          Sponsor Checkout (coming soon)
        </button>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Legal</h5>
            <ul className="mb-0">
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/refunds">Refunds</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
