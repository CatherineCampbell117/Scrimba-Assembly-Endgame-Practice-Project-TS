import { useState } from 'react';
import './App.css';
import { languages } from './languages';
import type { Language } from './languages';
import Chip from './Components/Chip';
import LetterBox from './Components/LetterBox';
import AlphLetter from './Components/AlphLetter';
import { getFarewellText } from './utils';
import { getWord } from './utils';
import type { JSX } from 'react';

export default function Hangman() {
    // State values
    const [currentWord, setCurrentWord] = useState<string>((): string => getWord());
    const [GuessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>('');

    // Static values
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    // Derived values
    let wrongGuessCount: number = GuessedLetters.filter(
        (letter: string): boolean => !currentWord.toUpperCase().includes(letter)
    ).length;

    /**
     * Determines if the game is won by checking if every letter in the current word
     * has been guessed.
     * Determines if the game is lost by comparing the number of wrong guesses
     * to the total number of language chips.
     * `isGameOver` is true if either win or loss condition is met.
     */
    const isGameWon: boolean = currentWord
        .toUpperCase()
        .split('')
        .every((letter: string): boolean => GuessedLetters.includes(letter));
    const isGameLost: boolean = wrongGuessCount >= languages.length - 1;
    const isGameOver: boolean = isGameWon || isGameLost;
    const isWrongGuess: boolean | string =
        currentGuess && !currentWord.toUpperCase().includes(currentGuess);
    const recentlyLostLanguage: string | null =
        wrongGuessCount > 0 ? languages[wrongGuessCount - 1]?.name : null;
    const guessesLeft: number = languages.length - 1 - wrongGuessCount;

    // Functions
    /**
     * Adds a guessed letter to the list of previously guessed letters,
     * only if it hasn't been guessed already
     * @param {string} letter - The letter that the user has guessed.
     */
    function LetterGuessed(letter: string): void {
        setGuessedLetters((prevLetters: string[]): string[] =>
            prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
        );
        setCurrentGuess(letter);
    }

    /**
     * Returns the appropriate class name for the game status section
     * based on whether the game is won, lost, or still in progress.
     */

    function classList() {
        if (isGameWon) {
            return 'gameStatus won';
        } else if (isGameLost) {
            return 'gameStatus lost';
        } else if (isWrongGuess) {
            return 'gameStatus wrong';
        } else {
            return 'gameStatus';
        }
    }

    console.log(`Wrong Guesses: ${wrongGuessCount}`);
    console.log(`Game Lost: ${isGameLost}`);
    console.log(`Game Over: ${isGameOver}`);
    console.log(`Wrong Guess: ${isWrongGuess}`);

    // Components mapping
    /**
     * Maps over each language object from the imported `languages` array.
     * For each language, determines whether it should be marked as "lost"
     * based on the number of wrong guesses.
     * Returns a Chip component with relevant props including name, background color,
     * text color, and a flag to conditionally apply the "lost" class.
     */
    const langChips: JSX.Element[] = languages.map(
        (langObj: Language, index: number): JSX.Element => {
            const addLost: boolean = index < wrongGuessCount;
            return (
                <Chip
                    key={index}
                    lang={langObj.name}
                    bgColor={langObj.backgroundColor}
                    textColor={langObj.color}
                    addLostClass={addLost}
                />
            );
        }
    );

    console.log(GuessedLetters);

    /**
     * Splits the current word into individual letters and maps over them.
     * Converts each letter to uppercase and checks if it has been guessed.
     * Returns a LetterBox component for each letter, with a flag indicating
     * whether it should be revealed.
     */
    const wordLetters: JSX.Element[] = currentWord
        .split('')
        .map((letter: string, index: number) => {
            const upperLetter: string = letter.toUpperCase();
            const isRevealed: boolean = GuessedLetters.includes(upperLetter);
            const revealUnguessedLetter: boolean =
                isGameLost && !GuessedLetters.includes(upperLetter);
            return (
                <LetterBox
                    key={index}
                    letter={upperLetter}
                    CorrectGuess={isRevealed}
                    RevealLetter={revealUnguessedLetter}
                />
            );
        });

    /**
     * Maps over each letter in the alphabet.
     * Converts each letter to uppercase and checks if it has been guessed.
     * Determines whether the guessed letter is correct or incorrect.
     * Returns an AlphLetter component with props reflecting its guessed status.
     */
    const alphabetLetters: JSX.Element[] = alphabet
        .split('')
        .map((alphLetter: string, index: number) => {
            const upperLetter: string = alphLetter.toUpperCase();
            const isGuessed: boolean = GuessedLetters.includes(upperLetter);
            const isCorrect: boolean = isGuessed && currentWord.toUpperCase().includes(upperLetter);
            const isIncorrect: boolean =
                isGuessed && !currentWord.toUpperCase().includes(upperLetter);
            return (
                <AlphLetter
                    isGuessed={isGuessed}
                    isCorrect={isCorrect}
                    isIncorrect={isIncorrect}
                    key={index}
                    alphLetter={alphLetter.toUpperCase()}
                    onLetterClick={LetterGuessed}
                    disabled={isGameOver}
                    // ariaDisabled={GuessedLetters.includes(letter)}
                    // ariaLabel={`letter ${letter}`}
                />
            );
        });

    function ResetGame(): void {
        setCurrentWord(getWord());
        setGuessedLetters([]);
        setCurrentGuess('');
    }

    //JSX return

    return (
        <>
            <main>
                <header>
                    <h1>Assembly: Endgame</h1>
                    <p>
                        Guess the word in under 8 attempts to keep the programming world safe from
                        Assembly!
                    </p>
                </header>
                {/* Runs classList to determine appropriate styling for game status */}
                <section className={classList()} aria-live="polite" role="status">
                    <h2>
                        {(isGameWon ? 'You Win!' : '') ||
                            (isGameLost ? 'Game over!' : '') ||
                            (isWrongGuess ? getFarewellText(recentlyLostLanguage) + '🫡' : '')}
                    </h2>
                    <p>
                        {(isGameWon ? 'Well done!🎉' : '') ||
                            (isGameLost ? 'You lose! Better start learning Assembly 😭' : '')}
                    </p>
                </section>
                <section className="chipsContainer">{langChips}</section>
                <section className="wordContainer">{wordLetters}</section>
                <section className="sr-only" aria-live="polite" role="status">
                    <p>
                        {currentWord.includes(currentGuess)
                            ? `Correct! The letter ${currentGuess} is in the word.`
                            : `Sorry, the letter ${currentGuess} is not in the word.`}
                        You have {guessesLeft} attempts left.
                    </p>
                    <p>
                        Current word:
                        {currentWord
                            .split('')
                            .map(letter =>
                                GuessedLetters.includes(letter) ? letter + '.' : 'blank.'
                            )
                            .join(' ')}
                    </p>
                </section>
                <section className="alphabetContainer">{alphabetLetters}</section>
                {/* Conditionally renders the "New Game" button if the game is over */}
                {isGameOver && (
                    <button onClick={ResetGame} className="new-game">
                        New Game
                    </button>
                )}
            </main>
        </>
    );
}
