export const MAX_NUMBER: number = 100;
export const cardValues: number[] = [1, 2, 4, 8, 16, 32, 64];

export type GameVariant = 'standard' | 'inverted';

export interface Card {
  value: number;
  numbers: number[];
}

export const generateCards = (variant: GameVariant): Card[] => {
  return cardValues.map((value: number) => {
    const numbers: number[] = [];
    for (let i = 1; i <= MAX_NUMBER; i++) {
      // For the inverted variant, we check the bits of (MAX_NUMBER + 1 - i)
      const numberToCheck = variant === 'inverted' ? (MAX_NUMBER + 1) - i : i;
      if ((numberToCheck & value) > 0) {
        numbers.push(i);
      }
    }
    return { value, numbers };
  });
}; 