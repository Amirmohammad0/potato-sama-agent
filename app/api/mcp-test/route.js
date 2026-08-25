import { NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const url = process.env.MCP_URL;
  const token = process.env.MCP_AUTH_TOKEN;

  if (!url || !token) {
    return NextResponse.json(
      { ok: false, error: "MCP_URL or MCP_AUTH_TOKEN is not configured in Vercel." },
      { status: 500 }
    );
  }

  let client;
  try {
    client = new Client({ name: "potato-sama-vercel", version: "0.1.0" });
    const transport = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    await client.connect(transport);
    const result = await client.listTools();

    return NextResponse.json({
      ok: true,
      endpoint: url,
      server: "connected",
      toolCount: result.tools?.length ?? 0,
      tools: (result.tools ?? []).map((tool) => ({
        name: tool.name,
        description: tool.description,
      })),
    });
  } catch (error) {
    console.error("MCP connection test failed", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "MCP connection failed" },
      { status: 502 }
    );
  } finally {
    try {
      await client?.close();
    } catch {}
  }
}
