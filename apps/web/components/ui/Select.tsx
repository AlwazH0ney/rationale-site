import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
}

/** Native select for accessibility, styled to the brand. */
export function Select({ label, options, id, ...rest }: SelectProps) {
  const selectId = id ?? `select-${label.replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={selectId} className="flex flex-col gap-1.5">
      <span className="label">{label}</span>
      <select
        id={selectId}
        className="h-10 w-full appearance-none rounded-sm border border-chalk bg-cream px-3 text-label text-ink"
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
