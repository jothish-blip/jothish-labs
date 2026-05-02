"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Certificate } from "./types";

type Props = {
  selectedCert: Certificate | null;
  onClose: () => void;
};

export default function CertificateModal({ selectedCert, onClose }: Props) {
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape Key Listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bulletproof Scroll Lock
  useEffect(() => {
    if (!selectedCert) return;

    // 1. Remember the exact scroll position when modal opens
    const scrollY = window.scrollY;

    // 2. Lock the body in place
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    
    // Optional: Prevents horizontal layout shift when scrollbar disappears
    document.body.style.overflowY = "scroll"; 

    setIframeLoading(true);

    // 3. Cleanup: Restore body and jump back to exact position when modal closes
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      
      window.scrollTo(0, scrollY);
    };
  }, [selectedCert]);

  // Don't render if no cert selected OR if not mounted on client yet
  if (!selectedCert || !mounted) return null;

  // Teleport the modal to the body so it escapes all parent transforms/overflows
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 md:p-12 bg-background/80 backdrop-blur-sm animate-fadeIn transition-opacity duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md w-full max-w-5xl h-[88vh] rounded-md overflow-hidden shadow-2xl flex flex-col cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full h-full">

          {/* HEADER */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white/70 backdrop-blur-sm shrink-0">
            <p className="text-xs font-mono text-black font-semibold truncate pr-4">
              {selectedCert.title}
            </p>

            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <a
                href={selectedCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-blue-600 hover:text-blue-800 uppercase tracking-widest font-bold"
              >
                verify ↗
              </a>

              <button
                onClick={onClose}
                className="text-xs font-mono text-black hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                ✕ close
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="relative flex-1 w-full bg-white">

            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="absolute inset-0 animate-pulse bg-gray-200" />
                <div className="relative text-xs font-mono text-gray-600 bg-white/80 px-4 py-2 rounded-sm backdrop-blur-sm shadow-sm">
                  loading certificate...
                </div>
              </div>
            )}

            <iframe
              key={selectedCert.id}
              src={selectedCert.path}
              className={`w-full h-full border-none relative z-10 transition-opacity duration-300 ${
                iframeLoading ? "opacity-0" : "opacity-100"
              }`}
              title={`Preview of ${selectedCert.title}`}
              onLoad={() => setIframeLoading(false)}
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </div>,
    document.body // Target for the portal
  );
}