import { activeCerts } from "./data";

export default function CompTIASection() {
  return (
    <div className="border-t border-surface pt-10 max-w-3xl mx-auto space-y-8">
      <div className="space-y-3 text-center flex flex-col items-center">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#E4002B] uppercase">
          CERTIFICATION TRACK
        </p>
        
        <h3 className="text-2xl font-semibold tracking-tight">
          <span className="text-[#E4002B] font-bold">CompTIA</span>{" "}
          Certifications
        </h3>
        
        <p className="text-[10px] font-mono text-[#E4002B] font-bold bg-[#E4002B]/10 px-3 py-1 rounded-sm mt-2 inline-block">
          2 Certifications In Progress
        </p>

        <div className="w-16 h-[2px] bg-[#E4002B] mx-auto opacity-70 mt-4"></div>
        
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed mt-4">
          Focused on Security+ and Linux+ — building practical understanding through consistent work.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {activeCerts.map((cert) => (
          <div
            key={cert.id}
            className="group relative w-[260px] border border-surface rounded-md p-6 bg-surface hover:border-[#E4002B] hover:-translate-y-1 hover:shadow-xl hover:bg-surface/80 transition-all duration-300"
          >
            {/* Status */}
            <span className="absolute top-4 right-4 text-[8px] font-mono px-2 py-1 border border-[#E4002B]/30 text-[#E4002B] bg-[#E4002B]/10 uppercase tracking-widest rounded-sm">
              in progress
            </span>

            <div>
              <p className="text-[9px] font-mono text-muted mb-1.5 uppercase tracking-widest">
                CompTIA Certification
              </p>

              <h4 className="font-bold text-sm text-foreground tracking-tight uppercase leading-tight pr-16">
                {cert.title}
              </h4>

              {/* Skills */}
              <p className="text-[9px] font-mono text-muted uppercase tracking-widest mt-3 mb-1">
                focus areas
              </p>

              <div className="flex flex-wrap gap-1.5">
                {cert.skills.split(", ").slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-2 py-[2px] border border-surface text-muted bg-background/50 rounded-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-5 pb-2">
                <div className="h-[4px] bg-background w-full rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E4002B] transition-all duration-700 ease-out"
                    style={{ width: `${cert.progress}%` }}
                  />
                </div>

                <p className="text-[10px] font-mono text-muted mt-2 flex justify-between">
                  <span>progress</span>
                  <span>{cert.progress}%</span>
                </p>
              </div>
            </div>

            {/* Active Focus Highlight */}
            {cert.progress >= 40 && (
              <span className="absolute bottom-4 right-4 text-[8px] font-mono text-[var(--accent)] uppercase tracking-widest font-bold">
                active focus
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}