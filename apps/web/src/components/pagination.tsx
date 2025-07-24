import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UsePaginationReturn } from "@/hooks/use-pagination";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type PaginationProps = {
  paginationTable: UsePaginationReturn;
  pageCount: number;
};

export function Pagination({
  paginationTable,
  pageCount,
}: PaginationProps): React.ReactElement {
  const pageIndex = paginationTable.page;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;
  const pageRangeDisplayed = 3;
  const pagesToShow: (number | string)[] = [];

  const startPage = Math.max(
    1,
    pageIndex + 1 - Math.floor(pageRangeDisplayed / 2)
  );
  const endPage = Math.min(pageCount, startPage + pageRangeDisplayed - 1);

  if (startPage > 1) {
    pagesToShow.push(1);
    if (startPage > 2) {
      pagesToShow.push("ellipsis1");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  if (endPage < pageCount) {
    if (endPage < pageCount - 1) {
      pagesToShow.push("ellipsis2");
    }
    pagesToShow.push(pageCount);
  }

  const rowsPerPageOptions = [
    { label: "10 por página", value: "10" },
    { label: "20 por página", value: "20" },
    { label: "30 por página", value: "30" },
    { label: "40 por página", value: "40" },
    { label: "50 por página", value: "50" },
  ];

  const isActive = (page: number): boolean => pageIndex + 1 === page;

  return (
    <div className="flex justify-center sm:justify-between items-center">
      <Select
        value={paginationTable.rowsPerPage.toString()}
        onValueChange={(value) =>
          paginationTable.handleChangeRowsPerPage(Number(value))
        }
      >
        <SelectTrigger className="hidden sm:flex w-40 max-h-10">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {rowsPerPageOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-center">
        <Button
          onClick={() => paginationTable.handleChangePage(pageIndex - 1)}
          variant="outline"
          size="icon"
          disabled={!canPreviousPage}
        >
          <ChevronLeft size={12} />
        </Button>

        {pagesToShow.map((page, index) =>
          page.toString().startsWith("ellipsis") ? (
            <Button
              // biome-ignore lint/suspicious/noArrayIndexKey: <>
              key={(page as number) + index}
              variant="outline"
              className="size-8"
            >
              ...
            </Button>
          ) : (
            <Button
              onClick={() =>
                paginationTable.handleChangePage((page as number) - 1)
              }
              key={page}
              variant={isActive(page as number) ? "secondary" : "outline"}
              className="size-8"
            >
              {page}
            </Button>
          )
        )}

        <Button
          onClick={() => paginationTable.handleChangePage(pageIndex + 1)}
          variant="outline"
          size="icon"
          disabled={!canNextPage}
        >
          <ChevronRight size={12} />
        </Button>
      </div>
    </div>
  );
}
