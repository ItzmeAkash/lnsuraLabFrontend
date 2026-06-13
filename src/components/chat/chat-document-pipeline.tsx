"use client";

import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";
import {
  PIPELINE_STEPS,
  type DocumentPipelineState,
  type PipelineStepId,
  type PipelineStepStatus,
} from "@/lib/document-pipeline";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

type ChatDocumentPipelineProps = {
  pipeline: DocumentPipelineState;
};

const ACTIVE_COLOR = "#7c3aed";
const COMPLETE_COLOR = "#22c55e";

function getActiveStepIndex(steps: DocumentPipelineState["steps"]): number {
  const activeIndex = PIPELINE_STEPS.findIndex(
    (step) => steps[step.id] === "active",
  );
  if (activeIndex >= 0) return activeIndex;

  const completedCount = PIPELINE_STEPS.filter(
    (step) => steps[step.id] === "completed",
  ).length;

  return Math.min(completedCount, PIPELINE_STEPS.length - 1);
}

function getProgressPercent(
  steps: DocumentPipelineState["steps"],
  allComplete: boolean,
): number {
  if (allComplete) return 100;

  const completedCount = PIPELINE_STEPS.filter(
    (step) => steps[step.id] === "completed",
  ).length;
  const hasActive = PIPELINE_STEPS.some((step) => steps[step.id] === "active");

  return Math.round(
    ((completedCount + (hasActive ? 0.35 : 0)) / PIPELINE_STEPS.length) * 100,
  );
}

function getProgressCeiling(steps: DocumentPipelineState["steps"]): number {
  const activeIndex = PIPELINE_STEPS.findIndex(
    (step) => steps[step.id] === "active",
  );
  if (activeIndex < 0) return 100;

  return Math.min(
    98,
    Math.round(((activeIndex + 0.92) / PIPELINE_STEPS.length) * 100),
  );
}

function getSubtitle(
  stepId: PipelineStepId,
  allComplete: boolean,
): string {
  if (allComplete) return "Your document is ready for review";

  switch (stepId) {
    case "upload":
      return "Uploading your document securely";
    case "analyze":
      return "Processing your document securely";
    case "extract":
      return "Pulling out the important details";
    case "complete":
      return "Finishing up";
    default:
      return "Processing your document securely";
  }
}

function SparklesIcon() {
  return (
    <svg
      className="h-5 w-5 animate-pipeline-sparkle"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11.5 2.5 13 7l4.5 1.5L13 10l-1.5 4.5L10 10 5.5 8.5 10 7l1.5-4.5ZM18 13l.9 2.7L21.5 17l-2.6.8L18 20.5l-.9-2.7-2.6-.8 2.6-.8L18 13Z" />
    </svg>
  );
}

function CheckIcon({ animate }: { animate?: boolean }) {
  return (
    <svg
      className={cn("h-3.5 w-3.5", animate && "pipeline-check-icon")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-pipeline-scan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ExtractIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-pipeline-scan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
      />
      <path strokeLinecap="round" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-pipeline-scan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0 4 4m-4-4-4 4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"
      />
    </svg>
  );
}

function ActiveStepIcon({ stepId }: { stepId: PipelineStepId }) {
  switch (stepId) {
    case "upload":
      return <UploadIcon />;
    case "analyze":
      return <ScanIcon />;
    case "extract":
      return <ExtractIcon />;
    case "complete":
      return <CheckIcon />;
    default:
      return <ScanIcon />;
  }
}

function StepCircle({
  stepId,
  status,
}: {
  stepId: PipelineStepId;
  status: PipelineStepStatus;
}) {
  const isActive = status === "active";
  const isCompleted = status === "completed";

  return (
    <div
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
        isCompleted && "bg-emerald-50 text-emerald-500 pipeline-step-complete",
        isActive && "bg-violet-600 text-white animate-pipeline-pulse pipeline-active-ring",
        status === "pending" && "bg-neutral-100 text-neutral-300",
      )}
      style={
        isActive
          ? { backgroundColor: ACTIVE_COLOR }
          : isCompleted
            ? { color: COMPLETE_COLOR, backgroundColor: "#ecfdf5" }
            : undefined
      }
    >
      {isCompleted ? (
        <CheckIcon animate />
      ) : isActive ? (
        <ActiveStepIcon stepId={stepId} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-pipeline-dot" />
      )}
    </div>
  );
}

function StepConnector({
  completed,
  active,
}: {
  completed: boolean;
  active: boolean;
}) {
  return (
    <div
      className="relative mx-1.5 h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-neutral-200"
      aria-hidden
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: completed ? "100%" : "0%",
          backgroundColor: ACTIVE_COLOR,
        }}
      />
      {active && completed ? (
        <div
          className="pipeline-progress-shimmer absolute inset-y-0 left-0 animate-pipeline-shimmer"
          style={{ width: "100%" }}
        />
      ) : null}
    </div>
  );
}

function useAnimatedProgress(
  targetProgress: number,
  isProcessing: boolean,
  ceiling: number,
): number {
  const [displayProgress, setDisplayProgress] = useState(targetProgress);

  useEffect(() => {
    setDisplayProgress((current) =>
      targetProgress > current ? targetProgress : current,
    );
  }, [targetProgress]);

  useEffect(() => {
    if (!isProcessing) {
      setDisplayProgress(targetProgress);
      return;
    }

    const intervalId = window.setInterval(() => {
      setDisplayProgress((current) => {
        const floor = targetProgress;
        const cap = Math.max(floor + 1, ceiling);
        if (current >= cap) return current;
        return Math.min(cap, current + 0.45);
      });
    }, 120);

    return () => window.clearInterval(intervalId);
  }, [isProcessing, targetProgress, ceiling]);

  return Math.round(displayProgress);
}

export function ChatDocumentPipeline({ pipeline }: ChatDocumentPipelineProps) {
  const activeIndex = getActiveStepIndex(pipeline.steps);
  const activeStep = PIPELINE_STEPS[activeIndex];
  const allComplete = PIPELINE_STEPS.every(
    (step) => pipeline.steps[step.id] === "completed",
  );
  const targetProgress = getProgressPercent(pipeline.steps, allComplete);
  const progressCeiling = getProgressCeiling(pipeline.steps);
  const isProcessing = pipeline.active && !allComplete;
  const displayProgress = useAnimatedProgress(
    targetProgress,
    isProcessing,
    progressCeiling,
  );

  if (!pipeline.active) return null;

  return (
    <div className="flex items-start gap-2.5" role="status" aria-live="polite">
      <ChatAgentAvatar size="sm" showStatus={false} />
      <div className="animate-pipeline-enter min-w-0 w-full max-w-[85%] rounded-2xl border border-neutral-100 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d70f1]/10 text-[#1d70f1]">
            <SparklesIcon />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold leading-snug text-neutral-900">
              {pipeline.statusMessage}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
              {getSubtitle(activeStep.id, allComplete)}
            </p>
          </div>
        </div>

        <div
          className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100"
          aria-hidden
        >
          <div
            className="relative h-full rounded-full bg-[#1d70f1] transition-[width] duration-500 ease-out"
            style={{ width: `${displayProgress}%` }}
          >
            {isProcessing ? (
              <div className="pipeline-progress-shimmer animate-pipeline-shimmer" />
            ) : null}
          </div>
          {isProcessing ? (
            <div className="pipeline-progress-slide animate-pipeline-slide" />
          ) : null}
        </div>

        <div className="relative mt-4 px-1">
          <div
            className="absolute inset-x-[12.5%] top-3.5 flex items-center"
            aria-hidden
          >
            {PIPELINE_STEPS.slice(0, -1).map((step, index) => {
              const stepStatus = pipeline.steps[step.id];
              const nextStep = PIPELINE_STEPS[index + 1];
              const nextStatus = pipeline.steps[nextStep.id];

              return (
                <StepConnector
                  key={`connector-${step.id}`}
                  completed={stepStatus === "completed"}
                  active={
                    stepStatus === "completed" && nextStatus === "active"
                  }
                />
              );
            })}
          </div>

          <div className="grid grid-cols-4 gap-1">
            {PIPELINE_STEPS.map((step) => {
              const status = pipeline.steps[step.id];

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2"
                >
                  <StepCircle stepId={step.id} status={status} />
                  <span
                    className={cn(
                      "w-full truncate text-center text-[9px] font-semibold uppercase tracking-wide transition-all duration-500",
                      status === "active" && "scale-105 text-violet-600",
                      status === "completed" && "text-neutral-600",
                      status === "pending" && "text-neutral-400",
                    )}
                    style={
                      status === "active" ? { color: ACTIVE_COLOR } : undefined
                    }
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
