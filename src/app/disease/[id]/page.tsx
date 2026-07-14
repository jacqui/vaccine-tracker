import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { StatusBadge } from "../../components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DiseasePage({ params }: { params: { id: string } }) {
  const d = await db.query.diseases.findFirst({
    where: (diseases, { eq }) => eq(diseases.id, params.id),
    with: {
      outbreakLocations: true,
      clinicalTrials: true,
      recommendations: true,
      sources: true,
    },
  });

  if (!d) notFound();

  const stats: Record<string, string> = d.epiStats ? JSON.parse(d.epiStats) : {};

  return (
    <main className="max-w-xl mx-auto px-5 pb-8">
      <Link href="/" className="inline-block mt-5 mb-2 font-mono text-sm text-teal">
        &larr; All diseases
      </Link>

      <div className="pt-2 pb-1">
        <StatusBadge status={d.vaccineStatus} large />
        <h1 className="font-display text-3xl mt-2 mb-3">{d.name}</h1>
      </div>

      {d.outbreakLevel === "active" && (
        <section className="bg-alert-bg border border-alert rounded-lg px-5 py-4 mb-3">
          <h3 className="font-mono text-xs uppercase tracking-wide text-alert mb-2">
            Active outbreak
          </h3>
          <p className="text-sm mb-2">{d.outbreakSummary}</p>
          {d.outbreakLocations.map((loc) => (
            <div
              key={loc.id}
              className="flex justify-between font-mono text-sm py-1 border-b border-hairline last:border-0"
            >
              <span className="text-ink-soft">
                {loc.country}
                {loc.region ? `, ${loc.region}` : ""}
              </span>
              <span>as of {loc.asOf}</span>
            </div>
          ))}
        </section>
      )}

      <section className="bg-surface border border-hairline rounded-lg px-5 py-4 mb-3">
        <h3 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
          Epidemiology
        </h3>
        <p className="text-sm mb-2">{d.epiDescription}</p>
        {d.epiTransmission && (
          <div className="flex justify-between font-mono text-sm py-1 border-b border-hairline">
            <span className="text-ink-soft">Transmission</span>
            <span>{d.epiTransmission}</span>
          </div>
        )}
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between font-mono text-sm py-1 border-b border-hairline last:border-0"
          >
            <span className="text-ink-soft">{key.replace(/_/g, " ")}</span>
            <span>{value}</span>
          </div>
        ))}
      </section>

      <section className="bg-surface border border-hairline rounded-lg px-5 py-4 mb-3">
        <h3 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
          Vaccine status
        </h3>
        {d.availableVaccines.length > 0 && (
          <p className="text-sm mb-2">
            <strong>Available:</strong> {d.availableVaccines.join(", ")}
          </p>
        )}
        {d.vaccineNotes && <p className="text-sm mb-2">{d.vaccineNotes}</p>}
        {d.clinicalTrials.map((t) => (
          <div key={t.id} className="font-mono text-sm py-1 border-b border-hairline last:border-0">
            {t.phase} · {t.status}
            {t.sponsor ? ` · ${t.sponsor}` : ""}
          </div>
        ))}
      </section>

      {d.recommendations.length > 0 && (
        <section className="bg-surface border border-hairline rounded-lg px-5 py-4 mb-3">
          <h3 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
            Recommendations
          </h3>
          {d.recommendations.map((r) => (
            <div key={r.id} className="py-2 border-b border-hairline last:border-0">
              <span className="block font-mono text-xs uppercase tracking-wide text-teal mb-1">
                {r.audience}
              </span>
              <p className="text-sm m-0">{r.recommendationText}</p>
            </div>
          ))}
        </section>
      )}

      {d.sources.length > 0 && (
        <section className="bg-surface border border-hairline rounded-lg px-5 py-4">
          <h3 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
            Sources
          </h3>
          <ul className="text-sm text-ink-soft">
            {d.sources.map((s) => (
              <li key={s.id} className="mb-1">
                <a href={s.url} className="text-teal">
                  {s.name}
                </a>{" "}
                — retrieved {s.retrieved}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
