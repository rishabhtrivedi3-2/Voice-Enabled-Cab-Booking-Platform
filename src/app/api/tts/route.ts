// /app/api/deepgram/tts/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Call Deepgram TTS REST API
        const res = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en", {
            method: "POST",
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json({ error: "TTS failed", details: errText }, { status: 500 });
        }
        const audioBuffer = await res.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");

        return NextResponse.json({
            success: true,
            audio: `data:audio/mp3;base64,${audioBase64}`
        });

    } catch (err: any) {
        return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
    }
}
