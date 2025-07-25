"use client";

import type { Column, Table } from "@tanstack/react-table";
import { BadgeCheck, Check, Funnel, Text, X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { type JSX, useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

declare module "@tanstack/react-table" {
  // biome-ignore lint: Generic types needed for module augmentation
  interface ColumnMeta<TData, TValue> {
    label?: string;
    variant?:
      | "boolean"
      | "select"
      | "multiSelect"
      | "date"
      | "dateRange"
      | "text";
    filterType?: "text" | "multiText";
    icon?: React.ComponentType;
    options?: { value: string; label: string; icon?: JSX.Element }[];
  }
}

export type FilterOptionsType = {
  label: string;
  value: string;
  icon: JSX.Element;
  variant: "boolean" | "select" | "multiSelect" | "date" | "dateRange" | "text";
  options?: { value: string; label: string; icon?: JSX.Element }[];
};

interface DataTableFilterProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
}

export function DataTableFilter<TData>({
  table,
  align = "start",
  ...props
}: DataTableFilterProps<TData>) {
  const columns = useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

  const filterTypeMapping = useMemo(
    () => ({
      text: parseAsString.withDefault(""),
      multiText: parseAsArrayOf(parseAsString).withDefault([]),
    }),
    []
  );

  const filtersConfig = useMemo(() => {
    // biome-ignore lint/suspicious/noExplicitAny: Necessário para tipagem dinâmica do nuqs
    const config: Record<string, any> = {};

    columns.forEach((column) => {
      const filterType = column.columnDef.meta?.filterType || "text";
      const parser =
        filterTypeMapping[filterType as keyof typeof filterTypeMapping];

      if (parser && column.id) {
        config[column.id] = parser;
      }
    });

    return config;
  }, [columns, filterTypeMapping]);

  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column<TData> | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useQueryStates(filtersConfig);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    }
  }, []);

  const onFilterAdd = useCallback(
    (column: Column<TData>, value: string) => {
      if (!value.trim() && column.columnDef.meta?.variant !== "boolean") {
        return;
      }

      const columnId = column.id;
      const filterType = column.columnDef.meta?.filterType || "text";
      const variant = column.columnDef.meta?.variant;

      if (!columnId) return;

      if (
        filterType === "multiText" &&
        (variant === "multiSelect" || variant === "select")
      ) {
        const currentValues = (filters[columnId] as string[]) || [];
        if (!currentValues.includes(value)) {
          setFilters({
            [columnId]: [...currentValues, value],
          });
        }
      } else {
        setFilters({
          [columnId]: value,
        });
      }

      if (variant !== "multiSelect") {
        setOpen(false);

        setTimeout(() => {
          setSelectedColumn(null);
          setInputValue("");
        }, 100);
      }
    },
    [filters, setFilters]
  );

  const lengthOfFilters = useMemo(() => {
    return Object.values(filters).filter((v) =>
      Array.isArray(v) ? v.length > 0 : v !== ""
    ).length;
  }, [filters]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Funnel />
            {lengthOfFilters > 0 ? null : "Filtros"}
            {lengthOfFilters > 0 && (
              <Badge variant="outline" className="size-5 rounded-full">
                {lengthOfFilters}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] p-0"
          align={align}
          {...props}
        >
          <Command>
            <CommandInput
              placeholder="Buscar filtros..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {selectedColumn ? (
                <FilterValueSelector
                  column={selectedColumn}
                  value={inputValue}
                  onSelect={(value) => onFilterAdd(selectedColumn, value)}
                  currentFilters={filters}
                  onRemove={(value) => {
                    const columnId = selectedColumn.id;
                    const filterType =
                      selectedColumn.columnDef.meta?.filterType || "text";

                    if (!columnId) return;

                    if (filterType === "multiText") {
                      const currentValues =
                        (filters[columnId] as string[]) || [];
                      setFilters({
                        [columnId]: currentValues.filter((v) => v !== value),
                      });
                    } else {
                      setFilters({
                        [columnId]: null,
                      });
                    }
                  }}
                />
              ) : (
                <>
                  <CommandEmpty>No fields found.</CommandEmpty>
                  <CommandGroup>
                    {columns.map((column) => (
                      <CommandItem
                        key={column.id}
                        value={column.id}
                        onSelect={() => {
                          setSelectedColumn(column);
                          setInputValue("");
                        }}
                      >
                        {column.columnDef.meta?.icon && (
                          <column.columnDef.meta.icon />
                        )}
                        <span className="truncate">
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
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
          onClick={() => {
            const resetFilters = Object.keys(filtersConfig).reduce(
              (acc, key) => {
                const filterType =
                  columns.find((col) => col.id === key)?.columnDef.meta
                    ?.filterType || "text";
                acc[key] = filterType === "multiText" ? [] : null;
                return acc;
              },
              {} as Record<string, string[] | null>
            );

            setFilters(resetFilters);
          }}
        >
          <X className="size-[1.2rem]" />
        </Button>
      )}
    </div>
  );
}

interface FilterValueSelectorProps<TData> {
  column: Column<TData>;
  value: string;
  onSelect: (value: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: Necessário para tipagem dinâmica do nuqs
  currentFilters: Record<string, any>;
  onRemove: (value: string) => void;
}

function FilterValueSelector<TData>({
  column,
  value,
  onSelect,
  currentFilters,
  onRemove,
}: FilterValueSelectorProps<TData>) {
  const variant = column.columnDef.meta?.variant ?? "text";
  const columnId = column.id;
  const currentValues = columnId
    ? (currentFilters[columnId] as string[]) || []
    : [];

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
          {column.columnDef.meta?.options?.map((option) => {
            const isSelected = currentValues.includes(option.value);
            return (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  if (isSelected && variant === "multiSelect") {
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
