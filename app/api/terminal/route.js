import { NextResponse } from "next/server";
import { Sandbox } from "@vercel/sandbox";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { command } = await request.json();
    if (typeof command !== "string" || !command.trim()) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    // MVP: create an isolated sandbox per command. The next iteration will
    // persist a sandbox/session per browser user for a real interactive shell.
    const sandbox = await Sandbox.create({
      runtime: "node24",
      resources: { vcpus: 1, memory: 2048 },
      timeout: 60_000,
      networkPolicy: { mode: "deny-all" },
    });

    const result = await sandbox.runCommand({
      cmd: "bash",
      args: ["-lc", command],
    });

    const output = await result.stdout();
    const error = await result.stderr();
    await sandbox.stop();

    return NextResponse.json({ output: [output, error].filter(Boolean).join("\n") });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Sandbox execution failed" }, { status: 500 });
  }
}
