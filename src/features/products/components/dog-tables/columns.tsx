'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Dog } from 'types';
import { CellAction } from './cell-action';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortableHeaderButton } from '@/components/sortable-header-button';

export const columns: ColumnDef<Dog>[] = [
  {
    accessorKey: 'img',
    header: 'IMAGE',
    cell: ({ row }) => {
      const { img } = row.original;
      return (
        <div className='relative aspect-square max-h-28'>
          <Image
            src={img}
            alt={row.getValue('name')}
            fill
            className='rounded-lg'
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'breed',
    header: ({ column }) => (
      <SortableHeaderButton column={column}>BREED</SortableHeaderButton>
    )
  },
  {
    accessorKey: 'age',
    header: 'AGE (YEARS)'
  },
  {
    accessorKey: 'zip_code',
    header: 'LOCATION'
  },

  {
    id: 'actions',
    header: 'FAVORITE',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
