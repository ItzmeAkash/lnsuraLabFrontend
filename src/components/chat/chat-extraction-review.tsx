"use client";

import type { ChatWsExtractionField } from "@/lib/api/chat-ws-types";
import { useState } from "react";

type ChatExtractionReviewProps = {
  fields: ChatWsExtractionField[];
  disabled?: boolean;
  onSubmit: (fields: Record<string, string>) => void;
};

export function ChatExtractionReview({
  fields,
  disabled = false,
  onSubmit,
}: ChatExtractionReviewProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.value])),
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-neutral-800">
        Extracted Information
      </h3>
      <div className="space-y-3">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-500">
              {field.label}
            </span>
            <input
              type="text"
              value={values[field.key] ?? ""}
              disabled={disabled || !field.editable}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:bg-neutral-50"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSubmit(values)}
        className="mt-4 w-full rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:bg-neutral-200 disabled:text-neutral-400"
      >
        Submit
      </button>
    </div>
  );
}
