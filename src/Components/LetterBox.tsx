import type { JSX } from 'react';

type LetterBoxProps = {
    RevealLetter: boolean;
    CorrectGuess: boolean;
    letter: string;
};

export default function LetterBox({
    RevealLetter,
    CorrectGuess,
    letter
}: LetterBoxProps): JSX.Element {
    const style = {
        backgroundColor: '#323232',
        color: '#F9F4DA'
    };

    function classList() {
        if (RevealLetter) {
            return 'letterRevealed';
        } else if (CorrectGuess) {
            return '';
        } else {
            return 'letterHidden';
        }
    }

    return (
        <span style={style} className="letterBox">
            <p className={classList()}>{letter}</p>
        </span>
    );
}
