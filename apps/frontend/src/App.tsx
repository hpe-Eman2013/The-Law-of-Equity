import { useEffect, useState } from "react";
import ModulesList from "./ModulesList";

export default function App() {
  const [status, setStatus] = useState("loading");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/library")
      .then((res) => res.json())
      .then((json) => {
        setStatus("loaded");
        setCount(json.count);
        console.log("API result:", json);
      })
      .catch((err) => {
        setStatus("error");
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-3">Library Debug</h1>

      <div className="mb-4">
        <p className="mb-1">
          <strong>Status:</strong> {status}
        </p>
        <p className="mb-0">
          <strong>Count:</strong> {count}
        </p>
      </div>

      <hr />

      <ModulesList />
    </div>
  );
}
