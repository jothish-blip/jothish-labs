/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { X, ExternalLink, ShieldCheck, GraduationCap, Calendar, CheckCircle2, ChevronRight, Layers, Target, BookOpen, Briefcase } from "lucide-react";
import { GoogleSpecialization } from "./types";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

interface Props {
  specialization: GoogleSpecialization | null;
  open: boolean;
  onClose: () => void;
}

function GoogleGIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.6364 12.2727C23.6364 11.4273 23.5636 10.6091 23.4182 9.81818H12V14.4545H18.5273C18.2455 15.9545 17.4091 17.2273 16.1455 18.0727V21.0545H20.0727C22.3727 18.9364 23.6364 15.8909 23.6364 12.2727Z" fill="#4285F4"/>
      <path d="M12 24C15.2727 24 18.0273 22.9091 20.0727 21.0545L16.1455 18.0727C15.0364 18.8182 13.6273 19.2727 12 19.2727C8.85455 19.2727 6.19091 17.1455 5.24545 14.2909H1.21818V17.4091C3.2 21.3455 7.27273 24 12 24Z" fill="#34A853"/>
      <path d="M5.24545 14.2909C5 13.5455 4.87273 12.7818 4.87273 12C4.87273 11.2182 5 10.4545 5.24545 9.70909V6.59091H1.21818C0.436364 8.13636 0 9.99091 0 12C0 14.0091 0.436364 15.8636 1.21818 17.4091L5.24545 14.2909Z" fill="#FBBC05"/>
      <path d="M12 4.72727C13.7818 4.72727 15.3818 5.33636 16.6364 6.53636L20.1545 3.01818C18.0182 1.02727 15.2727 0 12 0C7.27273 0 3.2 2.65455 1.21818 6.59091L5.24545 9.70909C6.19091 6.85455 8.85455 4.72727 12 4.72727Z" fill="#EA4335"/>
    </svg>
  );
}

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function SpecializationModal({
  specialization,
  open,
  onClose,
}: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const courseStartTimeRef = React.useRef<number>(0);

  // Reset course state when opening fresh
  useEffect(() => {
    if (open && specialization) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCourseId(null);
    }
  }, [open, specialization]);

  // Telemetry: track duration
  useEffect(() => {
    if (!open || !specialization) return;
    const startTime = Date.now();
    trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_SPECIALIZATION_OPEN, metadata: { title: specialization.title } });

    return () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        type: TELEMETRY_EVENTS.GOOGLE_SPECIALIZATION_CLOSE,
        metadata: { title: specialization.title, duration_seconds: durationSeconds }
      });
    };
  }, [open, specialization]);

  const selectedCourse = specialization?.courses.find(c => c.id === selectedCourseId) || specialization?.courses[0] || null;

  // Track course view duration
  useEffect(() => {
    if (!selectedCourse) return;
    courseStartTimeRef.current = Date.now();
    trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_COURSE_OPEN, metadata: { course: selectedCourse.title, specialization: specialization?.title } });

    return () => {
      const durationSeconds = Math.round((Date.now() - courseStartTimeRef.current) / 1000);
      trackEvent({
        type: TELEMETRY_EVENTS.GOOGLE_COURSE_CLOSE,
        metadata: { course: selectedCourse.title, specialization: specialization?.title, duration_seconds: durationSeconds }
      });
    };
  }, [selectedCourse, specialization?.title]);

  // Safe body scroll lock
  useScrollLock(open);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);

    // Mobile UX: Scroll to the details panel when a course is selected
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById("course-details-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <>
      <style>{`
        .spec-modal-btn:hover {
          background-color: color-mix(in srgb, var(--accent-about) 10%, transparent) !important;
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
          color: var(--accent-about) !important;
        }
      `}</style>
      
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background/90 backdrop-blur-md border-surface" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-0 sm:p-4 lg:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-[1400px] h-[100dvh] sm:h-[95vh] flex flex-col overflow-hidden border-0 sm:border border-surface bg-background shadow-2xl sm:rounded-md">
                  {specialization && (
                    <>
                      {/* Header */}
                      <div className="flex shrink-0 items-center justify-between border-b border-surface p-4 sm:p-6 bg-surface/10">
                        <div className="flex items-center gap-4">
                          <GoogleGIcon />
                          <div>
                            <Dialog.Title className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-foreground uppercase line-clamp-1 pr-4">
                              {specialization.title}
                            </Dialog.Title>
                            <p className="mt-1 text-[11px] text-muted line-clamp-1">
                              {specialization.shortDescription}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={onClose}
                          className="rounded-sm p-1.5 text-muted hover:bg-surface hover:text-foreground focus:outline-none transition-colors border border-transparent hover:border-surface-strong shrink-0"
                          aria-label="Close modal"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Content Body - 3 Columns */}
                      {/* FIXED MOBILE SCROLLING: Parent container scrolls on mobile, columns scroll independently on desktop */}
                      <div className={`flex min-h-0 flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden ${customScrollbar}`}>
                        
                        {/* LEFT COLUMN: Core Credentials & Overview */}
                        <div className={`flex w-full shrink-0 flex-col gap-10 border-b border-surface p-6 lg:h-full lg:w-[35%] lg:shrink lg:border-b-0 lg:border-r lg:p-8 lg:overflow-y-auto ${customScrollbar}`}>
                          
                          {/* Professional Certificate Expanded */}
                          <section className="flex flex-col">
                            <div className="mb-4 flex items-center gap-2">
                              <GraduationCap className="text-muted" size={14} />
                              <h3 className="text-[9px] font-mono uppercase tracking-[0.24em] text-foreground">
                                Professional Certificate
                              </h3>
                            </div>
                            
                            {/* Color Certificate Image */}
                            <div className="group relative rounded-md border border-surface bg-surface/20 p-2">
                              <img
                                loading="lazy"
                                src={specialization.professionalCertificate.image}
                                alt={`${specialization.title} Certificate`}
                                className="w-full h-auto rounded-sm object-contain transition-transform duration-500 hover:scale-[1.02] shadow-sm bg-white"
                              />
                            </div>

                            <div className="mt-8 flex flex-col gap-8">
                              <p className="text-[13px] leading-relaxed text-muted">
                                {specialization.professionalCertificate.overview}
                              </p>

                              <div className="space-y-4 rounded-md bg-surface/10 p-5 border border-surface">
                                <div>
                                  <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">Learning Outcomes</h4>
                                  <ul className="space-y-3">
                                    {specialization.professionalCertificate.learningOutcomes.map((outcome, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-[12px] text-foreground/80">
                                        <ChevronRight size={14} className="text-muted shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{outcome}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-3">Professional Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {specialization.professionalCertificate.professionalSkills.map(skill => (
                                    <span key={skill} className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Briefcase className="text-muted" size={12} />
                                  <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">Career Relevance</h4>
                                </div>
                                <p className="text-[13px] leading-relaxed text-foreground/80">
                                  {specialization.professionalCertificate.careerRelevance}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 pt-6 border-t border-surface gap-4">
                                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                                  <Calendar size={12} />
                                  <span>{specialization.professionalCertificate.issuedDate}</span>
                                </div>
                                <a
                                  href={specialization.professionalCertificate.credentialUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_VERIFY_CLICK, metadata: { type: 'certificate', title: specialization.title }})}
                                  className="spec-modal-btn inline-flex items-center justify-center gap-1.5 rounded-sm border border-surface bg-surface/20 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.24em] text-foreground transition-all"
                                >
                                  View Credential
                                  <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          </section>

                          {/* Credly Badge Expanded */}
                          <section className="flex flex-col pt-8 border-t border-surface">
                            <div className="mb-4 flex items-center gap-2">
                              <ShieldCheck size={14} style={{ color: 'var(--accent-about)' }} />
                              <h3 className="text-[9px] font-mono uppercase tracking-[0.24em] text-foreground">
                                Credly Verified
                              </h3>
                            </div>
                            
                            <div className="flex flex-col items-center rounded-md border border-surface bg-surface/10 p-6 sm:p-8 text-center">
                              <img
                                loading="lazy"
                                src={specialization.credlyBadge.image}
                                alt="Credly Badge"
                                className="h-24 w-24 object-contain transition-transform duration-500 hover:scale-[1.05]"
                              />
                              
                              <p className="mt-6 text-[13px] leading-relaxed text-muted max-w-[280px]">
                                {specialization.credlyBadge.explanation}
                              </p>

                              <div className="mt-8 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between border-t border-surface pt-6 gap-4">
                                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                                  <Calendar size={12} />
                                  <span>{specialization.credlyBadge.issuedDate}</span>
                                </div>
                                <a
                                  href={specialization.credlyBadge.badgeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_VERIFY_CLICK, metadata: { type: 'badge', title: specialization.title }})}
                                  className="inline-flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] transition-colors hover:opacity-80"
                                  style={{ color: 'var(--accent-about)' }}
                                >
                                  Verify Badge
                                  <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          </section>
                        </div>

                        {/* CENTER COLUMN: Learning Journey Timeline */}
                        <div className={`flex w-full shrink-0 flex-col border-b border-surface bg-background p-6 lg:h-full lg:w-[30%] lg:shrink lg:border-b-0 lg:border-r lg:p-8 lg:overflow-y-auto ${customScrollbar}`}>
                          <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-[9px] font-mono uppercase tracking-[0.24em] text-foreground">
                              Learning Journey
                            </h3>
                            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted bg-surface/40 px-2 py-1 rounded-sm border border-surface">
                              {specialization.courseCount} Courses
                            </span>
                          </div>
                          
                          <div className="relative flex flex-col gap-2">
                            {/* Vertical Timeline Line */}
                            <div className="absolute bottom-6 left-[15px] top-6 w-[1px] bg-surface-strong" />
                            
                            {specialization.courses.map((course, index) => {
                              const isSelected = selectedCourse?.id === course.id;
                              
                              return (
                                <button
                                  key={course.id}
                                  onClick={() => handleSelectCourse(course.id)}
                                  className="group relative flex w-full items-start gap-4 rounded-md p-3 text-left transition-all duration-300 border border-transparent focus:outline-none"
                                  style={isSelected ? {
                                    backgroundColor: 'color-mix(in srgb, var(--accent-about) 5%, transparent)',
                                    borderColor: 'color-mix(in srgb, var(--accent-about) 20%, transparent)'
                                  } : {}}
                                >
                                  <style jsx>{`
                                    button:not([style*="background-color"]):hover {
                                      background-color: var(--surface);
                                      border-color: var(--surface-strong);
                                    }
                                  `}</style>
                                  
                                  {/* Timeline Node */}
                                  <div 
                                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border bg-background transition-colors duration-300 ${
                                      isSelected ? "" : "border-surface text-muted group-hover:border-surface-strong"
                                    }`}
                                    style={isSelected ? {
                                      borderColor: 'var(--accent-about)',
                                      color: 'var(--accent-about)'
                                    } : {}}
                                  >
                                    <CheckCircle2 size={12} className={isSelected ? "" : "text-surface-strong group-hover:text-muted"} />
                                  </div>
                                  
                                  <div className="flex-1 pt-0.5">
                                    <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                                      Course {index + 1}
                                    </span>
                                    <p className={`mt-1 text-[13px] font-medium leading-snug transition-colors duration-300 ${
                                      isSelected ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
                                    }`}>
                                      {course.title}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Course Details */}
                        <div id="course-details-panel" className={`flex w-full shrink-0 flex-col bg-background lg:h-full lg:w-[35%] lg:shrink lg:bg-surface/5 p-6 lg:p-8 lg:overflow-y-auto ${customScrollbar}`}>
                          <AnimatePresence mode="wait">
                            {selectedCourse ? (
                              <motion.div
                                key={selectedCourse.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                // FIXED: flex-1 ensures it grows dynamically, avoiding restrictive min-h-full cutoffs
                                className="flex flex-col flex-1"
                              >
                                <div className="flex items-center gap-2 mb-4">
                                  <BookOpen className="text-muted" size={12} />
                                  <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                                    Course Details
                                  </p>
                                </div>
                                
                                <h3 className="text-[17px] font-medium tracking-tight text-foreground leading-tight uppercase">
                                  {selectedCourse.title}
                                </h3>
                                
                                <p className="mt-4 text-[13px] leading-relaxed text-muted">
                                  {selectedCourse.description}
                                </p>

                                {/* Color Course Image */}
                                <div className="mt-8 rounded-md border border-surface bg-background p-2 flex justify-center">
                                  <img
                                    loading="lazy"
                                    src={selectedCourse.image}
                                    alt={`${selectedCourse.title} Certificate`}
                                    className="w-full h-auto rounded-sm object-contain transition-transform duration-500 hover:scale-[1.02] shadow-sm bg-white"
                                  />
                                </div>

                                <div className="mt-10 flex flex-col gap-10">
                                  {/* Key Takeaways */}
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Target className="text-muted" size={12} />
                                      <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-foreground">
                                        Key Takeaways
                                      </h4>
                                    </div>
                                    <div className="rounded-md border border-surface bg-surface/10 p-5">
                                      <ul className="space-y-3">
                                        {selectedCourse.takeaways.map((takeaway, idx) => (
                                          <li key={idx} className="flex items-start gap-2.5 text-[13px] text-muted">
                                            <span 
                                              className="mt-1.5 h-1 w-1 rounded-full shrink-0" 
                                              style={{ backgroundColor: 'var(--accent-about)' }}
                                            />
                                            <span className="leading-relaxed">{takeaway}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Skills */}
                                  <div>
                                    <div className="flex items-center gap-2 mb-4">
                                      <Layers className="text-muted" size={12} />
                                      <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-foreground">
                                        Skills Learned
                                      </h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCourse.skills.map((skill) => (
                                        <span
                                          key={skill}
                                          className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted transition-colors hover:bg-background"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Bottom Action Row - Auto pushes to bottom safely */}
                                <div className="mt-auto pt-10">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-surface pt-5 gap-4">
                                    <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                                      <Calendar size={12} />
                                      <span>{selectedCourse.issuedDate}</span>
                                    </div>
                                    <a
                                      href={selectedCourse.credentialUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={() => trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_VERIFY_CLICK, metadata: { type: 'course', title: selectedCourse.title }})}
                                      className="spec-modal-btn inline-flex items-center justify-center gap-1.5 rounded-sm border border-surface bg-surface/20 px-4 py-2 text-[9px] font-mono uppercase tracking-[0.24em] text-foreground transition-all shrink-0"
                                    >
                                      Verify Course
                                      <ExternalLink size={10} />
                                    </a>
                                  </div>
                                </div>
                                
                                {/* FIXED: Uncollapsible spacer guarantees the scroll container gives space for the button */}
                                <div className="h-8 w-full shrink-0"></div>

                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full min-h-[300px] flex-col items-center justify-center text-center pb-8"
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-surface/20 border border-surface">
                                  <GraduationCap size={20} className="text-muted" />
                                </div>
                                <h3 className="mt-4 text-[13px] font-medium text-foreground uppercase tracking-wider">
                                  No course selected
                                </h3>
                                <p className="mt-2 max-w-[250px] text-[11px] text-muted leading-relaxed">
                                  Select a course from the learning journey timeline to explore the curriculum.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}