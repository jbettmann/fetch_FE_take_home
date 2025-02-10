'use client';
import React from 'react';

import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useDogTableFilters } from '../features/products/components/dog-tables/use-dog-filter';

type Props = {
  column: any;
  className?: string;
  children: React.ReactNode;
};

export const SortableHeaderButton = ({
  column,
  className,
  children
}: Props) => {
  const { sort, setSort } = useDogTableFilters();
  return (
    <Button
      variant='ghost'
      className={cn(className)}
      onClick={() => setSort(sort === 'breed:asc' ? 'breed:desc' : 'breed:asc')}
    >
      {children}
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );
};
