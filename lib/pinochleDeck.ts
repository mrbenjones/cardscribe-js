import {v4 as uuidv4} from 'uuid';
import {Card} from './card'
import {shuffle} from "./shuffle";
/**
 * Enum representing the suits in a Pinochle deck.
 *
 * @readonly
 * @enum {string}
 */
export enum PINOCHLESUITS {
    /** Represents the Heart suit. */
    HEART = 'H',
    /** Represents the Club suit. */
    CLUB = 'C',
    /** Represents the Diamond suit. */
    DIAMOND = 'D',
    /** Represents the Spade suit. */
    SPADE = 'S'
}
/**
 * Enum representing the ranks in a Pinochle deck.
 *
 * @readonly
 * @enum {string}
 */
export enum PINOCHLERANKS {
    /** Represents the Nine rank. */
    NINE = '9',
    /** Represents the Jack rank. */
    JACK = 'J',
    /** Represents the Queen rank. */
    QUEEN = 'Q',
    /** Represents the King rank. */
    KING = 'K',
    /** Represents the Ten rank. */
    TEN = 'T',
    /** Represents the Ace rank. */
    ACE = 'A'
}
/**
 * Simplified generator function that creates a Pinochle deck.
 *
 * This function generates a Pinochle deck, which consists of 48 cards.
 * Each card has a unique ID, a rank, and a suit. The deck includes all
 * combinations of the four suits (Heart, Club, Diamond, Spade) and the
 * six ranks (Nine, Jack, Queen, King, Ten, Ace), with each combination
 * appearing twice.
 *
 * @generator
 * @yields {Object} The next card in the deck. Each card is an object with
 *                  three properties: `id`, `rank`, and `suit`. The `id` is
 *                  a unique identifier for the card, the `rank` is one of
 *                  the six ranks in a Pinochle deck, and the `suit` is one
 *                  of the four suits in a Pinochle deck.
 */
function* pinochleDeckGenerator() {
    const suits = Object.values(PINOCHLESUITS);
    const ranks = Object.values(PINOCHLERANKS);

    for (let idx = 0; idx < 2; idx++) {
        for (const suit of suits) {
            for (const rank of ranks) {
                yield { id: uuidv4(), rank, suit };
            }
        }
    }
}


export const deck = () => shuffle([...pinochleDeckGenerator()]);

