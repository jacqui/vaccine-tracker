type Disease = {
  id: string;
  name: string;
  category: string[];
  epiDescription: string;
  epiTransmission: string | null;
  epiStats: string | null;
  outbreakLevel: "none" | "monitoring" | "active";
  outbreakSummary: string | null;
  vaccineStatus: "available" | "in_trials" | "in_development" | "none";
  availableVaccines: string[];
  vaccineNotes: string | null;
};

export function DiseaseForm({
  disease,
  action,
}: {
  disease?: Disease;
  action: (formData: FormData) => void;
}) {
  const isEdit = Boolean(disease);

  return (
    <form action={action} className="flex flex-col gap-4 max-w-xl">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Slug (id)</span>
        <input
          name="id"
          defaultValue={disease?.id}
          readOnly={isEdit}
          required
          placeholder="e.g. ebola-bundibugyo"
          className={`border rounded px-3 py-2 ${
            isEdit ? "bg-gray-100 text-gray-500" : ""
          }`}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          name="name"
          defaultValue={disease?.name}
          required
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Category (comma-separated)</span>
        <input
          name="category"
          defaultValue={disease?.category.join(", ")}
          placeholder="e.g. outbreak-prone, hemorrhagic-fever"
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Epidemiology description</span>
        <textarea
          name="epiDescription"
          defaultValue={disease?.epiDescription}
          required
          rows={3}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Transmission</span>
        <textarea
          name="epiTransmission"
          defaultValue={disease?.epiTransmission ?? ""}
          rows={2}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Epi stats — must be valid JSON, e.g. {`{"Fatality rate": "25-90%"}`}
        </span>
        <textarea
          name="epiStats"
          defaultValue={disease?.epiStats ?? ""}
          rows={2}
          className="border rounded px-3 py-2 font-mono text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Outbreak level</span>
        <select
          name="outbreakLevel"
          defaultValue={disease?.outbreakLevel ?? "none"}
          className="border rounded px-3 py-2"
        >
          <option value="none">None</option>
          <option value="monitoring">Monitoring</option>
          <option value="active">Active</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Outbreak summary</span>
        <textarea
          name="outbreakSummary"
          defaultValue={disease?.outbreakSummary ?? ""}
          rows={2}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Vaccine status</span>
        <select
          name="vaccineStatus"
          defaultValue={disease?.vaccineStatus ?? "none"}
          required
          className="border rounded px-3 py-2"
        >
          <option value="available">Available</option>
          <option value="in_trials">In trials</option>
          <option value="in_development">In development</option>
          <option value="none">None</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Available vaccines (comma-separated)
        </span>
        <input
          name="availableVaccines"
          defaultValue={disease?.availableVaccines.join(", ")}
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Vaccine notes</span>
        <textarea
          name="vaccineNotes"
          defaultValue={disease?.vaccineNotes ?? ""}
          rows={2}
          className="border rounded px-3 py-2"
        />
      </label>

      <button
        type="submit"
        className="bg-black text-white rounded px-4 py-2 mt-2"
      >
        {isEdit ? "Save changes" : "Create disease"}
      </button>
    </form>
  );
}
