'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useDogTableFilters } from '@/features/products/components/dog-tables/use-dog-filter';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import DogCard from '../cards/dog-card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  goToNextPage: () => void;
  goToPrevPage: () => void;
  isLoading: boolean;
  isTableView?: boolean;
}

export function DataTable<TData extends Dog, TValue>({
  columns,
  data,
  totalItems,
  goToNextPage,
  goToPrevPage,
  isLoading,
  isTableView,
  pageSizeOptions = [10, 25, 50, 100]
}: DataTableProps<TData, TValue>) {
  const { size, setSize } = useDogTableFilters();
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize: size
  };

  const pageCount = Math.ceil(totalItems / size);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1);
    setSize(pagination.pageSize);
  };
  const currentData = useMemo(() => data, [data, isLoading]);
  const table = useReactTable({
    data: currentData,
    columns,
    pageCount,
    state: {
      pagination: paginationState
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='relative flex flex-1'>
        <div className='absolute bottom-0 left-0 right-0 top-0 flex overflow-scroll rounded-md border md:overflow-auto'>
          <ScrollArea className='flex-1'>
            {!isTableView ? (
              <Table className='relative'>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {/* Show current data while loading */}
                  {table.getRowModel().rows?.length || isLoading ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Show loading overlay */}
                </TableBody>
              </Table>
            ) : (
              <>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                  {data.map((dog) => (
                    <DogCard key={dog.id} dog={dog} />
                  ))}
                </div>
              </>
            )}
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>

      <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {totalItems > 0 ? (
              <>
                Showing{' '}
                {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  totalItems
                )}{' '}
                of {totalItems} entries
              </>
            ) : (
              'No entries found'
            )}
          </div>
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
            <div className='flex items-center space-x-2'>
              <p className='whitespace-nowrap text-sm font-medium'>
                Rows per page
              </p>
              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) => {
                  if (isLoading) return;
                  table.setPageSize(Number(value));
                }}
                disabled={isLoading}
              >
                <SelectTrigger className='h-8 w-[70px]'>
                  <SelectValue placeholder={paginationState.pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
          <div className='flex w-[150px] items-center justify-center text-sm font-medium'>
            {totalItems > 0 ? (
              <>
                Page {paginationState.pageIndex + 1} of {table.getPageCount()}
              </>
            ) : (
              'No pages'
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              aria-label='Go to previous page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => {
                if (!isLoading) goToPrevPage();
              }}
              disabled={isLoading}
            >
              <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to next page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => {
                if (!isLoading) goToNextPage();
              }}
              disabled={isLoading}
            >
              <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
