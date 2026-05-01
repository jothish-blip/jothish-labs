import { CaseData } from "@/lib/projects/types";

interface Props {
  data: CaseData;
  onOpen: (data: CaseData) => void;
}

export default function CaseCard({ data, onOpen }: Props) {
  return (
    <div 
      onClick={() => onOpen(data)}
      className="group border border-white/5 bg-[#080808] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-zinc-700 transition cursor-pointer hover:bg-white/[0.01]"
    >
      {/* LEFT */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] px-2 py-0.5 bg-zinc-900 text-zinc-500 border border-white/5">REF: {data.id}</span>
          <span className={`font-mono text-[9px] px-2 py-0.5 border uppercase tracking-widest ${
            data.status === 'CRITICAL_RISK' ? 'bg-red-950/20 text-red-500 border-red-500/30' : 
            data.status === 'SECURED' ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/30' :
            'bg-amber-950/20 text-amber-500 border-amber-500/30'
          }`}>
            {data.status}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
          {data.title}
        </h3>
        <p className="text-[13px] text-zinc-500 font-light max-w-xl line-clamp-2 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
        <div className="text-left sm:text-right flex sm:block gap-3 items-center">
          <p className="text-[9px] text-zinc-600 font-mono tracking-widest mb-1 hidden sm:block">RISK</p>
          <p className={`text-sm font-mono ${parseInt(data.riskScore) >= 7 ? "text-red-500" : "text-amber-500"}`}>
            {data.riskScore}
          </p>
        </div>
        <button className="w-10 h-10 border border-zinc-800 flex items-center justify-center group-hover:border-cyan-500 group-hover:bg-cyan-950/30 transition-all rounded-sm">
          <span className="text-zinc-500 group-hover:text-cyan-400 font-mono">→</span>
        </button>
      </div>
    </div>
  );
}