"use client";

import { useEffect, useState } from "react";

const lines = [
  "kali@jothish-labs:~$ whoami",
  "jothish",
  "kali@jothish-labs:~$ role",
  "Cybersecurity | Networking | Builder",
  "kali@jothish-labs:~$ status",
  "Building secure systems..."
];

export default function TerminalIntro() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;

    if (charIndex < lines[lineIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, currentLine]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(lineIndex + 1);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, currentLine]);

  return (
    <div className="w-full h-full bg-black text-green-400 font-mono text-sm p-6">

      {displayedLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}

      {lineIndex < lines.length && (
        <div>
          {currentLine}
          <span className="animate-pulse">|</span>
        </div>
      )}

    </div>
  );
}