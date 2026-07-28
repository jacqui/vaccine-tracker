import { DiseaseForm } from "../DiseaseForm";
import { createDisease } from "../actions";

export default function NewDiseasePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">Add disease</h1>
      <DiseaseForm action={createDisease} />
    </main>
  );
}
