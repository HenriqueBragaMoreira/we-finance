/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function DataTableSkeleton({
  rows = 5,
  columns = 4,
}: DataTableSkeletonProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <Skeleton className="h-9 w-40" />

        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-20" />

          <Skeleton className="h-9 w-32 hidden sm:flex" />
        </div>
      </div>

      <div className="sm:*:data-[slot=table-container]:h-[calc(100vh-26rem)]">
        <div className="flex flex-col gap-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: columns }).map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <TableRow className="h-[53.5px]" key={rowIndex}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        {colIndex === 0 ? (
                          <Skeleton className="h-4 w-32" />
                        ) : colIndex === columns - 1 ? (
                          <Skeleton className="size-9 rounded-md" />
                        ) : (
                          <Skeleton className="h-4 w-24" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-center sm:justify-between">
            <Skeleton className="h-10 w-40 rounded-md hidden sm:flex" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
