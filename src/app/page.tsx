import Link from "next/link";
import { db } from "@/db";
import { StatusBadge } from "./components/StatusBadge";

export const dynamic = "force-dynamic"; // always hit the DB fresh; fine at this scale

export default async function HomePage() {
  const allDiseases = await db.query.diseases.findMany({
    orderBy: (d, { asc }) => [asc(d.name)],
  });

  return (
    <main className="max-w-xl mx-auto px-5">
      <header className="pt-6 pb-4">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-1">
          Field notes / vaccine status
        </p>
        <h1 className="font-display text-3xl mb-1">Is there a vaccine for that?</h1>
        <p className="text-ink-soft text-sm">
          Plain-language status on outbreaks and vaccines, in one place.
        </p>
      </header>

      <ul className="flex flex-col gap-3 pb-8">
        {allDiseases.map((d) => (
          <li key={d.id}>
            <Link
              href={`/disease/${d.id}`}
              className="block bg-surface border border-hairline rounded-lg px-4 py-4 hover:border-teal transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg">{d.name}</h2>
                <StatusBadge status={d.vaccineStatus} />
              </div>
              {d.outbreakLevel === "active" && (
                <p className="font-mono text-[0.68rem] uppercase tracking-wide text-alert mt-1">
                  ● Active outbreak
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
