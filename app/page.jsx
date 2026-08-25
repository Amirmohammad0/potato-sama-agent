"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [lines, setLines] = useState([
    "KALI WEB TERMINAL",
    "Initializing secure sandbox...",
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  async function runCommand(e) {
    e?.preventDefault();
    const command = input.trim();
    if (!command || busy) return;
    setInput("");
    setLines((v) => [...v, `root@kali:~# ${command}`]);
    setBusy(true);
    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (data.output) setLines((v) => [...v, ...data.output.split("\n")]);
      if (data.error) setLines((v) => [...v, `ERROR: ${data.error}`]);
    } catch (err) {
      setLines((v) => [...v, `ERROR: ${err.message}`]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <main className="page" onClick={() => inputRef.current?.focus()}>
      <section className="terminal">
        <header className="bar">
          <div className="dots"><i/><i/><i/></div>
          <strong>KALI WEB TERMINAL</strong>
          <span className={busy ? "status busy" : "status"}>{busy ? "RUNNING" : "READY"}</span>
        </header>
        <div className="screen">
          {lines.map((line, i) => <div key={i} className={line.startsWith("root@") ? "cmd" : "out"}>{line || "\u00a0"}</div>)}
          <form onSubmit={runCommand} className="prompt">
            <span>root@kali:~#</span>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} disabled={busy} autoComplete="off" spellCheck="false" aria-label="terminal command" />
            <span className="cursor" />
          </form>
        </div>
      </section>
    </main>
  );
}
