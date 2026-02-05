import { Link } from "react-router-dom";

export default function Overview() {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h1 className="mb-3">Course Overview</h1>

        <h5>What this course offers</h5>
        <ul>
          <li>Module-based instruction (doctrine + practice)</li>
          <li>Assessments with mastery thresholds</li>
          <li>Drafting prompts and document templates</li>
          <li>Reputable sources (cases, treatises, and structured references)</li>
        </ul>

        <h5 className="mt-4">Student commitments</h5>
        <ul>
          <li>Consistent weekly study</li>
          <li>Reading + structured notes</li>
          <li>Assessments and drafting exercises</li>
          <li>Academic honesty and non-sharing policy</li>
        </ul>

        <div className="d-flex gap-2 flex-wrap mt-3">
          <Link className="btn btn-primary" to="/pricing">Pricing & Credits</Link>
          <Link className="btn btn-outline-secondary" to="/login">Login</Link>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="alert alert-warning" role="alert">
          <strong>Note:</strong> Content is educational. See the <Link to="/disclaimer">Disclaimer</Link>.
        </div>
      </div>
    </div>
  );
}
