import type { JSX } from 'react';

type AlphLetterProps = {
    isGuessed: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    disabled: boolean;
    alphLetter: string;
    onLetterClick: (alphLetter: string) => void;
};

export default function AlphLetter({
    isCorrect,
    isIncorrect,
    disabled,
    alphLetter,
    onLetterClick
}: AlphLetterProps): JSX.Element {
    let backgroundColor = '#FCBA29';

    if (isCorrect) {
        backgroundColor = '#10A95B';
    } else if (isIncorrect) {
        backgroundColor = '#EC5D49';
    }

    let opacity = 100;
    let cursor = isCorrect || isIncorrect ? 'default' : 'pointer';

    if (disabled) {
        opacity = 0.5;
        cursor = 'not-allowed';
    }

    const style = {
        backgroundColor,
        color: '#1E1E1E',
        opacity,
        cursor
    };

    return (
        <button
            disabled={disabled}
            style={style}
            className="alphLetterBox"
            // Adding empty function tells React do nothing until the button is clicked.
            // When clicked, it calls onLetterClick(alphLetter) with the correct letter.
            // alphLetter is passed in as a prop from App.jsx. Once clicked, AlphLetter component tells
            // App.jsx which letter was clicked by calling the function passed in as a prop: onLetterClick
            onClick={() => {
                onLetterClick(alphLetter);
            }}
        >
            <p>{alphLetter}</p>
        </button>
    );
}
