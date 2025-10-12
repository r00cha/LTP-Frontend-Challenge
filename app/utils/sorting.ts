export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating-desc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

type SortConfig = {
  sortBy?: string;
  order?: "asc" | "desc";
};

const SORT_MAP: Record<SortValue, SortConfig> = {
  "featured": {},
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
};

export function getSortConfig(sortValue: string): SortConfig {
  return SORT_MAP[sortValue as SortValue] ?? SORT_MAP.featured;
}

export function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}
