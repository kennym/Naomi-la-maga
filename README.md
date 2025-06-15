# Naomi La Maga

![Naomi la Maga Game Preview](./assets/preview.jpeg)

Welcome to "Naomi La Maga," a fun and engaging number guessing game built with React Native and Expo.

## 🎮 How to Play

The game is simple. A secret number is chosen, and you have to guess it. With each guess, you'll get a hint telling you if your guess is too high or too low. Use the hints to find the number and win!

## 🤔 Spoiler: This is how the "magic" works

The "magic" behind this game lies in the binary representation of numbers. Here's how it deciphers your secret number:

1.  **Binary Breakdown**: Every number can be represented as a sum of powers of two (e.g., `13 = 8 + 4 + 1`). This is the foundation of binary code.

2.  **The Cards**: The game presents you with 7 cards of numbers. Each card represents one of these powers of two (1, 2, 4, 8, 16, 32, 64). A number will appear on a card if its binary representation includes that power of two.
    -   For example, the number **13** is `8 + 4 + 1`. So, 13 will appear on the cards for `1`, `4`, and `8`.

3.  **Your "Yes" is a Clue**: When you are shown a card and asked if your number is on it, your "Yes" or "No" answer tells the game which powers of two are part of your number.

4.  **The Final Reveal**: The game simply adds up the values of the cards for which you answered "Yes". Following our example, if you said "Yes" only to the cards for 1, 4, and 8, the game calculates `1 + 4 + 8 = 13` and "magically" guesses your number.

It's a classic mathematical trick dressed up as magic! You can see exactly how this logic is implemented in the [`lib/game.ts`](./lib/game.ts) file.

## ✨ Features

-   **Cross-Platform**: Play on the web, iOS, and Android thanks to React Native and Expo.
-   **Simple & Fun**: An easy-to-learn game for all ages.
-   **Multi-language**: Supports multiple languages.

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/naomi-la-maga.git
    cd naomi-la-maga
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    -   To run on iOS: `npm run ios`
    -   To run on Android: `npm run android`
    -   To run on the web: `npm run web`

## 🛠️ Built With

-   [React Native](https://reactnative.dev/) - A framework for building native apps using React.
-   [Expo](https://expo.dev/) - A framework and a platform for universal React applications.
-   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript. 