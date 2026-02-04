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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Library Debug</h1>
      <p>Status: {status}</p>
      <p>Count: {count}</p>

      <hr style={{ margin: "24px 0" }} />

      <ModulesList />
    </div>
  );
}
