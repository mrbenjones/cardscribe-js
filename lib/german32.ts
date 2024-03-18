import {v4 as uuidv4} from 'uuid';
import {Card} from './card'

export enum GERMANSUITS {
    EICHEL= 'E',
    BLAU = 'B',
    SCHELL = 'S',
    HERZ = 'H',
}

export enum RANKS {
    S7 = 'S7',
    S8 = 'S8',
    S9 = 'S9',
    DAME = 'D',
    KONIG = 'K',
    ZEHN = 'Z',
    ASS = 'A'
}

function* germanDeckGenerator() {
    for (const suit in GERMANSUITS) {
        for (const rank in RANKS) {
            yield {
                id: uuidv4(),
                suit: suit,
                rank: rank
            }
        }
    }
}

export function germanDeck() {
    return [...germanDeckGenerator()]
}