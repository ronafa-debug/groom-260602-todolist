import { useQuoteRotation } from "../hooks/useQuoteRotation";
import { useTaskStore } from "../store/useTaskStore";

export function EncouragementCard() {
  const userMode = useTaskStore((s) => s.userMode);
  const text = useQuoteRotation(userMode);

  return (
    <section
      className="rounded-xl bg-cream px-4 py-2.5 shadow-sm shadow-primary/10 border border-secondary/30 min-h-[3.5rem] flex flex-col justify-center"
      aria-label="오늘의 응원 문구"
    >
      <p className="text-[10px] font-semibold text-primary/70 mb-0.5">✨ 오늘의 응원</p>
      <p className="text-sm leading-snug text-primary font-medium line-clamp-2">
        {text}
      </p>
    </section>
  );
}
