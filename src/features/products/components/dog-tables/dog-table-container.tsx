'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useBreeds, useDogs, useDogsByIds, useMatchDog } from '@/services/dogs';
import { DataTable as PupTable } from '@/components/ui/table/data-table';
import { columns } from './columns';
import { useDogTableFilters } from './use-dog-filter';
import { useFavorites } from '@/hooks/use-favorite-store';
import { Heart, PawPrint, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Dog } from 'types';
import { fa } from '@faker-js/faker/.';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import TableViewToggleButton from '@/components/table-view-toggle-btn';
import DogCard from '@/components/ui/cards/dog-card';
import { toast } from 'sonner';

export default function DogTableContainer() {
  let animationInterval: NodeJS.Timeout | null = null;
  const [isTableView, setIsTableView] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isMatching, setIsMatching] = useState(false);
  const [finalMatch, setFinalMatch] = useState<Dog | undefined | null>(null);
  const {
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
  } = useDogTableFilters();

  const {
    favorites,
    deleteFavorite,
    matches,
    addMatch,
    removeMatch,
    resetFavorites,
    resetMatches
  } = useFavorites();
  const { findMatch, match, error } = useMatchDog();

  const { breeds, isLoading } = useBreeds();
  const filters = {
    page,
    size,
    search: searchQuery || undefined,
    breeds: breedsFilter.length ? breedsFilter : undefined,
    zipCodes: zipCodesFilter.length ? zipCodesFilter : undefined,
    ageMin: ageMin !== undefined ? ageMin : undefined,
    ageMax: ageMax !== undefined ? ageMax : undefined,
    sort: sort || undefined
  };

  const {
    dogIds,
    totalDogs,
    goToNextPage,
    goToPrevPage,
    isLoading: isLoadingIds,
    isError: isErrorIds
  } = useDogs(filters);

  const {
    dogs,
    isLoading: isLoadingDogs,
    isError: isErrorDogs
  } = useDogsByIds(dogIds);

  const startMatchingAnimation = () => {
    if (favorites.length === 0) return;

    setIsMatching(true);
    setFinalMatch(null);

    let index = 0;
    animationInterval = setInterval(() => {
      setCurrentMatchIndex(index);
      index = (index + 1) % favorites.length;
    }, 100);
  };

  const stopMatchingAnimation = (bestMatch: any) => {
    if (animationInterval) clearInterval(animationInterval);
    setIsMatching(false);
    const theMatch = favorites.find((dog) => dog.id === bestMatch);
    setFinalMatch(theMatch);
  };

  const handleFindMatch = async () => {
    startMatchingAnimation();
    const favArray = favorites.map((dog) => dog.id);
    await findMatch(favArray);
    stopMatchingAnimation(match?.match || undefined);
  };

  if (isLoadingDogs || isLoadingIds) return <p>Loading...</p>;
  if (isErrorDogs || isErrorIds) return <p>Error fetching dogs.</p>;
  return (
    <>
      <div className='flex flex-wrap items-center gap-4'>
        <DataTableFilterBox
          filterKey='breeds'
          title='Breeds'
          options={
            isLoading
              ? []
              : breeds.map((breed: any) => ({
                  label: breed,
                  value: breed
                }))
          }
          setFilterValue={setBreedsFilter}
          filterValue={breedsFilter}
        />

        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
        <TableViewToggleButton
          tableView={isTableView}
          setTableView={setIsTableView}
        />
        <div className='relative ml-auto flex h-full gap-3 pr-4'>
          {favorites.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'outline'} onClick={handleFindMatch}>
                  Find Match
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isMatching
                      ? 'Finding Your Best Match...'
                      : 'Your Best Match!'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isMatching ? (
                      <img
                        src={favorites[currentMatchIndex]?.img}
                        alt={favorites[currentMatchIndex]?.name}
                        className='mx-auto h-40 w-40 animate-pulse rounded-full object-cover'
                      />
                    ) : finalMatch ? (
                      <>
                        <img
                          src={finalMatch.img}
                          alt={finalMatch.name}
                          className='mx-auto h-40 w-40 rounded-full object-cover'
                        />
                        <p className='mt-2 text-center text-lg font-bold'>
                          Meet {finalMatch.name}!
                        </p>
                        <p className='text-center text-sm'>
                          {finalMatch.breed}, Age {finalMatch.age}
                        </p>
                      </>
                    ) : (
                      <p className='text-center'>No match found.</p>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  {finalMatch === undefined && (
                    <Button
                      onClick={() => {
                        handleFindMatch();
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                  {finalMatch && (
                    <Button
                      onClick={() => {
                        addMatch(finalMatch),
                          toast.success(
                            `${finalMatch.name} saved to your matches`
                          );
                      }}
                    >
                      Save Match
                    </Button>
                  )}
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <div className='relative hover:cursor-pointer'>
                {favorites.length ? (
                  <div className='absolute -right-2 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                    {favorites.length}
                  </div>
                ) : null}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Heart className={`fill-primary text-primary`} size={30} />
                  </TooltipTrigger>
                  <TooltipContent side='bottom' align='center'>
                    Favorite Pups
                  </TooltipContent>
                </Tooltip>
              </div>
            </PopoverTrigger>

            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <h2 className='w-full text-center uppercase'>Favorite Pups</h2>
                <Separator />
                <div className='space-y-2'>
                  {favorites.length > 0 ? (
                    favorites.map((dog) => (
                      <div
                        key={dog.id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex flex-col items-center space-x-2 text-sm'>
                          <img
                            src={dog.img}
                            alt={dog.name}
                            className='h-8 w-8 rounded-full'
                          />
                          <span>{dog.name}</span>
                        </div>
                        <div className='flex flex-col items-center space-x-2 text-xs'>
                          <span>Age {dog.age}</span>

                          <span>{dog.breed}</span>
                        </div>

                        <Button
                          variant='outline'
                          onClick={() => {
                            deleteFavorite(dog.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className='text-center'>No favorites yet</div>
                  )}
                </div>
                {favorites.length > 0 && (
                  <>
                    <Separator />
                    <Button className='w-full' onClick={resetFavorites}>
                      Clear Favorites
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Matches */}
          <Popover>
            <PopoverTrigger asChild>
              <div className='relative hover:cursor-pointer'>
                {matches.length ? (
                  <div className='absolute -right-2 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                    {matches.length}
                  </div>
                ) : null}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PawPrint
                      className={`fill-primary text-primary`}
                      size={30}
                    />
                  </TooltipTrigger>
                  <TooltipContent side='bottom' align='center'>
                    Saved Matches
                  </TooltipContent>
                </Tooltip>
              </div>
            </PopoverTrigger>

            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <h2 className='w-full text-center uppercase'>Saved Matches</h2>
                <Separator />
                <div className='space-y-2'>
                  {matches.length > 0 ? (
                    matches.map((dog) => (
                      <div
                        key={dog.id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex flex-col items-center space-x-2 text-sm'>
                          <img
                            src={dog.img}
                            alt={dog.name}
                            className='h-8 w-8 rounded-full'
                          />
                          <span>{dog.name}</span>
                        </div>
                        <div className='flex flex-col items-center space-x-2 text-xs'>
                          <span>Age {dog.age}</span>

                          <span>{dog.breed}</span>
                        </div>

                        <Button
                          variant='outline'
                          onClick={() => removeMatch(dog.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className='text-center'>No matches yet</div>
                  )}
                </div>
                {matches.length > 0 && (
                  <>
                    <Separator />
                    <Button className='w-full' onClick={resetMatches}>
                      Clear Matches
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <PupTable
        columns={columns}
        data={dogs}
        totalItems={totalDogs}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        isLoading={isLoadingDogs || isLoadingIds}
        isTableView={isTableView}
      />
    </>
  );
}
