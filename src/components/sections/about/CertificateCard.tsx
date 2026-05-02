import React from "react";
import { Certificate } from "./types";

type Props = {
  cert: Certificate;
  onPreview?: (cert: Certificate) => void;
};

const CertificateCard = ({ cert, onPreview }: Props) => {
  const isVerified = cert.status === "verified";

  // Dynamic status badge styling
  const statusColors = {
    "verified": "border-green-500/30 text-green-400 bg-green-500/10",
    "in progress": "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    "upcoming": "border-gray-400/30 text-gray-400 bg-gray-400/10"
  };

  return (
    <div className={`group relative flex flex-col justify-between border border-surface rounded-md p-6 transition-all duration-300 ${
      isVerified 
        ? "bg-surface hover:border-green-500 hover:-translate-y-1 hover:shadow-xl" 
        : "bg-background hover:bg-surface hover:shadow-md"
    }`}>
      
      {/* Status Badge */}
      <span className={`absolute top-4 right-4 text-[8px] font-mono px-2 py-1 border uppercase tracking-widest rounded-sm ${statusColors[cert.status]}`}>
        {cert.status}
      </span>

      <div>
        <p className="text-[9px] font-mono text-muted mb-1.5 uppercase tracking-widest">
          Google Professional Certificate • Course {cert.courseNumber}
        </p>

        <h4 className={`font-bold text-sm mb-1 text-foreground tracking-tight uppercase leading-tight ${isVerified ? "pr-16" : "pr-20"}`}>
          {cert.title}
          {cert.isLatest && (
            <span className="inline-block ml-2 mb-1 text-[8px] text-[var(--accent)] font-mono uppercase tracking-widest bg-[var(--accent-soft)] px-1.5 py-0.5 rounded-sm align-middle">
              latest
            </span>
          )}
        </h4>

        {/* Skill Preview */}
        <p className="text-[10px] text-muted mb-4 font-medium">
          {cert.skills}
        </p>

        <p className="text-[11px] font-mono text-muted">
          {isVerified ? `Issued by ${cert.issuer} • ${cert.date}` : cert.date}
        </p>

        {isVerified && (
          <p className="text-[10px] font-mono text-muted mt-2">
            ID: {cert.credentialId}
          </p>
        )}
      </div>

      {/* Action Area based on status */}
      {isVerified ? (
        <div>
          <div className="mt-6 flex gap-2">
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[1.2] flex items-center justify-center text-[9px] font-mono px-3 py-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all uppercase tracking-widest rounded-sm active:scale-95"
            >
              verify ↗
            </a>
            <button
              onClick={() => onPreview && onPreview(cert)}
              className="flex-[0.8] flex items-center justify-center text-[9px] font-mono px-3 py-2 border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:shadow-sm hover:scale-[1.02] transition-all uppercase tracking-widest rounded-sm active:scale-95"
            >
              view
            </button>
          </div>
          <p className="text-[9px] text-muted mt-3 text-center">
            Official verification • Certificate preview
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[9px] font-mono text-muted mt-6 text-center border border-dashed border-surface py-2 uppercase tracking-widest bg-surface/30">
            Certificate available after completion
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(CertificateCard);