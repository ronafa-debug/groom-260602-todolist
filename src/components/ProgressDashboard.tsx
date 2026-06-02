interface ProgressDashboardProps {
  total: number;
  completed: number;
}

export function ProgressDashboard({ total, completed }: ProgressDashboardProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section
      className="rounded-2xl bg-white/80 border border-primary/10 px-5 py-4 shadow-sm"
      aria-label="오늘의 성취도"
    >
      <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
        <span>📝</span> 오늘의 성취도
      </h2>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
        <span>
          전체 <strong className="text-primary">{total}</strong>개
        </span>
        <span>
          완료 <strong className="text-success">{completed}</strong>개
        </span>
        <span>
          진행률 <strong className="text-secondary">{percent}%</strong>
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-cream overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`진행률 ${percent}%`}
        />
      </div>
    </section>
  );
}
