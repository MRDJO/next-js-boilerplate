"use client";

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  defaultValue?: string[];
  options: MultiSelectOption[];
  onValueChange?: (values: string[]) => void;
}

export function MultiSelect({
  defaultValue = [],
  options,
  onValueChange,
}: MultiSelectProps) {
  return (
    <select
      multiple
      defaultValue={defaultValue}
      className="border-input bg-background min-h-28 w-full rounded-md border px-3 py-2 text-sm"
      onChange={(event) => {
        const values = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        onValueChange?.(values);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
