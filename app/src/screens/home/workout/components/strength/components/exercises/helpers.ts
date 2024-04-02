import { GAP_BETWEEN_GROUPS } from './types';

export function objectMove(positions: any, fromId: any, newIndex: any) {
  'worklet';
  const newObject = Object.assign({}, positions);

  const ids = Object.keys(positions);

  // Calculate new translateY values for all items based on the new index of the dragged item
  const sortedItems = ids.sort(
    (a, b) =>
      (positions[a]?.sortOrder as number) - (positions[b]?.sortOrder as number),
  );

  const fromIndex = sortedItems.indexOf(fromId);

  // Remove the dragged item and splice it into its new position
  const removedItem = sortedItems.splice(fromIndex, 1)[0];
  sortedItems.splice(newIndex, 0, removedItem);

  // Update translateY based on new order
  let accumulatedHeight = 0;

  sortedItems.forEach((itemId, i) => {
    const props = positions[itemId];
    newObject[itemId] = {
      ...props,
      positionY: accumulatedHeight,
      sortOrder: i,
    };
    accumulatedHeight += props.height + GAP_BETWEEN_GROUPS;
  });

  return newObject;
}
