import Link from "next/link";
import { db } from "@/db";
import { StatusBadge } from "@/app/components/StatusBadge";
import { deleteDisease, logout } from "./actions";

export default async function AdminPage() {
  const allDiseases = await db.query.diseases.findMany({
    orderBy: (diseases, { desc }) => [desc(diseases.updatedAt)],
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Admin</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 underline">
            Log out
          </button>
        </form>
      </div>

      <Link
        href="/admin/diseases/new"
        className="inline-block mb-6 bg-black text-white rounded px-3 py-2 text-sm"
      >
        + Add disease
      </Link>

      <ul className="flex flex-col gap-3">
        {allDiseases.map((disease) => (
          <li
            key={disease.id}
            className="flex items-center justify-between border rounded px-4 py-3"
          >
            <div>
              <p className="font-medium">{disease.name}</p>
              <p className="text-xs text-gray-500">{disease.id}</p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={disease.vaccineStatus} />
              {disease.outbreakLevel !== "none" && (
                <StatusBadge status={disease.outbreakLevel} />
              )}
              <Link
                href={`/admin/diseases/${disease.id}/edit`}
                className="text-sm underline"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteDisease(disease.id);
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
