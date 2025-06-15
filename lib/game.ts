/**
 * @file This module contains the core logic for the number guessing game.
 * The "magic" of the game is based on the binary representation of numbers.
 *
 * @description
 * The game works by cleverly using powers of two. Here's the breakdown:
 * 1.  **Binary Representation**: Every number can be uniquely represented as a sum of powers of two.
 *     For example, the number 13 is 8 + 4 + 1, which in binary is `1101`.
 *
 * 2.  **Magic Cards**: The game presents a series of cards. Each card corresponds to a power of two
 *     (1, 2, 4, 8, 16, 32, 64). A number is included on a card if its binary form has a "1"
 *     in the position corresponding to that card's power of two.
 *
 * 3.  **Deducing the Number**: When you answer "Yes" to a card, you are confirming that the
 *     corresponding power of two is part of your number's binary sum. The game adds that
 *     card's value to a running total. After all cards are shown, this total will be your secret number.
 */
import { cards } from '../constants';

/**
 * The initial state for the game.
 */
export const initialState = {
  /** The current card index being shown, from 0 to 6. */
  step: 0,
  /** The running total of the values of the cards the user has answered "Yes" to. */
  calculatedNumber: 0,
  /** A flag to indicate if the game has finished all steps. */
  isFinished: false,
};

/**
 * The game's state machine, which handles all state transitions based on user actions.
 * @param state The current state of the game.
 * @param action The action dispatched by the user.
 * @returns The new state of the game.
 */
export function gameReducer(state: typeof initialState, action: { type: string }) {
  switch (action.type) {
    case 'ANSWER_YES': {
      const isFinished = state.step === cards.length - 1;
      return {
        ...state,
        // This is the core of the "magic". We add the value of the current card (a power of two)
        // to our running total.
        calculatedNumber: state.calculatedNumber + cards[state.step].value,
        step: isFinished ? state.step : state.step + 1,
        isFinished,
      };
    }
    case 'ANSWER_NO': {
      const isFinished = state.step === cards.length - 1;
      return {
        ...state,
        // If the user says "No", we simply move to the next card without changing the calculated number.
        step: isFinished ? state.step : state.step + 1,
        isFinished,
      };
    }
    case 'RESTART':
      // Resets the game to its initial state for a new round.
      return initialState;
    default:
      return state;
  }
} 