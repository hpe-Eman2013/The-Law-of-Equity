import { useEffect, useState } from "react";

type LibraryDoc = {
  id: string;
  title: string;
  updated: string;
  previewUrl: string;
  downloadUrl: string;
};

function LibraryDebug() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setStatus("loading");
    fetch("/api/library")
      .then((res) => {
        return res
          .json()
          .then((json) => ({ httpStatus: res.status, body: json }));
      })
      .then((result) => {
        setStatus("ok");
        setData(result);
      })
      .catch((err) => {
        setStatus("error");
        setError(String(err));
      });
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "monospace" }}>
      <h2>Library Debug</h2>
      <p>Status: {status}</p>
      {status === "error" && (
        <pre style={{ color: "red" }}>Error: {error}</pre>
      )}
      {status === "loading" && <p>Loading /api/library…</p>}
      {status === "ok" && (
        <>
          <h3>Raw response:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          {data?.body?.ok && (
            <>
              <h3>Parsed docs:</h3>
              <ul>
                {data.body.docs.map((d: LibraryDoc) => (
                  <li key={d.id}>{d.title}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <LibraryDebug />
    </div>
  );
}

export default App;
