"use client";

import { BadgeCheck, Check, Funnel, Text, X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { type JSX, useCallback, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";

export type FilterOptionsType = {
  label: string;
  value: string;
  icon: JSX.Element;
  variant: "boolean" | "select" | "multiSelect" | "date" | "dateRange" | "text";
  options?: { value: string; label: string; icon?: JSX.Element }[];
};

type DashboardFiltersProps = {
  filterOptions: FilterOptionsType[];
};

export function DashboardFilters({ filterOptions }: DashboardFiltersProps) {
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsArrayOf(parseAsString).withDefault([]),
    year: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        setSelectedFilter("");
        setInputValue("");
      }, 100);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Funnel className="size-[1.2rem]" />
            {Object.values(filters).filter((v) =>
              Array.isArray(v) ? v.length > 0 : v !== ""
            ).length > 0
              ? null
              : "Filtros"}
            {Object.values(filters).filter((v) =>
              Array.isArray(v) ? v.length > 0 : v !== ""
            ).length > 0 && (
              <Badge variant="outline" className="size-5 rounded-full">
                {
                  Object.values(filters).filter((v) =>
                    Array.isArray(v) ? v.length > 0 : v !== ""
                  ).length
                }
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-0" align="end">
          <Command>
            <CommandInput
              placeholder="Buscar filtros..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {selectedFilter
                ? (() => {
                    const selectedOption = filterOptions.find(
                      (opt) => opt.value === selectedFilter
                    );
                    if (!selectedOption) return null;
                    return (
                      <FilterValueSelector
                        variant={selectedOption.variant}
                        value={
                          selectedOption.variant === "multiSelect"
                            ? (filters[
                                selectedFilter as keyof typeof filters
                              ] as string[])
                            : selectedOption.variant === "select"
                              ? (filters[
                                  selectedFilter as keyof typeof filters
                                ] as string)
                              : (filters[
                                  selectedFilter as keyof typeof filters
                                ] as string)
                        }
                        options={selectedOption.options}
                        onSelect={(value) => {
                          if (selectedOption.variant === "multiSelect") {
                            const currentValues = filters[
                              selectedFilter as keyof typeof filters
                            ] as string[];
                            const newValues = currentValues.includes(value)
                              ? currentValues.filter((v) => v !== value)
                              : [...currentValues, value];
                            setFilters({
                              ...filters,
                              [selectedFilter]: newValues,
                            });
                          } else {
                            setFilters({ ...filters, [selectedFilter]: value });
                          }

                          if (selectedOption.variant !== "multiSelect") {
                            setOpen(false);

                            setTimeout(() => {
                              setSelectedFilter("");
                              setInputValue("");
                            }, 100);
                          }
                        }}
                      />
                    );
                  })()
                : filterOptions.map((option) => {
                    const filterValue =
                      filters[option.value as keyof typeof filters];
                    const hasValue = Array.isArray(filterValue)
                      ? filterValue.length > 0
                      : filterValue !== "";
                    const count = Array.isArray(filterValue)
                      ? filterValue.length
                      : hasValue
                        ? 1
                        : 0;

                    return (
                      <CommandItem
                        key={option.value}
                        className="flex items-center gap-2"
                        onSelect={() => {
                          setSelectedFilter(option.value);
                          setInputValue("");
                        }}
                      >
                        {option.icon}
                        {option.label}
                        {count > 0 && (
                          <Badge
                            variant="outline"
                            className="ml-auto size-5 rounded-full"
                          >
                            {count}
                          </Badge>
                        )}
                      </CommandItem>
                    );
                  })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {Object.values(filters).filter((v) =>
        Array.isArray(v) ? v.length > 0 : v !== ""
      ).length > 0 && (
        <Button
          aria-label="Reset all filters"
          variant="outline"
          size="icon"
          onClick={() =>
            setFilters({
              person: null,
              month: [],
              year: [],
            })
          }
        >
          <X className="size-[1.2rem]" />
        </Button>
      )}
    </div>
  );
}

interface FilterValueSelectorProps {
  variant: "boolean" | "select" | "multiSelect" | "date" | "dateRange" | "text";
  value: string | string[];
  onSelect: (value: string) => void;
  options?: { value: string; label: string; icon?: JSX.Element }[];
}

function FilterValueSelector({
  value,
  variant,
  options,
  onSelect,
}: FilterValueSelectorProps) {
  switch (variant) {
    case "boolean":
      return (
        <CommandGroup>
          <CommandItem value="true" onSelect={() => onSelect("true")}>
            True
          </CommandItem>
          <CommandItem value="false" onSelect={() => onSelect("false")}>
            False
          </CommandItem>
        </CommandGroup>
      );

    case "select":
    case "multiSelect":
      return (
        <CommandGroup>
          {options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => onSelect(option.value)}
            >
              {option.icon && option.icon}
              <span className="truncate">{option.label}</span>
              {value.includes(option.value) && (
                <Check className="ml-auto size-3" strokeWidth={3} />
              )}
            </CommandItem>
          ))}
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
                <span>Type to add filter...</span>
              </>
            ) : (
              <>
                <BadgeCheck />
                <span className="truncate">
                  Filter by &quot;{stringValue}&quot;
                </span>
              </>
            )}
          </CommandItem>
        </CommandGroup>
      );
    }
  }
}
