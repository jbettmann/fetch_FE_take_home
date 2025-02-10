'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Product } from '@/constants/data';
import { useFavorites } from '@/hooks/use-favorite-store';
import { Edit, Heart, MoreHorizontal, Star, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dog } from 'types';

interface CellActionProps {
  data: Dog;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { favorites, addOrUpdateFavorite, deleteFavorite } = useFavorites();

  const [isFavorite, setIsFavorite] = useState(
    favorites.some((fav) => fav.id === data.id)
  );

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      deleteFavorite(data.id);
      toast.success(`${data.name} removed from favorites`);
    } else {
      addOrUpdateFavorite(data);
      toast.success(`${data.name} added to favorites`);
    }
  };

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === data.id));
  }, [data.id, favorites]);

  return (
    <div
      className='hover:cursor-pointer'
      onClick={() => handleFavoriteToggle()}
    >
      <Heart
        className={`text-indigo-500 ${isFavorite ? 'fill-indigo-500' : ''}`}
      />
    </div>
  );
};
