import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { fetcher, postFetcher } from '../fetcher';
import { useCallback, useEffect, useState } from 'react';
import { Dog } from 'types';

export function useDogs(filters: any, initialUrl = '/dogs/search') {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isPaginating, setIsPaginating] = useState(false);

  // Build params only for initial requests
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.breeds) params.append('breeds', filters.breeds.join(','));
    if (filters.zipCodes) params.append('zipCodes', filters.zipCodes.join(','));
    if (filters.ageMin !== undefined)
      params.append('ageMin', String(filters.ageMin));
    if (filters.ageMax !== undefined)
      params.append('ageMax', String(filters.ageMax));
    if (filters.size) params.append('size', String(filters.size));
    if (filters.sort) params.append('sort', filters.sort);
    return params.toString();
  }, [filters]);

  // Construct final URL
  const baseUrl = isPaginating ? currentUrl : initialUrl;
  const query = isPaginating ? '' : buildParams();
  const fetchUrl = `${baseUrl}?${query}`.replace(/\?$/, '');

  const { data, error } = useSWR(fetchUrl, fetcher, {});

  useEffect(() => {
    if (!isPaginating) {
      setCurrentUrl(initialUrl);
    }
  }, [filters, initialUrl, isPaginating]);

  const handlePagination = useCallback((url: string) => {
    setCurrentUrl(url);
    setIsPaginating(true);
  }, []);

  const goToNextPage = useCallback(() => {
    if (data?.next) {
      handlePagination(data.next);
    }
  }, [data?.next, handlePagination]);

  const goToPrevPage = useCallback(() => {
    if (data?.prev) {
      handlePagination(data.prev);
    }
  }, [data?.prev, handlePagination]);

  return {
    dogIds: data?.resultIds || [],
    totalDogs: data?.total || 0,
    nextPage: data?.next || null,
    prevPage: data?.prev || null,
    isLoading: !error && !data,
    isError: error,
    goToNextPage,
    goToPrevPage
  };
}

export function useDogsByIds(dogIds: string[]) {
  const shouldFetch = dogIds.length > 0;
  const { data, error, mutate } = useSWR(
    shouldFetch ? ['/dogs', dogIds] : null,
    ([url, ids]) => postFetcher(url, ids)
  );

  return {
    dogs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useMatchDog() {
  const { data, trigger, isMutating, error } = useSWRMutation(
    '/dogs/match',
    (url, { arg }: { arg: { favorites: any[] } }) =>
      postFetcher(url, arg.favorites)
  );

  const findMatch = async (favorites: any[]) => {
    if (favorites.length === 0) return;
    return await trigger({ favorites });
  };

  return {
    match: data || null,
    isLoading: isMutating,
    error,
    findMatch
  };
}

export function useBreeds() {
  const { data, error } = useSWR('/dogs/breeds', fetcher);

  return {
    breeds: data || [],
    isLoading: !error && !data,
    isError: error
  };
}
