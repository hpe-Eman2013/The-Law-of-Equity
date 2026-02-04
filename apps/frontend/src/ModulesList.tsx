import { useEffect, useState } from "react";
import type { ApiResponse, ModuleDTO } from "@equity/shared";

export default function ModulesList() {
  const [mods, setMods] = useState<ModuleDTO[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/modules");
        const json = (await res.json()) as ApiResponse<ModuleDTO[]>;

        if (!res.ok) {
          const msg =
            json && "ok" in json && !json.ok
              ? json.error.message
              : `${res.status} ${res.statusText}`;
          throw new Error(msg);
        }

        if (!json.ok) throw new Error(json.error.message);

        if (!cancelled) setMods(json.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load modules: {error}
      </div>
    );
  }

  if (!mods) {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="spinner-border spinner-border-sm" role="status" />
        <span>Loading modules…</span>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-3">Law of Equity – Modules</h2>

      <ul className="list-group">
        {mods.map((m) => (
          <li
            key={m.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{m.order}. {m.title}</strong>
              <div className="text-muted small">
                <code>{m.slug}</code>
              </div>
            </div>

            <span className="badge bg-secondary">
              Pass ≥ {m.passPct}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
