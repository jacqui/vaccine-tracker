import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  diseases,
  sources,
  recommendations,
  outbreakLocations,
  clinicalTrials,
} from "@/db/schema";
import { DiseaseForm } from "../../DiseaseForm";
import { updateDisease } from "../../actions";
import { addSource, deleteSource } from "../../sourcesActions";
import {
  addRecommendation,
  deleteRecommendation,
} from "../../recommendationsActions";
import {
  addOutbreakLocation,
  deleteOutbreakLocation,
} from "../../outbreakLocationsActions";
import {
  addClinicalTrial,
  deleteClinicalTrial,
} from "../../clinicalTrialsActions";

export default async function EditDiseasePage({
  params,
}: {
  params: { id: string };
}) {
  const disease = await db.query.diseases.findFirst({
    where: eq(diseases.id, params.id),
  });

  if (!disease) notFound();

  const [diseaseSources, diseaseRecs, diseaseLocations, diseaseTrials] =
    await Promise.all([
      db.query.sources.findMany({ where: eq(sources.diseaseId, params.id) }),
      db.query.recommendations.findMany({
        where: eq(recommendations.diseaseId, params.id),
      }),
      db.query.outbreakLocations.findMany({
        where: eq(outbreakLocations.diseaseId, params.id),
      }),
      db.query.clinicalTrials.findMany({
        where: eq(clinicalTrials.diseaseId, params.id),
      }),
    ]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">Edit {disease.name}</h1>
      <DiseaseForm disease={disease} action={updateDisease} />

      {/* ---------- Sources ---------- */}
      <hr className="my-10" />
      <h2 className="text-lg font-semibold mb-4">Sources</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {diseaseSources.map((source) => (
          <li
            key={source.id}
            className="flex items-center justify-between border rounded px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{source.name}</p>
              <a href={source.url} className="text-blue-600 underline text-xs">
                {source.url}
              </a>
              <p className="text-xs text-gray-500">
                Retrieved {source.retrieved}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteSource(source.id, disease.id);
              }}
            >
              <button type="submit" className="text-red-600 underline text-xs">
                Delete
              </button>
            </form>
          </li>
        ))}
        {diseaseSources.length === 0 && (
          <p className="text-sm text-gray-500">No sources added yet.</p>
        )}
      </ul>
      <form action={addSource} className="flex flex-col gap-3 max-w-md">
        <input type="hidden" name="diseaseId" value={disease.id} />
        <input
          name="name"
          placeholder="Source name, e.g. WHO Disease Outbreak News"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="url"
          placeholder="https://..."
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="retrieved"
          type="date"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 text-sm w-fit"
        >
          Add source
        </button>
      </form>

      {/* ---------- Recommendations ---------- */}
      <hr className="my-10" />
      <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {diseaseRecs.map((rec) => (
          <li
            key={rec.id}
            className="flex items-center justify-between border rounded px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{rec.audience}</p>
              <p className="text-xs text-gray-600">{rec.recommendationText}</p>
              {rec.sourceUrl && (
                <a
                  href={rec.sourceUrl}
                  className="text-blue-600 underline text-xs"
                >
                  {rec.sourceUrl}
                </a>
              )}
            </div>
            <form
              action={async () => {
                "use server";
                await deleteRecommendation(rec.id, disease.id);
              }}
            >
              <button type="submit" className="text-red-600 underline text-xs">
                Delete
              </button>
            </form>
          </li>
        ))}
        {diseaseRecs.length === 0 && (
          <p className="text-sm text-gray-500">No recommendations yet.</p>
        )}
      </ul>
      <form action={addRecommendation} className="flex flex-col gap-3 max-w-md">
        <input type="hidden" name="diseaseId" value={disease.id} />
        <input
          name="audience"
          placeholder="Audience, e.g. Pregnant women"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <textarea
          name="recommendationText"
          placeholder="Recommendation text"
          required
          rows={2}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="sourceUrl"
          placeholder="Source URL (optional)"
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 text-sm w-fit"
        >
          Add recommendation
        </button>
      </form>

      {/* ---------- Outbreak locations ---------- */}
      <hr className="my-10" />
      <h2 className="text-lg font-semibold mb-4">Outbreak locations</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {diseaseLocations.map((loc) => (
          <li
            key={loc.id}
            className="flex items-center justify-between border rounded px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">
                {loc.country}
                {loc.region ? ` — ${loc.region}` : ""}
              </p>
              <p className="text-xs text-gray-500">
                {loc.lat}, {loc.lon} · as of {loc.asOf}
                {loc.cases != null ? ` · ${loc.cases} cases` : ""}
                {loc.deaths != null ? ` · ${loc.deaths} deaths` : ""}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteOutbreakLocation(loc.id, disease.id);
              }}
            >
              <button type="submit" className="text-red-600 underline text-xs">
                Delete
              </button>
            </form>
          </li>
        ))}
        {diseaseLocations.length === 0 && (
          <p className="text-sm text-gray-500">No locations added yet.</p>
        )}
      </ul>
      <form
        action={addOutbreakLocation}
        className="flex flex-col gap-3 max-w-md"
      >
        <input type="hidden" name="diseaseId" value={disease.id} />
        <input
          name="country"
          placeholder="Country"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="region"
          placeholder="Region (optional)"
          className="border rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-3">
          <input
            name="lat"
            type="number"
            step="any"
            placeholder="Latitude"
            required
            className="border rounded px-3 py-2 text-sm w-full"
          />
          <input
            name="lon"
            type="number"
            step="any"
            placeholder="Longitude"
            required
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="cases"
            type="number"
            placeholder="Cases (optional)"
            className="border rounded px-3 py-2 text-sm w-full"
          />
          <input
            name="deaths"
            type="number"
            placeholder="Deaths (optional)"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
        <input
          name="asOf"
          type="date"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 text-sm w-fit"
        >
          Add location
        </button>
      </form>

      {/* ---------- Clinical trials ---------- */}
      <hr className="my-10" />
      <h2 className="text-lg font-semibold mb-4">Clinical trials</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {diseaseTrials.map((trial) => (
          <li
            key={trial.id}
            className="flex items-center justify-between border rounded px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">
                {trial.nctId} — {trial.phase}
              </p>
              <p className="text-xs text-gray-500">
                {trial.status}
                {trial.sponsor ? ` · ${trial.sponsor}` : ""}
              </p>
              {trial.url && (
                <a href={trial.url} className="text-blue-600 underline text-xs">
                  {trial.url}
                </a>
              )}
            </div>
            <form
              action={async () => {
                "use server";
                await deleteClinicalTrial(trial.id, disease.id);
              }}
            >
              <button type="submit" className="text-red-600 underline text-xs">
                Delete
              </button>
            </form>
          </li>
        ))}
        {diseaseTrials.length === 0 && (
          <p className="text-sm text-gray-500">No trials added yet.</p>
        )}
      </ul>
      <form action={addClinicalTrial} className="flex flex-col gap-3 max-w-md">
        <input type="hidden" name="diseaseId" value={disease.id} />
        <input
          name="nctId"
          placeholder="NCT ID, e.g. NCT01234567"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="phase"
          placeholder="Phase, e.g. PHASE1"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="status"
          placeholder="Status, e.g. RECRUITING"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="sponsor"
          placeholder="Sponsor (optional)"
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="url"
          placeholder="URL (optional)"
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 text-sm w-fit"
        >
          Add trial
        </button>
      </form>
    </main>
  );
}
