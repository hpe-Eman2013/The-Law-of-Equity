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
          // If backend returns ApiResponse even on non-2xx, prefer that message
          const msg = json && "ok" in json && !json.ok ? json.error.message : `${res.status} ${res.statusText}`;
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

  if (error) return <p>Failed to load modules: {error}</p>;
  if (!mods) return <p>Loading…</p>;

  return (
    <>
      <h1>Law of Equity – Modules</h1>
      <ul>
        {mods.map((m) => (
          <li key={m.id}>
            {m.order}. {m.title} – <code>{m.slug}</code>
          </li>
        ))}
      </ul>
    </>
  );
}
