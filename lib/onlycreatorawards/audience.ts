export const modelAudienceValues = ["women", "men", "trans"] as const;

export type ModelAudience = (typeof modelAudienceValues)[number];

export const defaultModelAudienceSelection: ModelAudience[] = ["women"];

const modelAudienceSet = new Set<string>(modelAudienceValues);

export function normalizeModelAudienceSelection(values: Iterable<string | null | undefined>) {
  const normalizedValues = [...values].map((item) => String(item ?? "").trim().toLowerCase());
  const selected = modelAudienceValues.filter((value) =>
    normalizedValues.some((item) => item === value)
  );

  return selected.length ? selected : defaultModelAudienceSelection;
}

export function parseModelAudienceParam(value?: string | string[] | null): ModelAudience[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  const selected = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => modelAudienceSet.has(item));

  return normalizeModelAudienceSelection(selected);
}

export function serializeModelAudienceSelection(selection: ModelAudience[]) {
  return modelAudienceValues.filter((value) => selection.includes(value)).join(",");
}

export function isDefaultModelAudienceSelection(selection: ModelAudience[]) {
  return (
    selection.length === defaultModelAudienceSelection.length &&
    defaultModelAudienceSelection.every((value) => selection.includes(value))
  );
}
