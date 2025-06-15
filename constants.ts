export const MAX_NUMBER: number = 100;
export const cardValues: number[] = [1, 2, 4, 8, 16, 32, 64];

export interface Card {
  value: number;
  numbers: number[];
}

export const generateCards = (): Card[] => {
  return cardValues.map((value: number) => {
    const numbers: number[] = [];
    for (let i = 1; i <= MAX_NUMBER; i++) {
      if ((i & value) > 0) {
        numbers.push(i);
      }
    }
    return { value, numbers };
  });
};

export const cards: Card[] = generateCards(); 