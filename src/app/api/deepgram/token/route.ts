import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.deepgram.com/v1/projects",
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    }
  );

  const projects = await res.json();
  const projectId = projects.projects[0].project_id;

  const keyRes = await fetch(
    `https://api.deepgram.com/v1/projects/${projectId}/keys`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: "browser-stt",
        scopes: ["usage:write"],
        time_to_live_in_seconds: 300,
      }),
    }
  );

  const keyData = await keyRes.json();

  return NextResponse.json({ token: keyData.key });
}
