"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronRight, ChevronLeft, Loader2, Check } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const DOMAINS = [
  "AI/ML",
  "Web Development",
  "App Development",
  "Cybersecurity",
  "IoT",
  "Open Innovation",
];

type FormData = {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  department: string;
  semester: string;
  teamSize: number;
  participants: {
    fullName: string;
    email: string;
    phone: string;
    rollNumber: string;
    department: string;
  }[];
  projectTitle: string;
  problemStatement: string;
  projectDescription: string;
  domain: string;
  technologies: string;
  githubLink?: string;
  demoLink?: string;
  whyParticipate: string;
  participatedBefore: boolean;
  terms: boolean;
};

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      teamSize: 1,
      participants: [{ fullName: "", email: "", phone: "", rollNumber: "", department: "" }],
      domain: "Web Development",
      participatedBefore: false,
      terms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const teamSize = watch("teamSize");

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "teamName",
        "leaderName",
        "leaderEmail",
        "leaderPhone",
        "collegeName",
        "department",
        "semester",
      ];
    } else if (step === 2) {
      fieldsToValidate = fields.map((_, index) => `participants.${index}` as any);
    } else if (step === 3) {
      fieldsToValidate = [
        "projectTitle",
        "problemStatement",
        "projectDescription",
        "domain",
        "technologies",
      ];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormData) => {
    if (data.participants.length !== Number(data.teamSize)) {
      toast.error(`Expected ${data.teamSize} participants, but found ${data.participants.length}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/hackathon/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        // Store success data in session storage for the success page
        sessionStorage.setItem("registrationSuccess", JSON.stringify(result));
        router.push("/hackathon/success");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Progress Bar */}
      <div className="mb-10 space-y-4">
        <div className="flex justify-between text-sm font-medium text-zinc-400">
          <span>Step {step} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full bg-linear-to-r from-orange-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Team Information</h2>
                <p className="text-zinc-400">Start by telling us about your team and its leader.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputGroup
                  label="Team Name"
                  id="teamName"
                  placeholder="Enter team name"
                  error={errors.teamName?.message}
                  {...register("teamName", { required: "Team name is required" })}
                />
                <InputGroup
                  label="Team Leader Name"
                  id="leaderName"
                  placeholder="Full name"
                  error={errors.leaderName?.message}
                  {...register("leaderName", { required: "Leader name is required" })}
                />
                <InputGroup
                  label="Leader Email"
                  id="leaderEmail"
                  type="email"
                  placeholder="email@example.com"
                  error={errors.leaderEmail?.message}
                  {...register("leaderEmail", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                />
                <InputGroup
                  label="Leader Phone Number"
                  id="leaderPhone"
                  placeholder="Phone number"
                  error={errors.leaderPhone?.message}
                  {...register("leaderPhone", {
                    required: "Phone is required",
                    pattern: { value: /^\d+$/, message: "Only digits allowed" },
                  })}
                />
                <InputGroup
                  label="Department / Course"
                  id="department"
                  placeholder="e.g. Computer Science"
                  error={errors.department?.message}
                  {...register("department", { required: "Department is required" })}
                />
                <InputGroup
                  label="Year / Semester"
                  id="semester"
                  placeholder="e.g. 3rd Year / 6th Sem"
                  error={errors.semester?.message}
                  {...register("semester", { required: "Semester is required" })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Team Size (1-5)</label>
                  <select
                    {...register("teamSize", { required: true, min: 1, max: 5 })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden focus:border-orange-500/50"
                  >
                    {[5].map((s) => (
                      <option key={s} value={s} className="bg-[#121212]">
                        {s} members
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Participant Details</h2>
                <p className="text-zinc-400">
                  Provide details for all {teamSize} participants.
                </p>
              </div>

              <div className="space-y-8">
                {fields.map((field, index) => (
                  <div key={field.id} className="panel-subtle relative p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-orange-400">
                        Participant {index + 1}
                        {index === 0 && <span className="ml-2 text-xs text-zinc-500">(Leader)</span>}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InputGroup
                        label="Full Name"
                        id={`participants.${index}.fullName`}
                        placeholder="Name"
                        error={errors.participants?.[index]?.fullName?.message}
                        {...register(`participants.${index}.fullName` as const, {
                          required: "Full name is required",
                        })}
                      />
                      <InputGroup
                        label="Email"
                        id={`participants.${index}.email`}
                        type="email"
                        placeholder="email@example.com"
                        error={errors.participants?.[index]?.email?.message}
                        {...register(`participants.${index}.email` as const, {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                        })}
                      />
                      <InputGroup
                        label="Phone Number"
                        id={`participants.${index}.phone`}
                        placeholder="Phone"
                        error={errors.participants?.[index]?.phone?.message}
                        {...register(`participants.${index}.phone` as const, {
                          required: "Phone is required",
                          pattern: { value: /^\d+$/, message: "Only digits allowed" },
                        })}
                      />
                      <InputGroup
                        label="Examination Roll Number"
                        id={`participants.${index}.rollNumber`}
                        placeholder="Roll No"
                        error={errors.participants?.[index]?.rollNumber?.message}
                        {...register(`participants.${index}.rollNumber` as const, {
                          required: "Roll number is required",
                        })}
                      />
                      <InputGroup
                        label="Course / Department"
                        id={`participants.${index}.department`}
                        placeholder="e.g. BCA / CSE"
                        error={errors.participants?.[index]?.department?.message}
                        {...register(`participants.${index}.department` as const, {
                          required: "Department is required",
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {fields.length < Number(teamSize) && (
                <button
                  type="button"
                  onClick={() =>
                    append({ fullName: "", email: "", phone: "", rollNumber: "", department: "" })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-4 text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Add Participant
                </button>
              )}
              {fields.length > Number(teamSize) && (
                <p className="text-sm text-red-400">
                  You have added more participants than the selected team size ({teamSize}). Please remove extra participants.
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Project Information</h2>
                <p className="text-zinc-400">Tell us what you are planning to build.</p>
              </div>

              <div className="space-y-6">
                <InputGroup
                  label="Project Title"
                  id="projectTitle"
                  placeholder="Cool project name"
                  error={errors.projectTitle?.message}
                  {...register("projectTitle", { required: "Project title is required" })}
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Problem Statement</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of the problem you are solving"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden focus:border-orange-500/50"
                    {...register("problemStatement", { required: "Problem statement is required" })}
                  />
                  {errors.problemStatement && (
                    <p className="text-xs text-red-400">{errors.problemStatement.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Project Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your solution in detail"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden focus:border-orange-500/50"
                    {...register("projectDescription", { required: "Project description is required" })}
                  />
                  {errors.projectDescription && (
                    <p className="text-xs text-red-400">{errors.projectDescription.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Preferred Domain</label>
                    <select
                      {...register("domain", { required: "Domain is required" })}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden focus:border-orange-500/50"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d} className="bg-[#121212]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputGroup
                    label="Technologies Used"
                    id="technologies"
                    placeholder="e.g. Next.js, FastAPI, MongoDB"
                    error={errors.technologies?.message}
                    {...register("technologies", { required: "Technologies are required" })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <InputGroup
                    label="GitHub Link (Optional)"
                    id="githubLink"
                    placeholder="https://github.com/..."
                    error={errors.githubLink?.message}
                    {...register("githubLink")}
                  />
                  <InputGroup
                    label="Demo Link (Optional)"
                    id="demoLink"
                    placeholder="https://..."
                    error={errors.demoLink?.message}
                    {...register("demoLink")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Review & Submit</h2>
                <p className="text-zinc-400">Final few questions before you submit.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Why do you want to participate?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your motivation"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden focus:border-orange-500/50"
                    {...register("whyParticipate", { required: "Please tell us why" })}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="participatedBefore"
                    className="h-5 w-5 rounded-md border-white/10 bg-white/5 text-orange-500 accent-orange-500"
                    {...register("participatedBefore")}
                  />
                  <label htmlFor="participatedBefore" className="text-sm text-zinc-300">
                    Have you participated in hackathons before?
                  </label>
                </div>

                <div className="panel-subtle p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-5 w-5 rounded-md border-white/10 bg-white/5 text-orange-500 accent-orange-500"
                      {...register("terms", { required: "You must agree to the terms" })}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed text-zinc-400">
                      I agree to the terms and conditions of Xavathon. I confirm that all participants listed are currently enrolled in the college and will follow the event guidelines.
                    </label>
                  </div>
                  {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}
                </div>

                <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">
                  <p className="text-xs text-orange-200/80 leading-relaxed">
                    <strong>Note:</strong> Once submitted, team details cannot be changed. Ensure all information is accurate.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-full border border-orange-300/70 bg-linear-to-r from-orange-500 to-amber-400 px-8 py-3 text-sm font-bold text-black shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex items-center gap-2 rounded-full border border-orange-300/70 bg-linear-to-r from-orange-500 to-amber-400 px-10 py-3 text-sm font-bold text-black shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const InputGroup = ({ label, error, ...props }: any) => {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-hidden transition-all focus:border-orange-500/50",
          error && "border-red-500/50 focus:border-red-500"
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
