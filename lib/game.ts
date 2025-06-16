/**
 * @file This module contains the core logic for the number guessing game.
 * The "magic" of the game is based on the binary representation of numbers.
 *
 * @description
 * The game works by cleverly using powers of two. To make it more mysterious, the game randomly
 * chooses between two "magic" variants each time it starts:
 *
 * 1.  **Standard Variant**:
 *     -   **Binary Representation**: Every number is a unique sum of powers of two (e.g., 13 = 8 + 4 + 1).
 *     -   **Magic Cards**: Each card represents a power of two (1, 2, 4, 8, ...). A number appears on a card if its binary form includes that power of two.
 *     -   **The Reveal**: The game sums the values of the cards you say "Yes" to, revealing your number.
 *
 * 2.  **Inverted Variant**:
 *     -   **The Trick**: This variant works with a "secret" number: `(101 - your number)`.
 *     -   **Magic Cards**: The cards are generated based on the bits of this secret number. To you, the cards look completely different.
 *     -   **The Reveal**: The game sums the values for your "Yes" answers to find the secret number (e.g., 88). It then calculates `101 - 88` to reveal your original number, 13.
 *
 * This dual-variant approach ensures the card patterns are not easily recognizable, enhancing the magic.
 */
import { generateCards, Card, GameVariant, MAX_NUMBER } from '../constants';

export interface GameState {
  /** The current card index being shown, from 0 to 6. */
  step: number;
  /** The running total of the values of the cards the user has answered "Yes" to. */
  calculatedNumber: number;
  /** A flag to indicate if the game has finished all steps. */
  isFinished: boolean;
  /** The current game variant ('standard' or 'inverted'). */
  variant: GameVariant;
  /** The set of cards being used for the current game round. */
  cards: Card[];
}

/**
 * Creates the initial state for a new game.
 * It randomly selects a game variant ('standard' or 'inverted') and generates the corresponding cards.
 * @returns The initial state for a new game.
 */
export function createInitialState(): GameState {
  const variant: GameVariant = Math.random() < 0.5 ? 'standard' : 'inverted';
  const cards = generateCards(variant);
  return {
    step: 0,
    calculatedNumber: 0,
    isFinished: false,
    variant,
    cards,
  };
}

/**
 * The game's state machine, which handles all state transitions based on user actions.
 * @param state The current state of the game.
 * @param action The action dispatched by the user.
 * @returns The new state of the game.
 */
export function gameReducer(state: GameState, action: { type: string }): GameState {
  switch (action.type) {
    case 'ANSWER_YES': {
      const newCalculatedNumber = state.calculatedNumber + state.cards[state.step].value;
      if (state.step < state.cards.length - 1) {
        return {
          ...state,
          calculatedNumber: newCalculatedNumber,
          step: state.step + 1,
        };
      } else {
        // This is the final step. We calculate the final sum.
        const finalSum = newCalculatedNumber;
        // If the game is in the 'inverted' variant, we subtract the sum from (MAX_NUMBER + 1)
        // to get the original number. Otherwise, the sum is the number.
        const finalNumber = state.variant === 'inverted' ? (MAX_NUMBER + 1) - finalSum : finalSum;
        return {
          ...state,
          calculatedNumber: finalNumber,
          isFinished: true,
        };
      }
    }
    case 'ANSWER_NO': {
      if (state.step < state.cards.length - 1) {
        return { ...state, step: state.step + 1 };
      } else {
        // This is the final step. We have the final sum (which hasn't changed on a "No" answer).
        const finalSum = state.calculatedNumber;
        // If the game is in the 'inverted' variant, we subtract the sum from (MAX_NUMBER + 1)
        // to get the original number. Otherwise, the sum is the number.
        const finalNumber = state.variant === 'inverted' ? (MAX_NUMBER + 1) - finalSum : finalSum;
        return {
          ...state,
          calculatedNumber: finalNumber,
          isFinished: true,
        };
      }
    }
    case 'RESTART':
      // Resets the game to its initial state for a new round with a new random variant.
      return createInitialState();
    default:
      return state;
  }
} 