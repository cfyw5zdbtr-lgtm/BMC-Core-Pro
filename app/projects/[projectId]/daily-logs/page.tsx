// app/projects/[projectId]/daily-logs/page.tsx
"use client";

import { useEffect, useState } from "react";

type Photo = { id: string; url: string; caption?: string | null };

type DailyLog = {
  id: string;
  date: string;
  weather?: string | null;
  crewOnSite?: number | null;
  workCompleted: string;
  notes?: string | null;
  delaysNoted: boolean;
  delayNotes?: string | null;
  photos: Photo[];
};

export default function DailyLogsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state — kept simple; swap for react-hook-form if it grows
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    weather: "",
    crewOnSite: "",
    workCompleted: "",
    notes: "",
    delaysNoted: false,
    delayNotes: "",
  });

  async function loadLogs() {
    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/daily-logs`);
    setLogs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/projects/${projectId}/daily-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        crewOnSite: form.crewOnSite ? Number(form.crewOnSite) : undefined,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({
        date: new Date().toISOString().slice(0, 10),
        weather: "",
        crewOnSite: "",
        workCompleted: "",
        notes: "",
        delaysNoted: false,
        delayNotes: "",
      });
      loadLogs();
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Daily Logs</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
        >
          {showForm ? "Cancel" : "+ New Log"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border border-neutral-200 rounded-lg space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              Date
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="text-sm">
              Weather
              <input
                type="text"
                placeholder="Fine, 18°C"
                value={form.weather}
                onChange={(e) => setForm({ ...form, weather: e.target.value })}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="text-sm">
              Crew on site
              <input
                type="number"
                value={form.crewOnSite}
                onChange={(e) =>
                  setForm({ ...form, crewOnSite: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="text-sm flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.delaysNoted}
                onChange={(e) =>
                  setForm({ ...form, delaysNoted: e.target.checked })
                }
              />
              Delays noted
            </label>
          </div>

          <label className="text-sm block">
            Work completed
            <textarea
              required
              rows={3}
              value={form.workCompleted}
              onChange={(e) =>
                setForm({ ...form, workCompleted: e.target.value })
              }
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>

          {form.delaysNoted && (
            <label className="text-sm block">
              Delay notes
              <textarea
                rows={2}
                value={form.delayNotes}
                onChange={(e) =>
                  setForm({ ...form, delayNotes: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
          )}

          <label className="text-sm block">
            Notes
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>

          {/* Photo upload wired separately — see note below on storage */}
          <p className="text-xs text-neutral-500">
            Photo upload isn't wired here yet — hook this up to Supabase
            Storage / Vercel Blob and pass resulting URLs as `photoUrls`.
          </p>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
          >
            Save log
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-neutral-500">No daily logs yet.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-neutral-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {new Date(log.date).toLocaleDateString("en-NZ", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                {log.delaysNoted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Delay noted
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600 mt-1">
                {log.weather} {log.crewOnSite ? `· Crew: ${log.crewOnSite}` : ""}
              </p>
              <p className="text-sm mt-2">{log.workCompleted}</p>
              {log.notes && (
                <p className="text-sm text-neutral-500 mt-1">{log.notes}</p>
              )}
              {log.photos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {log.photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.id}
                      src={p.url}
                      alt={p.caption ?? ""}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
