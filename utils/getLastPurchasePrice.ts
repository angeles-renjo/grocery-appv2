// utils/getLastPurchasePrice.ts
import { groceryNormalizer } from './groceryNormalizer';
import type { TodoItem, TodoList } from '@/utils/types';

export const getLastPurchasePrice = (
  lists: TodoList[],
  itemName: string
): number => {
  const decodedItemName = decodeURIComponent(itemName);

  const completedLists = lists
    .filter((list) => list.isCompleted && list.completedAt)
    .sort(
      (a, b) =>
        new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime()
    );

  // Get the most recent list that contains the item
  const lastList = [...completedLists]
    .reverse()
    .find((list) =>
      list.items.some((item) =>
        groceryNormalizer.isSameItem(item.name, decodedItemName)
      )
    );

  if (!lastList) return 0;

  // Find the matching item in the last list
  const lastItem = lastList.items.find((item) =>
    groceryNormalizer.isSameItem(item.name, decodedItemName)
  );

  return lastItem?.price || 0;
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
