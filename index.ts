#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';

// List of words for the game
const words: string[] = ['hangman', 'javascript', 'typescript', 'nodejs', 'inquirer', 'chalk', 'coding'];

// Function to pick a random word from the list
function getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Function to hide the letters of the word with dashes
function hideWord(word: string, guessedLetters: Set<string>): string {
    return word
        .split('')
        .map(letter => (guessedLetters.has(letter) ? letter : '-'))
        .join('');
}

// Function to draw Hangman based on incorrect guesses
function drawHangman(incorrectGuesses: number): void {
    const stages = [
        `
        _________
        |       |
        |
        |
        |
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |
        |
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |       |
        |
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |      /|
        |
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |      /|\\
        |
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |      /|\\
        |      /
        |
        |_________
        `,
        `
        _________
        |       |
        |       O
        |      /|\\
        |      / \\
        |
        |_________
        `,
    ];
    console.log(chalk.red(stages[incorrectGuesses]));
}

// Main game function
async function playHangman() {
    const word = getRandomWord();
    const guessedLetters = new Set<string>();
    let attemptsLeft = 6;

    console.log(chalk.yellow.bold('Welcome to Hangman!'));
    console.log(chalk.yellow.bold('Guess the word:'));

    while (attemptsLeft > 0) {
        drawHangman(6 - attemptsLeft);
        console.log(chalk.blue.bold(hideWord(word, guessedLetters)));
        const { guess }: { guess: string } = await inquirer.prompt([
            {
                name: 'guess',
                type: 'input',
                message: 'Guess a letter:',
                validate: (input) => {
                    if (!input || input.length !== 1 || !/[a-zA-Z]/.test(input)) {
                        return 'Please enter a single letter.';
                    }
                    if (guessedLetters.has(input.toLowerCase())) {
                        return 'You already guessed that letter.';
                    }
                    return true;
                },
            },
        ]);
        const guessedLetter = guess.toLowerCase();
        guessedLetters.add(guessedLetter);

        if (!word.includes(guessedLetter)) {
            attemptsLeft--;
            console.log(chalk.red.bold(`Incorrect! ${attemptsLeft} attempts left.`));
        } else {
            console.log(chalk.green.bold('Correct guess!'));
        }

        const hiddenWord = hideWord(word, guessedLetters);
        if (hiddenWord === word) {
            console.log(chalk.green.bold('Congratulations! You guessed the word: ' + word));
            return;
        }
    }

    drawHangman(6 - attemptsLeft);
    console.log(chalk.red.bold('Out of attempts! The word was: ' + word));
}

// Start the game
playHangman();
