import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from '../card';
import Image from 'next/image';
import { Dog } from 'types';
import { Percent, Hop, Badge, Cake, MapPin } from 'lucide-react';
import { Separator } from '../separator';
import { CellAction } from '@/features/products/components/dog-tables/cell-action';
type Props = {
  dog: Dog;
};

const DogCard = ({ dog }: Props) => {
  return (
    <Card>
      <Image
        src={dog.img}
        className='aspect-square h-64 w-full rounded-t-lg object-cover'
        alt={''}
        width={500}
        height={500}
      />

      <CardContent className='p-4'>
        <CardTitle className='text-2xl font-bold'>
          {dog.name}

          <p className='text-left text-base text-gray-500 dark:text-gray-400'>
            {dog.breed}
          </p>
          <Card className='my-4 flex w-full items-center justify-between p-2'>
            <div className='flex-1 text-center text-base font-bold'>
              {dog.age}
              <h5 className='flex items-center justify-center gap-1 text-sm'>
                <Cake size={16} className='text-indigo-500' />
                Years Old
              </h5>
            </div>
            <Separator
              className='mx-2 h-10 bg-gray-400'
              orientation='vertical'
            />
            <div className='flex-1 text-center text-base font-bold'>
              {dog.zip_code}
              <h5 className='flex items-center justify-center gap-1 text-sm'>
                <MapPin size={16} className='text-indigo-500' />
                Zip Code
              </h5>
            </div>
          </Card>
        </CardTitle>
      </CardContent>
      <CardFooter className='flex items-center justify-end'>
        <CellAction data={dog} />
      </CardFooter>
    </Card>
  );
};

export default DogCard;
