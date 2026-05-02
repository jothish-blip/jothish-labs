export default function FocusSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-y border-surface">
      <div className="lg:col-span-8 space-y-6">
        <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest">
          // CURRENT FOCUS
        </h4>
        <div className="space-y-4">
          <p className="text-muted text-sm leading-relaxed max-w-2xl">
            Right now, I'm focused on building a strong foundation — working with network traffic, system logs, and basic security scenarios.
          </p>
          <p className="text-muted text-sm leading-relaxed max-w-2xl">
            I spend most of my time experimenting, testing things, and trying to understand why something works — not just how.
          </p>
          <p className="text-muted text-xs font-mono pt-2">
            Most of my learning comes from testing systems and observing outcomes.
          </p>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest">
          // LEARNING APPROACH
        </h4>
        <p className="text-muted text-[13px] leading-relaxed mb-4 max-w-md">
          These are the tools I'm using to explore and understand systems in a practical way.
        </p>

        <div className="space-y-5">
          {[
            { title: "Linux", desc: "My base environment — where I practice commands, permissions, and system-level understanding." },
            { title: "Wireshark", desc: "Used to inspect packet-level data and understand how traffic behaves in real scenarios." },
            { title: "tcpdump", desc: "Practicing command-line packet capture to observe raw traffic directly." },
            { title: "SQL", desc: "Learning how to filter and analyze data to identify patterns and anomalies." }
          ].map((tool) => (
            <div key={tool.title} className="group border-l border-surface pl-4 hover:border-[var(--accent)] transition cursor-default">
              <p className="text-foreground text-sm font-medium flex items-center">
                {tool.title}
                <span className="text-[9px] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity ml-2 uppercase tracking-widest">learning</span>
              </p>
              <p className="text-[11px] text-muted pt-1 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}