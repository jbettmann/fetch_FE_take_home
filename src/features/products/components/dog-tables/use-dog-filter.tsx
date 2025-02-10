'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useDogTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    history: 'replace',
    throttleMs: 500
  });

  const [breedsFilter, setBreedsFilter] = useQueryState<string[]>('breeds', {
    defaultValue: [],
    parse: (val) => (val ? val.split(',') : []),
    history: 'replace'
  });

  const [zipCodesFilter, setZipCodesFilter] = useQueryState<string[]>(
    'zipCodes',
    {
      defaultValue: [],
      parse: (val) => (val ? val.split(',') : []),
      history: 'replace'
    }
  );

  const [ageMin, setAgeMin] = useQueryState('ageMin', {
    defaultValue: null,
    parse: (val) => (val ? Number(val) : null),
    history: 'replace'
  });

  const [ageMax, setAgeMax] = useQueryState('ageMax', {
    defaultValue: undefined,
    parse: (val) => (val ? Number(val) : undefined),
    history: 'replace'
  });

  const [page, setPage] = useQueryState('page', {
    defaultValue: 1,
    parse: (val) => Number(val) || 1,
    history: 'replace'
  });

  const [size, setSize] = useQueryState('size', {
    defaultValue: 25,
    parse: (val) => Number(val) || 25,
    history: 'replace'
  });

  const [sort, setSort] = useQueryState('sort', {
    defaultValue: 'breed:asc',
    history: 'replace'
  });

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setBreedsFilter([]);
    setZipCodesFilter([]);
    setAgeMin(null);
    setAgeMax(null);
    setPage(1);
    setSize(25);
    setSort('breed:asc');
  }, [
    setSearchQuery,
    setBreedsFilter,
    setZipCodesFilter,
    setAgeMin,
    setAgeMax,
    setPage,
    setSize,
    setSort
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      searchQuery !== '' ||
      breedsFilter.length > 0 ||
      zipCodesFilter.length > 0 ||
      ageMin !== undefined ||
      ageMax !== undefined
    );
  }, [searchQuery, breedsFilter, zipCodesFilter, ageMin, ageMax]);

  return {
    searchQuery,
    setSearchQuery,
    breedsFilter,
    setBreedsFilter,
    zipCodesFilter,
    setZipCodesFilter,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    page,
    setPage,
    size,
    setSize,
    sort,
    setSort,
    resetFilters,
    isAnyFilterActive
  };
}
