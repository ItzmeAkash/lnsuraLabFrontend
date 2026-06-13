import { State } from "country-state-city";

let uaeEmirateNames: Set<string> | null = null;

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\bemirate\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getUaeEmirateNames(): Set<string> {
  if (uaeEmirateNames) return uaeEmirateNames;

  uaeEmirateNames = new Set(
    (State.getStatesOfCountry("AE") ?? []).map((state) => normalizeName(state.name)),
  );
  return uaeEmirateNames;
}

function matchesUaeEmirate(value: string): boolean {
  const normalized = normalizeName(value);
  if (!normalized) return false;

  const emirates = getUaeEmirateNames();
  if (emirates.has(normalized)) return true;

  for (const emirate of emirates) {
    if (normalized.includes(emirate) || emirate.includes(normalized)) return true;
  }

  return false;
}

export function isUaeEmirateOption(
  optionLabel: string,
  optionId: string,
): boolean {
  return matchesUaeEmirate(optionLabel) || matchesUaeEmirate(optionId);
}
