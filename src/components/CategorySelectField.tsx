import { useState } from "react";
import { CategoryManagerModal } from "./CategoryManager";

interface CategorySelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  className?: string;
  selectClassName?: string;
}

export function CategorySelectField({
  value,
  onChange,
  categories,
  className = "",
  selectClassName = "bg-background",
}: CategorySelectFieldProps) {
  const [managerOpen, setManagerOpen] = useState(false);

  return (
    <>
      <label className={`flex flex-col gap-1 text-xs text-gray-600 ${className}`}>
        카테고리
        <div className="flex gap-1.5">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 rounded-lg border border-primary/20 px-3 py-2 text-sm min-w-0 ${selectClassName}`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setManagerOpen(true)}
            className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-dark shadow-sm"
            aria-label="카테고리 추가"
            title="카테고리 추가"
          >
            <span className="text-white text-2xl font-semibold leading-none">+</span>
          </button>
        </div>
      </label>
      <CategoryManagerModal open={managerOpen} onClose={() => setManagerOpen(false)} />
    </>
  );
}
