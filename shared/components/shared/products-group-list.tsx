/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';   
import React, { useRef } from 'react';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { ProductCard } from './product-card';
import { useIntersection } from 'react-use';    
import { useCategoryStore } from '../../store/catagory';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
    title: string;
    items: ProductWithRelations[];
    categoryId: number;
    listClassName?: string;
    className?: string;
  }

  export const ProductsGroupList: React.FC<Props> = ({ title, items, categoryId, listClassName, className }) => {
    const setActiveidCategoryId = useCategoryStore((state) => state.setActiveId)
    const intersectionRef = useRef<HTMLDivElement>(null);
    const intersection = useIntersection(
        intersectionRef as React.RefObject<HTMLElement>,
        {
          threshold: 0.4,
        }
      );

    React.useEffect(() => {
        if (intersection?.isIntersecting) {
            setActiveidCategoryId(categoryId);            
        }
    }, [categoryId, intersection?.isIntersecting, title])
    
    return (
    <div className={className} id={title} ref={intersectionRef}>
        <Title text={title} size="lg" className="font-extrabold mb-5" />
        <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
            {items.map((item) => (
            <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                imageUrl={item.imageUrl}
                price={item.items[0].price}
                ingredients={item.ingredients}
                // count={i % 2}
            />
            ))}
        </div>
    </div>
  );
};