import type { Prisma } from "@prisma/client";

export function parseCommaSeparatedValues(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim());
}

export function parseCommaSeparatedNumbers(value?: string): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((num) => !Number.isNaN(num));
}

export function createStringFilter(
  value?: string
): Prisma.StringFilter | undefined {
  if (!value) return undefined;

  const values = parseCommaSeparatedValues(value);
  if (values.length === 1) {
    return { contains: values[0], mode: "insensitive" };
  }

  return undefined;
}

export function createStringOrConditions<T extends string>(
  value: string | undefined,
  fieldName: T
): Array<Record<T, Prisma.StringFilter>> {
  if (!value) return [];

  const values = parseCommaSeparatedValues(value);
  if (values.length <= 1) return [];

  return values.map((val) => ({
    [fieldName]: { contains: val, mode: "insensitive" as const },
  })) as Array<Record<T, Prisma.StringFilter>>;
}

export function createEnumFilter<T extends string>(
  value?: string
): T | { in: T[] } | undefined {
  if (!value) return undefined;

  const values = parseCommaSeparatedValues(value) as T[];
  if (values.length === 1) {
    return values[0];
  }

  return { in: values };
}

export function createBooleanFilter(value?: string): boolean | undefined {
  if (!value) return undefined;

  const values = parseCommaSeparatedValues(value);
  if (values.length === 1) {
    return values[0] === "true";
  }

  return undefined;
}

export function createBooleanOrConditions<T extends string>(
  value: string | undefined,
  fieldName: T
): Array<Record<T, boolean>> {
  if (!value) return [];

  const values = parseCommaSeparatedValues(value);
  if (values.length <= 1) return [];

  return values.map((val) => ({
    [fieldName]: val === "true",
  })) as Array<Record<T, boolean>>;
}

export function createDateRangeFilter(
  value?: string | number
): Prisma.DateTimeFilter | undefined {
  if (!value) return undefined;

  const dateValue =
    typeof value === "number" || !Number.isNaN(Number(value))
      ? new Date(Number(value)).toISOString()
      : value;

  const startOfDay = new Date(dateValue);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(dateValue);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return {
    gte: startOfDay,
    lte: endOfDay,
  };
}

export function createRelationStringFilter(
  value?: string,
  relationField = "name"
): Record<string, unknown> | undefined {
  if (!value) return undefined;

  const values = parseCommaSeparatedValues(value);

  if (values.length === 1) {
    return {
      [relationField]: { contains: values[0], mode: "insensitive" },
    };
  }

  return {
    OR: values.map((val) => ({
      [relationField]: { contains: val, mode: "insensitive" as const },
    })),
  };
}
