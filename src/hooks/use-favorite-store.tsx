import { Dog } from 'types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: Dog[];
  matches: Dog[];
  addOrUpdateFavorite: (dog: Dog) => void;
  deleteFavorite: (id: string) => void;
  resetFavorites: () => void;
  addMatch: (dog: Dog) => void;
  removeMatch: (id: string) => void;
  resetMatches: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      matches: [],

      addOrUpdateFavorite: (dog) =>
        set((state) => {
          const index = state.favorites.findIndex((fav) => fav.id === dog.id);
          const newFavorites = [...state.favorites];

          if (index >= 0) {
            newFavorites[index] = dog;
          } else {
            newFavorites.push(dog);
          }

          return { favorites: newFavorites };
        }),

      deleteFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id)
        })),

      addMatch: (dog) =>
        set((state) => {
          if (!state.matches.some((match) => match.id === dog.id)) {
            return { matches: [...state.matches, dog] };
          }
          return state;
        }),

      removeMatch: (id) =>
        set((state) => ({
          matches: state.matches.filter((match) => match.id !== id)
        })),

      resetMatches: () => set({ matches: [] }),

      resetFavorites: () => set({ favorites: [] })
    }),
    {
      name: 'favorites-storage'
    }
  )
);
