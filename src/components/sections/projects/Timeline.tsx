import { TimelineEvent, PlaybackStep } from "@/lib/projects/types";

interface Props {
  steps: TimelineEvent[] | PlaybackStep[];
  activeStep: number;
  onStepChange: (step: number) => void;
  isPlaybackContext: boolean;
}

export default function Timeline({ steps, activeStep, onStepChange, isPlaybackContext }: Props) {
  return (
    <div className="space-y-6 border-b border-white/5 pb-8">
      <h4 className="font-mono text-[10px] text-cyan-500 tracking-[0.4em] uppercase">
        // {isPlaybackContext ? "INVESTIGATION_LOG" : "INVESTIGATION_TIMELINE"}
      </h4>
      <div className="relative">
        <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-white/10"></div>
        <div className="space-y-6">
          {steps.map((event, i) => (
            <div 
              key={i} 
              className="relative pl-6 cursor-pointer group"
              onClick={() => onStepChange(i)}
            >
              <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full transition-all ${
                activeStep === i ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-125" : "bg-cyan-900 group-hover:bg-cyan-700"
              }`}></div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <p className={`text-[10px] font-mono transition-colors ${activeStep === i ? "text-cyan-400" : "text-zinc-600"}`}>
                    STEP {String(i + 1).padStart(2, "0")}
                  </p>
                  {'tag' in event && event.tag && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 text-zinc-400 rounded-sm tracking-widest">
                      {event.tag}
                    </span>
                  )}
                </div>
                <h5 className={`text-[13px] font-semibold transition-colors ${activeStep === i ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}>
                  {event.title}
                </h5>
                {'desc' in event && (
                  <p className={`text-xs leading-relaxed transition-all duration-300 overflow-hidden ${
                    activeStep === i ? "text-zinc-400 max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    {event.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}