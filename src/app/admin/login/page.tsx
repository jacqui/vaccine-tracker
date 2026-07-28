import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="max-w-sm mx-auto mt-24 px-4">
      <h1 className="text-xl font-semibold mb-4">Admin login</h1>
      {searchParams.error && (
        <p className="text-red-600 text-sm mb-3">Wrong password.</p>
      )}
      <form action={login} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white rounded px-3 py-2">
          Log in
        </button>
      </form>
    </main>
  );
}
