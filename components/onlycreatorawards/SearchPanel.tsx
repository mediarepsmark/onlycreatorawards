import { Search } from "lucide-react";

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/creators" className={compact ? "w-full" : "mx-auto w-full max-w-3xl"}>
      <div className="flex min-h-14 items-center gap-3 rounded-lg border border-line bg-white p-2 shadow-panel">
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          name="query"
          type="search"
          placeholder="Search creators, categories, platforms, locations"
          className="min-w-0 flex-1 bg-transparent px-1 text-base font-bold text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-extrabold text-white transition hover:bg-brand-green"
        >
          Search
        </button>
      </div>
    </form>
  );
}
