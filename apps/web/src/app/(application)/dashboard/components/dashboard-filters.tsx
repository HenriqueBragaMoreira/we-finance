"use client";

import {
  FilterValueSelector,
  type FilterValueSelectorProps,
} from "@/components/filter-value-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usersServices } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Funnel, History, UsersRound, X } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useCallback, useState } from "react";

interface FilterOptionsType
  extends Omit<FilterValueSelectorProps, "value" | "onSelect"> {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export function DashboardFilters() {
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filters, setFilters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsArrayOf(parseAsString).withDefault([]),
    year: parseAsArrayOf(parseAsString).withDefault([]),
  });

  const { data } = useQuery({
    queryKey: ["get-users"],
    queryFn: async () => await usersServices.get(),
  });

  const filterOptions: FilterOptionsType[] = [
    {
      label: "Pessoa",
      value: "person",
      icon: <UsersRound className="size-4" />,
      variant: "select",
      options: data?.data.map((user) => ({
        label: user.name,
        value: user.id,
      })),
    },
    {
      label: "Mês",
      value: "month",
      icon: <CalendarDays className="size-4" />,
      variant: "multiSelect",
      options: [
        { value: "janeiro", label: "Janeiro" },
        { value: "fevereiro", label: "Fevereiro" },
        { value: "março", label: "Março" },
        { value: "abril", label: "Abril" },
        { value: "maio", label: "Maio" },
        { value: "junho", label: "Junho" },
        { value: "julho", label: "Julho" },
        { value: "agosto", label: "Agosto" },
        { value: "setembro", label: "Setembro" },
        { value: "outubro", label: "Outubro" },
        { value: "novembro", label: "Novembro" },
        { value: "dezembro", label: "Dezembro" },
      ],
    },
    {
      label: "Ano",
      value: "year",
      icon: <History className="size-4" />,
      variant: "multiSelect",
      options: [
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
      ],
    },
  ];

  function handleClearFilters() {
    setFilters({
      person: null,
      month: [],
      year: [],
    });
  }

  function lengthOfFilters() {
    return Object.values(filters).filter((v) =>
      Array.isArray(v) ? v.length > 0 : v !== ""
    ).length;
  }

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        setSelectedFilter("");
      }, 100);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Funnel className="size-[1.2rem]" />
            {lengthOfFilters() > 0 ? null : "Filtros"}

            {lengthOfFilters() > 0 && (
              <Badge variant="outline" className="size-5 rounded-full">
                {lengthOfFilters()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-0" align="end">
          <Command>
            <CommandInput placeholder="Buscar filtros..." />
            <CommandEmpty>Nenhum filtro encontrado.</CommandEmpty>
            <CommandList>
              {selectedFilter
                ? (() => {
                    const selectedOption = filterOptions.find(
                      (opt) => opt.value === selectedFilter
                    );
                    if (!selectedOption) return null;
                    const filterValue =
                      filters[selectedFilter as keyof typeof filters];

                    return (
                      <FilterValueSelector
                        variant={selectedOption.variant}
                        value={
                          selectedOption.variant === "multiSelect"
                            ? (filterValue as string[]) || []
                            : (filterValue as string) || ""
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

      {lengthOfFilters() > 0 && (
        <Button
          aria-label="Reset all filters"
          variant="outline"
          size="icon"
          onClick={() => handleClearFilters()}
        >
          <X className="size-[1.2rem]" />
        </Button>
      )}
    </div>
  );
}
