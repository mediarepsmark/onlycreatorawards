import { Search } from "lucide-react";

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/creators" className={compact ? "w-full" : "mx-auto w-full max-w-3xl"}>
      <div className="flex min-h-14 items-center gap-3 rounded-lg border border-brand-cyan/[0.45] bg-black/[0.46] p-2 shadow-cyan-glow backdrop-blur-xl transition focus-within:border-brand-amber/80">
        <Search className="ml-2 h-5 w-5 shrink-0 text-brand-cyan" aria-hidden="true" />
        <input
          name="query"
          type="search"
          placeholder="Search creators, categories, platforms, locations"
          className="min-w-0 flex-1 bg-transparent px-1 text-base font-bold text-white outline-none placeholder:text-white/[0.45]"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-b from-[#ffe49a] to-brand-amber px-4 text-sm font-black text-ink transition hover:from-white hover:to-[#f7c85c]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
