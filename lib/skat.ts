import {
    appendCardToGameHoldings,
    Card,
    CardSuitListMap,
    emptyGameHoldings,
    GameHoldings,
    toCardSuitListMap
} from './card'
import {v4 as uuidv4} from 'uuid';
import {shuffle} from "./shuffle";

export enum SKATSUITS {
    KREUZ = 'KREUZ',
    PIK = 'PIK',
    HERZ = 'HERZ',
    KARO = 'KARO',
    NONE = 'NONE'
}

export enum SKATRANKS {
    ASS = 'A',
    ZEHN = 'Z',
    KONIG = 'K',
    DAME = 'D',
    NEUN = '9',
    ACHT = '8',
    SIEBEN = '7',
    BUBBE = 'B'
}

export enum SKATSEATS {
    VORHAND = 'VH',
    MITTELHAND = 'MH',
    BACKHAND = 'BH',
    SPIEL = 'SPIEL'
}

export enum SKATHOLDINGS {
    HAND = 'HAND',
    STICHEN = 'STICHEN',
    SKAT = 'SKAT'
}

function * generateCards() {
    for (const suit in [SKATSUITS.KREUZ, SKATSUITS.PIK,
    SKATSUITS.HERZ, SKATSUITS.KARO]) {
        for (const rank in SKATRANKS) {
            yield {
                id: uuidv4(),
                suit: SKATSUITS[suit],
                rank: SKATRANKS[rank]
            }
        }
    }
}
const players = [SKATSEATS.VORHAND, SKATSEATS.MITTELHAND, SKATSEATS.BACKHAND]
export function deal():GameHoldings<SKATSUITS, SKATRANKS, SKATSEATS, SKATHOLDINGS> {
    const deck:Card<SKATSUITS, SKATRANKS>[] = shuffle([...generateCards()])
    const holdings: GameHoldings<SKATSUITS, SKATRANKS, SKATSEATS, SKATHOLDINGS>
        = emptyGameHoldings()
    // dish out deck to players - 3 each, 2 to the skat, 4 ewch, then 3 each
    for (var vhidx of [0, 23]) {
        for (var idx = 0; idx < 3; idx++) {
            //const cardindex = vhidx + idx
            for (var cardindex = vhidx + idx; cardindex < vhidx + idx + 3; cardindex++) {
                appendCardToGameHoldings(holdings, players[idx],
                    SKATHOLDINGS.HAND, deck[cardindex])
            }
        }
    }
    for (var idx = 0; idx < 3; idx++) {
        //const cardindex = vhidx + idx
        for (var cardindex = 11 + idx; cardindex < 11 + idx + 4; cardindex++) {
            appendCardToGameHoldings(holdings, players[idx],
                SKATHOLDINGS.HAND, deck[cardindex])
        }
    }
    appendCardToGameHoldings(holdings, SKATSEATS.SPIEL, SKATHOLDINGS.SKAT, deck[9])
    appendCardToGameHoldings(holdings, SKATSEATS.SPIEL, SKATHOLDINGS.SKAT, deck[10])
    return holdings
}

const suitTrickPower:Map<SKATSUITS, number>  = new Map(
    [
        [SKATSUITS.NONE, -1],
        [SKATSUITS.KARO, 0],
        [SKATSUITS.HERZ, 1],
        [SKATSUITS.PIK, 2],
        [SKATSUITS.KREUZ, 3]
    ]
)

const cardPoints:Map<SKATRANKS,number> = new Map(
    [[
        SKATRANKS.ASS, 11
    ],
    [SKATRANKS.ZEHN, 10],
    [SKATRANKS.KONIG, 4],
    [SKATRANKS.DAME, 3],
        [SKATRANKS.NEUN, 0.3],
    [SKATRANKS.ACHT, 0.2],
    [SKATRANKS.SIEBEN, 0.1]]
)
/**
 * Trickpower of card in a suit contract
 * @param card
 */
function trickStrength(card: Card<SKATSUITS, SKATRANKS>, trumpSuit: SKATSUITS = SKATSUITS.NONE) {
    if (card.rank == SKATRANKS.BUBBE) {
        return 1000 + suitTrickPower.get(card.suit)
    } else if (card.suit == trumpSuit) {
        return 100 + cardPoints.get(card.rank)
    } else {
        return cardPoints.get(card.rank)
    }
}

/**
 * The `SKATFARBSPIEL` enum represents the different types of games that can be played in Skat.
 *
 * @enum {string}
 * @property {string} VANSTEGEN - Represents the Van Stegen game type.
 * @property {string} KINBACK - Represents the Kinback game type.
 * @property {string} SKATLINK - Represents the Skatlink game type.
 */
enum SKATFARBSPIEL {
    VANSTEGEN = 'Van Stegen',
    KINBACK = 'Kinback',
    SKATLINK = 'Skatlink'
}

/**
 * The `farbspiel` type represents the result of a game of Skat.
 * It contains the type of game played and the calculated score.
 *
 * @typedef {Object} farbspiel
 * @property {SKATFARBSPIEL} spiel - The type of game played.
 * @property {number} score - The calculated score for the game.
 */
type farbspiel = {
    spiel: SKATFARBSPIEL,
    score: number
}

/**
 * The `vanstegen` function calculates the score for a given set of cards in a game of Skat.
 * It uses the Van Stegen method to calculate the score.
 *
 * @param {Card<SKATSUITS, SKATRANKS>[]} cards - The set of cards to calculate the score for.
 * @param {boolean} isForehand - A boolean indicating if the player is forehand.
 * @param {SKATSUITS} [trumpSuit=SKATSUITS.NONE] - The suit that is currently trump. Defaults to NONE.
 *
 * @returns {farbspiel} An object containing the type of game (Van Stegen) and the calculated score.
 */
export function vanstegen(cards: Card<SKATSUITS, SKATRANKS>[], isForehand: boolean, trumpSuit:SKATSUITS = SKATSUITS.NONE): farbspiel {
    // Convert the set of cards to a map of suits to lists of cards
    const sortedHand: CardSuitListMap<SKATSUITS, SKATRANKS> = toCardSuitListMap(cards)

    // Filter out the jacks from the set of cards
    const bubben:Card<SKATSUITS, SKATRANKS>[] = cards.filter(
        c => { return (trickStrength(c, SKATSUITS.PIK) > 1000) }
    )

    // Filter out the aces and tens from the set of cards
    const vollen:Card<SKATSUITS, SKATRANKS>[] = cards.filter(
        c => {return (c.rank == SKATRANKS.ASS || c.rank == SKATRANKS.ZEHN)}
    )

    // Get the count of the longest suit, excluding jacks
    const maxSuitLength = [SKATSUITS.KREUZ, SKATSUITS.PIK, SKATSUITS.HERZ, SKATSUITS.KARO]
        .map(
            suit => {
                return cards.filter(
                    c => {
                        c.suit == SKATSUITS[suit] && c.rank !== SKATRANKS.BUBBE
                    }
                ).length
            }
        ).reduce((mxm, newLength) => {return Math.max(mxm, newLength)},0)

    // Calculate the score using the Van Stegen method
    const vs_score = 2 * (bubben.length) + (vollen.length) + maxSuitLength + (isForehand? 1 : 0)

    // Return the type of game and the calculated score
    return {spiel: SKATFARBSPIEL.VANSTEGEN, score: 0}
}