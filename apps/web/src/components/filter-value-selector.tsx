import { BadgeCheck, Check, Text } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { CommandGroup, CommandItem } from "./ui/command";

export interface FilterValueSelectorProps {
  variant: "boolean" | "select" | "multiSelect" | "date" | "dateRange" | "text";
  value: string | string[];
  onSelect: (value: string) => void;
  options?: { value: string; label: string; icon?: React.JSX.Element }[];
  currentValues?: string[];
  onRemove?: (value: string) => void;
}

export function FilterValueSelector({
  value,
  variant,
  options,
  onSelect,
  currentValues,
  onRemove,
}: FilterValueSelectorProps) {
  const selectedValues =
    currentValues ?? (Array.isArray(value) ? value : [value].filter(Boolean));

  switch (variant) {
    case "boolean":
      return (
        <CommandGroup>
          <CommandItem value="true" onSelect={() => onSelect("true")}>
            Verdadeiro
          </CommandItem>
          <CommandItem value="false" onSelect={() => onSelect("false")}>
            Falso
          </CommandItem>
        </CommandGroup>
      );

    case "select":
    case "multiSelect":
      return (
        <CommandGroup>
          {options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  if (isSelected && variant === "multiSelect" && onRemove) {
                    onRemove(option.value);
                  } else {
                    onSelect(option.value);
                  }
                }}
              >
                {option.icon && option.icon}
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="ml-auto size-3" strokeWidth={3} />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      );

    case "date":
    case "dateRange":
      return (
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={
            typeof value === "string" && value ? new Date(value) : undefined
          }
          onSelect={(date) => onSelect(date?.getTime().toString() ?? "")}
        />
      );

    default: {
      const stringValue = typeof value === "string" ? value : "";
      const isEmpty = !stringValue.trim();

      return (
        <CommandGroup>
          <CommandItem
            value={stringValue}
            onSelect={() => onSelect(stringValue)}
            disabled={isEmpty}
          >
            {isEmpty ? (
              <>
                <Text />
                <span>Digite para filtrar...</span>
              </>
            ) : (
              <>
                <BadgeCheck />
                <span className="truncate">
                  Filtrar por &quot;{stringValue}&quot;
                </span>
              </>
            )}
          </CommandItem>
        </CommandGroup>
      );
    }
  }
}
