import { NextResponse } from "next/server";
import { count, error } from "node:console";
import { openai } from "@/lib/utils/openai";
export async function POST(req: Request) {
    try {
        const { sentence, userLocation } = await req.json();

        if (!sentence || !userLocation) {
            return NextResponse.json({ error: 'Text and location are required' }, { status: 400 })
        }
        const prompt = `Task:
Extract pickup and drop locations from the sentence.
Correct spelling to match real-world places near the user's location.
Classify intent as BOOK_RIDE, CANCEL_RIDE, or CHECK_STATUS.

Return JSON only. No markdown.

UserLocation:
${JSON.stringify(userLocation)}

Sentence:
${sentence}
`;
        const body = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0,
                responseMimeType: "application/json"
            }
        };

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );
        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            return NextResponse.json(
                {
                    error: "Gemini API failed",
                    details: errText
                },
                { status: 500 }
            );
        }
        const data = await geminiRes.json();

        const rawText =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!rawText) {
            return NextResponse.json(
                { error: "Gemini returned empty response" },
                { status: 500 }
            );
        }

        // 7. Convert Gemini Output into JSON
        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            return NextResponse.json(
                {
                    error: "Gemini response was not valid JSON",
                    rawText
                },
                { status: 500 }
            );
        }

        // 8. Return Clean Response
        return NextResponse.json({
            success: true,
            result: parsed
        });
        // Mock response to skip Gemini integration for now
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Server error",
                message: error.message
            },
            { status: 500 }
        );
    }
}