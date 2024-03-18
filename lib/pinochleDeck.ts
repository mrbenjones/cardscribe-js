import {v4 as uuidv4} from 'uuid';
import {Card} from './card'
export enum PINOCHLESUITS {
    HEART = 'H',
    CLUB = 'C',
    DIAMOND = 'D',
    SPADE = 'S'
}
export  enum PINOCHLERANKS {
    NINE = '9',
    JACK = 'J',
    QUEEN = 'Q',
    KING = 'K',
    TEN = 'T',
    ACE = 'A'
}
function* pinochleDeckGenerator() {
    for (const idx in [1,2]) {
        for (const suit in PINOCHLESUITS) {
            for (const rank in PINOCHLERANKS) {
                yield {
                    id: uuidv4(),
                    rank: PINOCHLERANKS[rank],
                    suit: PINOCHLESUITS[suit]
                }
            }
        }
    }
}

export function deck(): Card<PINOCHLESUITS, PINOCHLERANKS>[] {
    return [...pinochleDeckGenerator()]
}

