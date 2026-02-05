import { Link } from "react-router-dom";

export default function Intro() {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h1 className="mb-3">Learn the Law of Equity from the Ground Up</h1>
        <p className="lead">
          This platform trains students to understand equity doctrine and to draft court-ready documents,
          motions, and arguments using reputable sources and structured mastery checks.
        </p>

        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-primary" to="/overview">Course Overview</Link>
          <Link className="btn btn-outline-primary" to="/pricing">Pricing & Credits</Link>
        </div>

        <hr className="my-4" />

        <h5>What you’ll be able to do</h5>
        <ul>
          <li>Explain equity vs. law and apply equitable principles to real disputes</li>
          <li>Navigate maxims, defenses, remedies, and equitable procedure</li>
          <li>Draft court-ready templates (motions, affidavits, proposed orders) with confidence</li>
        </ul>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Start here</h5>
            <p className="card-text">
              Review the course structure and commitments before enrolling.
            </p>
            <Link className="btn btn-dark w-100" to="/overview">View Overview</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
