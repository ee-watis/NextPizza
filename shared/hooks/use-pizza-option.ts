import { ProductItem } from '@prisma/client';
import { PizzaType } from '@/shared/constants/pizza';
import React from 'react';
import { PizzaSize } from '../constants/pizza';
import { Variant } from '../components/shared/group-variants';
import { useSet } from 'react-use';
import { getAvailablePizzaSizes } from '../lib';

interface ReturnProps {
  currentItemId?: number;
  size: PizzaSize;
  type: PizzaType;
  selectedIngredients: Set<number>;
  availableSizes: Variant[];
  setSize: (size: PizzaSize) => void;
  setType: (type: PizzaType) => void;
  addIngredient: (id: number) => void;
}

export const usePizzaOption = (items: ProductItem[] = []): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setTypeState] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const availableSizes = getAvailablePizzaSizes(type, items);

  const currentItemId = items.find((item) => item.pizzaType === type && item.size === size)?.id;

  const setType = (newType: PizzaType) => {
    setTypeState(newType);

    const newAvailableSizes = getAvailablePizzaSizes(newType, items);
    const isAvailableSize = newAvailableSizes.find(
      (item) => Number(item.value) === size && !item.disabled,
    );
    const firstAvailableSize = newAvailableSizes.find((item) => !item.disabled);

    if (!isAvailableSize && firstAvailableSize) {
      setSize(Number(firstAvailableSize.value) as PizzaSize);
    }
  };

  return {
    currentItemId,
    size,
    type,
    selectedIngredients,
    availableSizes,
    setSize,
    setType,
    addIngredient,
  };
};