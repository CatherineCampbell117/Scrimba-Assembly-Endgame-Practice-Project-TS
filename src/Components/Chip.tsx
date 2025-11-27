import type { JSX } from 'react';
import type { Language } from '../languages';

type ChipProps = {
    bgColor: string;
    textColor: string;
    addLostClass: boolean;
    lang: string;
};

export default function Chip({ bgColor, textColor, addLostClass, lang }: ChipProps): JSX.Element {
    const style: Omit<Language, 'name'> = {
        backgroundColor: bgColor,
        color: textColor
    };

    return (
        <div style={style} className={addLostClass ? 'chip lost' : 'chip'}>
            <p>{lang}</p>
        </div>
    );
}
