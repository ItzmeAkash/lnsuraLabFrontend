const STANDALONE_URL_PATTERN =
  /^\s*(https?:\/\/[^\s<>"']+?)(?:[.,;:!?)]+)?\s*$/i;

const URL_IN_TEXT_PATTERN = /(https?:\/\/[^\s<>"']+)/gi;

const TRAILING_PUNCTUATION = /[.,;:!?)]+$/;

export function normalizeUrl(raw: string): string {
  return raw.trim().replace(TRAILING_PUNCTUATION, "");
}

export function extractStandaloneUrl(text: string): string | null {
  const match = text.match(STANDALONE_URL_PATTERN);
  if (!match?.[1]) return null;
  return normalizeUrl(match[1]);
}

export function isStandaloneUrl(text: string): boolean {
  return extractStandaloneUrl(text) !== null;
}

export type MessageTextPart =
  | { type: "text"; value: string }
  | { type: "url"; value: string };

export function splitMessageByUrls(text: string): MessageTextPart[] {
  const parts: MessageTextPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_IN_TEXT_PATTERN)) {
    const rawUrl = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    parts.push({ type: "url", value: normalizeUrl(rawUrl) });
    lastIndex = index + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ type: "text", value: text });
  }

  return parts;
}

export function getLinkButtonLabel(url: string): string {
  const normalized = url.toLowerCase();

  if (normalized.includes("customer_plan") || normalized.includes("proposal")) {
    return "View quotation options";
  }

  if (normalized.includes("compare") || normalized.includes("quote")) {
    return "Compare quotes";
  }

  return "Open link";
}

export function getLinkCardTitle(url: string): string {
  const normalized = url.toLowerCase();

  if (normalized.includes("customer_plan") || normalized.includes("proposal")) {
    return "Your quotations are ready";
  }

  return "Continue on InsuranceLab";
}

export function getLinkCardDescription(url: string): string {
  const normalized = url.toLowerCase();

  if (normalized.includes("customer_plan") || normalized.includes("proposal")) {
    return "Review and compare plans, then select Buy to proceed.";
  }

  return "Tap to open this page in your browser.";
}

/** Display copy: backend may still say "proposal"; we show "quotation" in the UI. */
export function normalizeInsuranceTerminology(text: string): string {
  return text
    .replace(/\bproposals\b/gi, "quotations")
    .replace(/\bproposal\b/gi, "quotation");
}
