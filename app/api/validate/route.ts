import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, email } = body;

        if (!url || !email) {
            return NextResponse.json(
                { error: "Both 'url' and 'email' are required." },
                { status: 400 }
            );
        }

        const supabaseTestBase =
            "https://yhxzjyykdsfkdrmdxgho.supabase.co/functions/v1/application-task";
        const testUrl = `${supabaseTestBase}?url=${encodeURIComponent(url)}&email=${encodeURIComponent(email)}`;

        const response = await fetch(testUrl, { method: "GET" });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                { error: `Upstream returned HTTP ${response.status}: ${text}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Proxy error:", err);
        return NextResponse.json(
            { error: `Server error: ${err?.message || "unknown"}` },
            { status: 500 }
        );
    }
}
