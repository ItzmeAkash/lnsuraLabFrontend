export type PipelineStepId = "upload" | "analyze" | "extract" | "complete";

export type PipelineStepStatus = "pending" | "active" | "completed";

export type DocumentPipelineState = {
  active: boolean;
  statusMessage: string;
  steps: Record<PipelineStepId, PipelineStepStatus>;
};

export const PIPELINE_STEPS: { id: PipelineStepId; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "analyze", label: "Analyze" },
  { id: "extract", label: "Extract" },
  { id: "complete", label: "Complete" },
];

export const INITIAL_PIPELINE_STEPS: Record<PipelineStepId, PipelineStepStatus> = {
  upload: "pending",
  analyze: "pending",
  extract: "pending",
  complete: "pending",
};

export function createPipelineState(
  partial?: Partial<DocumentPipelineState>,
): DocumentPipelineState {
  return {
    active: partial?.active ?? false,
    statusMessage: partial?.statusMessage ?? "",
    steps: { ...INITIAL_PIPELINE_STEPS, ...partial?.steps },
  };
}

/** After document is sent — upload done, analysis starting */
export function pipelineAfterUpload(): DocumentPipelineState {
  return createPipelineState({
    active: true,
    statusMessage: "Analyzing document...",
    steps: {
      upload: "completed",
      analyze: "active",
      extract: "pending",
      complete: "pending",
    },
  });
}

/** First streaming chunk — extraction in progress */
export function pipelineDuringExtract(message?: string): DocumentPipelineState {
  return createPipelineState({
    active: true,
    statusMessage: message?.trim() || "Extracting information...",
    steps: {
      upload: "completed",
      analyze: "completed",
      extract: "active",
      complete: "pending",
    },
  });
}

/** Extraction finished */
export function pipelineComplete(): DocumentPipelineState {
  return createPipelineState({
    active: true,
    statusMessage: "Analysis complete",
    steps: {
      upload: "completed",
      analyze: "completed",
      extract: "completed",
      complete: "completed",
    },
  });
}

export const INACTIVE_PIPELINE = createPipelineState();
