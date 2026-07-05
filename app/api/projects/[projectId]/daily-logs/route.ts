// app/api/projects/[projectId]/daily-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects/:projectId/daily-logs
// Returns all daily logs for a project, newest first, with photos included.
export async function GET(
  _req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const logs = await db.dailyLog.findMany({
    where: { projectId: params.projectId },
    orderBy: { date: "desc" },
    include: { photos: true, laborEntries: true },
  });

  return NextResponse.json(logs);
}

// POST /api/projects/:projectId/daily-logs
// Body: { date, weather?, tempC?, crewOnSite?, workCompleted, notes?,
//         delaysNoted?, delayNotes?, photoUrls?: string[] }
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const body = await req.json();

  if (!body.date || !body.workCompleted) {
    return NextResponse.json(
      { error: "date and workCompleted are required" },
      { status: 400 }
    );
  }

  const log = await db.dailyLog.create({
    data: {
      projectId: params.projectId,
      date: new Date(body.date),
      weather: body.weather,
      tempC: body.tempC,
      crewOnSite: body.crewOnSite,
      delaysNoted: body.delaysNoted ?? false,
      delayNotes: body.delayNotes,
      workCompleted: body.workCompleted,
      notes: body.notes,
      photos: body.photoUrls
        ? {
            create: body.photoUrls.map((url: string) => ({ url })),
          }
        : undefined,
    },
    include: { photos: true },
  });

  return NextResponse.json(log, { status: 201 });
}
