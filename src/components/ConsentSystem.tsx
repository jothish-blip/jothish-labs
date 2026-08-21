"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, X, Check, FileText, AlertTriangle, ShieldCheck, Lock, Terminal } from 'lucide-react';
import { createPortal } from 'react-dom';

// ── Policy versions ──────────────────────────────────────────────────────────
const POLICY_VERSION = "2.0";
const COOKIE_VERSION = "2.0";

// ── Local-storage keys ───────────────────────────────────────────────────────
const LS_STATUS       = 'pf_consent_status';      // 'accepted' | 'declined'
const LS_POLICY_VER   = 'pf_policy_version';
const LS_COOKIE_VER   = 'pf_cookie_version';
const LS_VISITOR_NAME = 'pf_visitor_name';
const LS_LAST_PROMPT  = 'pf_last_prompt_date';
const LS_PROMPT_COUNT = 'pf_prompt_count';

// ── Policy links ─────────────────────────────────────────────────────────────
const POLICIES = [
  { name: 'Privacy Policy',         path: '/privacy-policy', icon: Lock },
  { name: 'Cookie Policy',          path: '/cookie-policy', icon: Cookie },
  { name: 'Security Policy',        path: '/security-policy', icon: Shield },
  { name: 'Terms & Conditions',     path: '/terms-and-conditions', icon: FileText },
  { name: 'Responsible Disclosure', path: '/responsible-disclosure', icon: Terminal },
];

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

// ── Helpers ──────────────────────────────────────────────────────────────────
function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function safeLS(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function setSafeLS(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ConsentSystem() {
  const [mounted,          setMounted]          = useState(false);
  const [portalRoot,       setPortalRoot]       = useState<Element | null>(null);
  const [showModal,        setShowModal]        = useState(false);
  const [policyUpdated,    setPolicyUpdated]    = useState(false);
  const [name,             setName]             = useState('');
  const [nameError,        setNameError]        = useState('');
  const [acceptPolicies,   setAcceptPolicies]   = useState(false);
  const [acceptCookies,    setAcceptCookies]    = useState(false);
  const [toastVisible,     setToastVisible]     = useState(false);
  const [isPrevDeclined,   setIsPrevDeclined]   = useState(false);

  const modalRef   = useRef<HTMLDivElement>(null);
  const firstFocus = useRef<HTMLElement | null>(null);

  // ── Mount / portal ──────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    setPortalRoot(document.body);
  }, []);

  // ── Decide whether to show the modal ────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const status      = safeLS(LS_STATUS);
    const savedPolicy = safeLS(LS_POLICY_VER);
    const savedCookie = safeLS(LS_COOKIE_VER);
    const lastPrompt  = safeLS(LS_LAST_PROMPT);

    const versionMismatch =
      savedPolicy !== POLICY_VERSION || savedCookie !== COOKIE_VERSION;

    // Previously accepted — only re-prompt if version changed
    if (status === 'accepted') {
      if (!versionMismatch) return;
      setPolicyUpdated(true);
      // Fall through to show modal
    }

    // Previously declined — show at most once per calendar day
    if (status === 'declined') {
      setIsPrevDeclined(true);
      if (lastPrompt) {
        const last = new Date(lastPrompt);
        if (isSameCalendarDay(last, new Date())) return; // already shown today
      }
    }

    const timer = setTimeout(() => setShowModal(true), 800);
    return () => clearTimeout(timer);
  }, [mounted]);

  // ── Focus trap + scroll lock ─────────────────────────────────────────────
  useEffect(() => {
    if (!showModal || !modalRef.current) return;

    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    firstFocus.current = first;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Only escape-to-dismiss if visitor already declined before
        if (isPrevDeclined) dismiss();
        return;
      }
      if (e.key !== 'Tab') return;
      if (!focusable.length) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus the name input first; fall back to first focusable
    const nameInput = modalRef.current.querySelector<HTMLInputElement>('#consent-name');
    (nameInput ?? first)?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [showModal, isPrevDeclined]);

  // ── Send consent to backend ──────────────────────────────────────────────
  const sendToBackend = useCallback(
    async (payload: {
      visitorName: string;
      cookieConsent: boolean;
      policyAccepted: boolean;
      policyVersion: string;
      cookieVersion: string;
      acceptedAt?: string;
    }) => {
      try {
        await fetch('/api/telemetry/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Silently fail; local storage already persists intent
      }
    },
    []
  );

  // ── Fire telemetry event ─────────────────────────────────────────────────
  const sendEvent = useCallback((eventName: string, extra: Record<string, unknown> = {}) => {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        eventName,
        eventData: extra,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {/* noop */});
  }, []);

  // ── Name validation ──────────────────────────────────────────────────────
  const validateName = (v: string) => {
    if (!v.trim()) return ''; // optional
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    if (v.trim().length > 40) return 'Name must be 40 characters or fewer.';
    // Block scripts / HTML-injection attempts
    if (/<[^>]*>/.test(v))          return 'Name must not contain HTML.';
    if (/javascript:/i.test(v))     return 'Name contains invalid content.';
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setNameError(validateName(val));
  };

  // ── Dismiss (decline path) ───────────────────────────────────────────────
  const dismiss = useCallback(() => {
    const now   = new Date().toISOString();
    const count = parseInt(safeLS(LS_PROMPT_COUNT) ?? '0', 10) + 1;
    setSafeLS(LS_STATUS,       'declined');
    setSafeLS(LS_LAST_PROMPT,  now);
    setSafeLS(LS_PROMPT_COUNT, String(count));

    sendToBackend({
      visitorName: 'Anonymous',
      cookieConsent: false,
      policyAccepted: false,
      policyVersion: POLICY_VERSION,
      cookieVersion: COOKIE_VERSION,
    });
    sendEvent('Consent Declined');

    setShowModal(false);
  }, [sendToBackend, sendEvent]);

  // ── Accept ────────────────────────────────────────────────────────────────
  const handleAccept = useCallback(() => {
    if (!acceptPolicies || !acceptCookies) return;
    const nameErr = validateName(name);
    if (nameErr) { setNameError(nameErr); return; }

    const now           = new Date().toISOString();
    const sanitizedName = name.trim() || 'Anonymous';

    setSafeLS(LS_STATUS,       'accepted');
    setSafeLS(LS_POLICY_VER,   POLICY_VERSION);
    setSafeLS(LS_COOKIE_VER,   COOKIE_VERSION);
    setSafeLS(LS_VISITOR_NAME, sanitizedName);
    setSafeLS(LS_LAST_PROMPT,  now);
    setSafeLS(LS_PROMPT_COUNT, '0');

    sendToBackend({
      visitorName: sanitizedName,
      cookieConsent: true,
      policyAccepted: true,
      policyVersion: POLICY_VERSION,
      cookieVersion: COOKIE_VERSION,
      acceptedAt: now,
    });
    sendEvent('Consent Accepted', {
      visitorNameProvided: sanitizedName !== 'Anonymous',
    });

    setShowModal(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, [acceptPolicies, acceptCookies, name, sendToBackend, sendEvent]);

  const handlePolicyLinkClick = (policyName: string) => {
    sendEvent('Policies Opened', { policyName });
  };

  const canContinue = acceptPolicies && acceptCookies && !nameError;

  // ── Modal JSX ─────────────────────────────────────────────────────────────
  const modal = (
    <AnimatePresence>
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
        >
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
            onClick={isPrevDeclined ? dismiss : undefined}
            aria-hidden="true"
          />

          {/* Glass card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.94, y: 24  }}
            transition={{ type: 'spring', bounce: 0.28, duration: 0.55 }}
            className={`relative w-full max-w-2xl bg-background border border-surface rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto ${customScrollbar}`}
          >
            {/* Dismiss button — only when previously declined */}
            {isPrevDeclined && (
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-sm text-muted hover:text-foreground hover:bg-surface border border-transparent hover:border-surface-strong transition-colors"
                aria-label="Close without consenting"
              >
                <X size={16} />
              </button>
            )}

            {/* Header */}
            <div className="mb-8 border-b border-surface pb-6">
              <h2 id="consent-title" className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-emerald-500" /> Security & Privacy Initialization
              </h2>
              <p id="consent-desc" className="text-[14px] text-muted leading-relaxed">
                Before continuing, please review how this environment handles your privacy, security, and telemetry data. This portfolio operates on a transparent, security-first architecture.
              </p>
              
              {policyUpdated && (
                <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[12px] font-medium">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Our policies have been updated since your last visit. Please review the latest changes.
                  </span>
                </div>
              )}
            </div>

            {/* Policy Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {POLICIES.map((p) => (
                <a
                  key={p.name}
                  href={p.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePolicyLinkClick(p.name)}
                  className="group flex flex-col items-center justify-center p-4 bg-surface/5 border border-surface hover:border-surface-strong hover:bg-surface/20 rounded-md transition-all text-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  aria-label={`Open ${p.name} in new tab`}
                >
                  {p.icon && <p.icon size={16} className="text-muted group-hover:text-foreground transition-colors" />}
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                    {p.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Optional Identification */}
            <div className="mb-8 bg-surface/5 border border-surface p-5 rounded-md">
              <label htmlFor="consent-name" className="block text-[10px] font-mono uppercase tracking-widest text-foreground mb-3 flex items-center justify-between">
                <span>Visitor Designation</span>
                <span className="text-muted bg-surface/30 px-2 py-1 rounded-sm border border-surface">Optional</span>
              </label>
              <input
                id="consent-name"
                type="text"
                autoComplete="given-name"
                maxLength={40}
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Guest-01"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
                className={`w-full bg-background border rounded-sm px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-muted/40 outline-none transition-all duration-300 focus:ring-1 focus:ring-emerald-500/30 ${
                  nameError ? 'border-red-500/50 focus:border-red-500/50' : 'border-surface focus:border-emerald-500/50'
                }`}
              />
              {nameError && (
                <p id="name-error" role="alert" className="mt-2 text-[10px] font-mono uppercase tracking-widest text-red-500">
                  {nameError}
                </p>
              )}
            </div>

            {/* Consent Checkboxes */}
            <fieldset className="space-y-4 mb-8">
              <legend className="sr-only">Consent checkboxes</legend>

              {/* Policies */}
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={acceptPolicies}
                    onChange={e => setAcceptPolicies(e.target.checked)}
                    className="peer sr-only"
                    aria-label="Accept all policies"
                  />
                  <div className="w-[18px] h-[18px] rounded-sm border border-surface bg-surface/30 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-colors flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/50">
                    <Check size={12} className={`text-emerald-500 transition-opacity ${acceptPolicies ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[13px] text-muted group-hover:text-foreground transition-colors leading-relaxed">
                  I have read and accept the{' '}
                  <a href="/privacy-policy" target="_blank" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Privacy Policy</a>,{' '}
                  <a href="/terms-and-conditions" target="_blank" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Terms & Conditions</a>,
                  and acknowledge the{' '}
                  <a href="/security-policy" target="_blank" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Security Policy</a> directives.
                </span>
              </label>

              {/* Cookies */}
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={acceptCookies}
                    onChange={e => setAcceptCookies(e.target.checked)}
                    className="peer sr-only"
                    aria-label="Accept cookie use"
                  />
                  <div className="w-[18px] h-[18px] rounded-sm border border-surface bg-surface/30 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 transition-colors flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/50">
                    <Check size={12} className={`text-emerald-500 transition-opacity ${acceptCookies ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[13px] text-muted group-hover:text-foreground transition-colors leading-relaxed">
                  I consent to the use of strictly necessary and operational cookies as detailed in the{' '}
                  <a href="/cookie-policy" target="_blank" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Cookie Policy</a>.
                </span>
              </label>
            </fieldset>

            {/* Actions */}
            <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-surface">
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted hidden sm:block">
                Verification Required
              </span>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-widest text-muted border border-surface bg-surface/10 hover:bg-surface hover:text-foreground transition-all text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  View Policies
                </a>
                <button
                  onClick={handleAccept}
                  disabled={!canContinue}
                  aria-disabled={!canContinue}
                  className={`w-full sm:w-auto px-6 py-3 rounded-sm font-mono text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    canContinue 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-background shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-[0.98]' 
                    : 'bg-surface/10 text-muted border border-surface cursor-not-allowed'
                  }`}
                >
                  <Shield size={14} /> Accept & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // ── Toast JSX ─────────────────────────────────────────────────────────────
  const toast = (
    <AnimatePresence>
      {toastVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1   }}
          exit={{   opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-[99999] bg-background border border-surface rounded-md shadow-2xl p-5 flex items-start gap-4 max-w-sm"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-sm text-emerald-500 shrink-0">
            <Terminal size={16} />
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground font-bold mb-1.5">System Authorized</h4>
            <p className="text-[12px] text-muted leading-relaxed">
              Compliance preferences saved. Full access to the portfolio environment has been granted.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || !portalRoot) return null;

  return (
    <>
      {createPortal(modal, portalRoot)}
      {createPortal(toast, portalRoot)}
    </>
  );
}