import { useEffect, useMemo, useState } from "react";
import { quotes, type Quote } from "../data/quotes";
import type { UserMode } from "../types/task";

const ROTATION_MS = 5_000;

function filterQuotes(mode: UserMode): Quote[] {
  return quotes.filter((q) => q.type === mode || q.type === "general");
}

export function useQuoteRotation(mode: UserMode) {
  const pool = useMemo(() => filterQuotes(mode), [mode]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [mode]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % pool.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [pool.length]);

  const quote = pool[index] ?? pool[0];

  return quote?.text ?? "오늘도 충분히 잘하고 있습니다.";
}
