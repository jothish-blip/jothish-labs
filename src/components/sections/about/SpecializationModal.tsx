/* eslint-disable @next/next/no-img-element */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShieldCheck, GraduationCap, Calendar, CheckCircle2, ChevronRight, Layers, Target, BookOpen, Briefcase } from "lucide-react";
import { GoogleSpecialization } from "./types";

interface Props {
  specialization: GoogleSpecialization | null;
  open: boolean;
  onClose: () => void;
}

function GoogleGIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.6364 12.2727C23.6364 11.4273 23.5636 10.6091 23.4182 9.81818H12V14.4545H18.5273C18.2455 15.9545 17.4091 17.2273 16.1455 18.0727V21.0545H20.0727C22.3727 18.9364 23.6364 15.8909 23.6364 12.2727Z" fill="#4285F4"/>
      <path d="M12 24C15.2727 24 18.0273 22.9091 20.0727 21.0545L16.1455 18.0727C15.0364 18.8182 13.6273 19.2727 12 19.2727C8.85455 19.2727 6.19091 17.1455 5.24545 14.2909H1.21818V17.4091C3.2 21.3455 7.27273 24 12 24Z" fill="#34A853"/>
      <path d="M5.24545 14.2909C5 13.5455 4.87273 12.7818 4.87273 12C4.87273 11.2182 5 10.4545 5.24545 9.70909V6.59091H1.21818C0.436364 8.13636 0 9.99091 0 12C0 14.0091 0.436364 15.8636 1.21818 17.4091L5.24545 14.2909Z" fill="#FBBC05"/>
      <path d="M12 4.72727C13.7818 4.72727 15.3818 5.33636 16.6364 6.53636L20.1545 3.01818C18.0182 1.02727 15.2727 0 12 0C7.27273 0 3.2 2.65455 1.21818 6.59091L5.24545 9.70909C6.19091 6.85455 8.85455 4.72727 12 4.72727Z" fill="#EA4335"/>
    </svg>
  );
}

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function SpecializationModal({
  specialization,
  open,
  onClose,
}: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const selectedCourse = specialization?.courses.find(c => c.id === selectedCourseId) || specialization?.courses[0] || null;

  return (
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
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 lg:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <Dialog.Panel className="w-full max-w-[1400px] h-[95vh] flex flex-col overflow-hidden rounded-xl border border-surface bg-background shadow-2xl">
                {specialization && (
                  <>
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-surface p-4 sm:p-6 bg-surface/30">
                      <div className="flex items-center gap-4">
                        <GoogleGIcon />
                        <div>
                          <Dialog.Title className="text-lg sm:text-xl font-medium tracking-tight text-foreground">
                            {specialization.title}
                          </Dialog.Title>
                          <p className="mt-0.5 text-sm text-muted">
                            {specialization.shortDescription}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="rounded-full p-2 text-muted hover:bg-surface-strong hover:text-foreground focus:outline-none transition-colors"
                        aria-label="Close modal"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Content Body - 3 Columns */}
                    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                      
                      {/* LEFT COLUMN: Core Credentials & Overview */}
                      <div className={`flex w-full flex-col gap-10 border-b border-surface p-6 lg:w-[35%] lg:border-b-0 lg:border-r lg:p-8 overflow-y-auto ${customScrollbar}`}>
                        
                        {/* Professional Certificate Expanded */}
                        <section className="flex flex-col">
                          <div className="mb-4 flex items-center gap-2">
                            <GraduationCap className="text-accent" size={16} />
                            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-foreground">
                              Professional Certificate
                            </h3>
                          </div>
                          
                          <div className="group relative overflow-hidden rounded-lg border border-surface bg-surface/50 p-2 shadow-sm">
                            <img
                              loading="lazy"
                              src={specialization.professionalCertificate.image}
                              alt={`${specialization.title} Certificate`}
                              className="w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          </div>

                          <div className="mt-8 flex flex-col gap-6">
                            <p className="text-[13px] leading-relaxed text-muted">
                              {specialization.professionalCertificate.overview}
                            </p>

                            <div className="space-y-4 rounded-lg bg-surface/30 p-5 border border-surface">
                              <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3">Learning Outcomes</h4>
                                <ul className="space-y-2">
                                  {specialization.professionalCertificate.learningOutcomes.map((outcome, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-[13px] text-foreground/80">
                                      <ChevronRight size={14} className="text-accent shrink-0 mt-0.5 opacity-80" />
                                      <span className="leading-relaxed">{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted mb-3">Professional Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {specialization.professionalCertificate.professionalSkills.map(skill => (
                                  <span key={skill} className="text-[10px] font-mono px-2.5 py-1 rounded-sm border border-surface bg-background text-muted">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="text-muted" size={14} />
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted">Career Relevance</h4>
                              </div>
                              <p className="text-[13px] leading-relaxed text-foreground/80">
                                {specialization.professionalCertificate.careerRelevance}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-6 border-t border-surface">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-muted">
                                <Calendar size={12} />
                                <span>{specialization.professionalCertificate.issuedDate}</span>
                              </div>
                              <a
                                href={specialization.professionalCertificate.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-sm border border-accent bg-accent/10 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent hover:text-background"
                              >
                                View Credential
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </section>

                        {/* Credly Badge Expanded */}
                        <section className="flex flex-col">
                          <div className="mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" size={16} />
                            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-foreground">
                              Credly Verified
                            </h3>
                          </div>
                          
                          <div className="flex flex-col items-center rounded-lg border border-surface bg-surface/30 p-6 sm:p-8 text-center">
                            <img
                              loading="lazy"
                              src={specialization.credlyBadge.image}
                              alt="Credly Badge"
                              className="h-28 w-28 object-contain drop-shadow-md"
                            />
                            
                            <p className="mt-6 text-[13px] leading-relaxed text-muted max-w-[280px]">
                              {specialization.credlyBadge.explanation}
                            </p>

                            <div className="mt-8 flex w-full items-center justify-between border-t border-surface pt-6">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-muted">
                                <Calendar size={12} />
                                <span>{specialization.credlyBadge.issuedDate}</span>
                              </div>
                              <a
                                href={specialization.credlyBadge.badgeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-emerald-500 hover:text-emerald-400 transition-colors"
                              >
                                Verify Badge
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </section>
                      </div>

                      {/* CENTER COLUMN: Learning Journey Timeline */}
                      <div className={`flex w-full flex-col border-b border-surface bg-background p-6 lg:w-[30%] lg:border-b-0 lg:border-r lg:p-8 overflow-y-auto ${customScrollbar}`}>
                        <div className="mb-8 flex items-center justify-between">
                          <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-foreground">
                            Learning Journey
                          </h3>
                          <span className="text-[10px] font-mono text-muted bg-surface px-2.5 py-1 rounded-sm border border-surface-strong">
                            {specialization.courseCount} Courses
                          </span>
                        </div>
                        
                        <div className="relative flex flex-col gap-2">
                          {/* Vertical Timeline Line */}
                          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-surface-strong/50" />
                          
                          {specialization.courses.map((course, index) => {
                            const isSelected = selectedCourse?.id === course.id;
                            
                            return (
                              <button
                                key={course.id}
                                onClick={() => setSelectedCourseId(course.id)}
                                className={`group relative flex w-full items-start gap-4 rounded-lg p-3 text-left transition-all duration-300 ${
                                  isSelected
                                    ? "bg-surface/50"
                                    : "bg-transparent hover:bg-surface/30"
                                }`}
                              >
                                {/* Timeline Node */}
                                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors duration-300 ${
                                  isSelected
                                    ? "border-accent text-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)]"
                                    : "border-surface-strong text-muted group-hover:border-muted"
                                }`}>
                                  <CheckCircle2 size={16} className={isSelected ? "text-accent" : "text-surface-strong group-hover:text-muted"} />
                                </div>
                                
                                <div className="flex-1 pt-0.5">
                                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted">
                                    Course {index + 1}
                                  </span>
                                  <p className={`mt-1 text-sm font-medium leading-snug transition-colors duration-300 ${
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
                      <div className={`flex w-full flex-col bg-surface/5 p-6 lg:w-[35%] lg:p-8 overflow-y-auto ${customScrollbar}`}>
                        <AnimatePresence mode="wait">
                          {selectedCourse ? (
                            <motion.div
                              key={selectedCourse.id}
                              initial={{ opacity: 0, y: 15, scale: 0.99 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -15, scale: 0.99 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="flex flex-col h-full"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-muted" size={14} />
                                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted">
                                  Course Details
                                </p>
                              </div>
                              
                              <h3 className="text-xl font-medium tracking-tight text-foreground leading-tight">
                                {selectedCourse.title}
                              </h3>
                              
                              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                                {selectedCourse.description}
                              </p>

                              <div className="mt-8 overflow-hidden rounded-lg border border-surface bg-background p-2 shadow-sm">
                                <img
                                  loading="lazy"
                                  src={selectedCourse.image}
                                  alt={`${selectedCourse.title} Certificate`}
                                  className="w-full rounded-md object-cover"
                                />
                              </div>

                              <div className="mt-10 flex flex-col gap-8">
                                {/* Key Takeaways */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Target className="text-muted" size={14} />
                                    <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-foreground">
                                      Key Takeaways
                                    </h4>
                                  </div>
                                  <div className="rounded-lg border border-surface bg-background p-5">
                                    <ul className="space-y-3">
                                      {selectedCourse.takeaways.map((takeaway, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-[13px] text-muted">
                                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
                                          <span className="leading-relaxed">{takeaway}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Skills */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Layers className="text-muted" size={14} />
                                    <h4 className="text-[10px] font-mono uppercase tracking-[0.1em] text-foreground">
                                      Skills Learned
                                    </h4>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedCourse.skills.map((skill) => (
                                      <span
                                        key={skill}
                                        className="text-[10px] font-mono px-2.5 py-1.5 rounded-sm border border-surface bg-surface/50 text-muted transition-colors hover:bg-surface"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-10 pt-8 mt-auto">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-surface pt-6 gap-4">
                                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-muted">
                                    <Calendar size={12} />
                                    <span>{selectedCourse.issuedDate}</span>
                                  </div>
                                  <a
                                    href={selectedCourse.credentialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-surface-strong bg-background px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-foreground transition-all hover:bg-surface hover:border-muted shadow-sm"
                                  >
                                    Verify Course
                                    <ExternalLink size={12} />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
                            >
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/50 border border-surface">
                                <GraduationCap size={24} className="text-muted" />
                              </div>
                              <h3 className="mt-5 text-base font-medium text-foreground">
                                No course selected
                              </h3>
                              <p className="mt-2 max-w-[250px] text-[13px] text-muted leading-relaxed">
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
  );
}