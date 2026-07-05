export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-4">BMC Core Pro</h1>
      <p className="text-neutral-600 mb-6">
        A lightweight personal alternative to Procore — Module 1: Daily Logs
        and Photos.
      </p>
      <p className="text-sm text-neutral-500">
        Visit{" "}
        <code className="bg-neutral-100 px-1 py-0.5 rounded">
          /projects/[projectId]/daily-logs
        </code>{" "}
        with a real project ID to view daily logs once a project has been
        seeded in the database.
      </p>
    </main>
  );
}
