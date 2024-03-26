import {v4 as uuidv4} from 'uuid';
import {Card, CardSuitListMap, CardSuitMap, GameHoldings, toCardSuitListMap, toCardSuitMap} from './card'
import {shuffle} from './shuffle'
export enum BRIDGESUITS {
    HEART = 'H',
    CLUB = 'C',
    DIAMOND = 'D',
    SPADE = 'S'
}

/**
 * Enum representing the ranks in a deck of bridge cards.
 * @enum {string}
 * @readonly
 */
export enum BRIDGERANKS {
    /** Represents the Ace rank, which is the highest rank. */
    ACE = 'A',
    /** Represents the King rank. */
    KING = 'K',
    /** Represents the Queen rank. */
    QUEEN = 'Q',
    /** Represents the Jack rank. */
    JACK = 'J',
    /** Represents the Ten rank. */
    TEN = 'T',
    /** Represents the Nine rank. */
    NINE = '9',
    /** Represents the Eight rank. */
    EIGHT = '8',
    /** Represents the Seven rank. */
    SEVEN = '7',
    /** Represents the Six rank. */
    SIX = '6',
    /** Represents the Five rank. */
    FIVE = '5',
    /** Represents the Four rank. */
    FOUR = '4',
    /** Represents the Three rank. */
    THREE = '3',
    /** Represents the Two rank, which is the lowest rank. */
    TWO = '2'
}

export enum SEATS {
    NORTH = 'North',
    EAST = 'East',
    SOUTH = 'South',
    WEST = 'West'
}

// Define the strength of each card rank
const trickStrength = {
  [BRIDGERANKS.ACE]: 13,
  [BRIDGERANKS.KING]: 12,
  [BRIDGERANKS.QUEEN]: 11,
  [BRIDGERANKS.JACK]: 10,
  [BRIDGERANKS.TEN]: 9,
  [BRIDGERANKS.NINE]: 8,
  [BRIDGERANKS.EIGHT]: 7,
  [BRIDGERANKS.SEVEN]: 6,
  [BRIDGERANKS.SIX]: 5,
  [BRIDGERANKS.FIVE]: 4,
  [BRIDGERANKS.FOUR]: 3,
  [BRIDGERANKS.THREE]: 2,
  [BRIDGERANKS.TWO]: 1
};

// Define the points for each card rank
const gorenPoints = {
  [BRIDGERANKS.ACE]: 4,
  [BRIDGERANKS.KING]: 3,
  [BRIDGERANKS.QUEEN]: 2,
  [BRIDGERANKS.JACK]: 1
};

// Function to calculate the total points of a hand
export function highCardPoints(hand: Card<BRIDGESUITS, BRIDGERANKS>[]): number {
  return hand.reduce((s, t) => s + (gorenPoints[t.rank] || 0), 0);
}
/**
 * Sorts a hand of bridge cards by suit and trick strength.
 *
 * This function takes an array of cards and returns a map where the keys are the suits and the values are arrays of cards.
 * Each array of cards is sorted in descending order by trick strength, meaning the first card in the array is the most powerful card of that suit.
 *
 * This is useful when a particular suit is led in a game of bridge, as the first card in the array for that suit is the most powerful card the player holds in that suit.
 *
 * @param {Card<BRIDGESUITS, BRIDGERANKS>[]} hand - The hand of bridge cards to sort.
 * @returns {CardSuitListMap<BRIDGESUITS, BRIDGERANKS>} A map of suits to arrays of cards, sorted by trick strength.
 */
 export function handSortedByPower(hand: Card<BRIDGESUITS, BRIDGERANKS>[]):CardSuitListMap<BRIDGESUITS, BRIDGERANKS> {
    const cardListMap = toCardSuitListMap(hand)
    for (const suitName in BRIDGESUITS){
        const cardList = cardListMap[BRIDGESUITS[suitName]] || []
        cardList.sort((s, t) =>
            (trickStrength[t.rank] - trickStrength[s.rank]))
        cardListMap[BRIDGESUITS[suitName]] = cardList
    }
    return cardListMap
}

/**
 * Generator function that creates a deck of bridge cards.
 *
 * This function uses the `yield` keyword to create a new card for each suit and rank combination.
 * Each card is an object with a unique ID, a rank, and a suit.
 *
 * @generator
 * @yields {Object} A card object with a unique ID, a rank, and a suit.
 */
function* bridgeDeckGenerator() {
    for (const suit in BRIDGESUITS) {
        for (const rank in BRIDGERANKS) {
            yield {
                id: uuidv4(),
                rank: BRIDGERANKS[rank],
                suit: BRIDGESUITS[suit]
            }
        }
    }
}

/**
 * Calculates the number of losers in a hand of bridge cards.
 * A loser is defined as a card that is not an Ace, King, Queen, or Jack.
 *
 * @param {Card<BRIDGESUITS, BRIDGERANKS>[]} hand - The hand of bridge cards.
 * @returns {number} The number of losers in the hand.
 */
export function loserCount(hand: Card<BRIDGESUITS, BRIDGERANKS>[]): number {
    // Sort the hand by the power of the cards
    const powerHand = handSortedByPower(hand)
    var loserCount:number = 0
    // Iterate over each suit
    for (const suitName in BRIDGESUITS) {
        // Count the number of losers in the suit
        loserCount += (powerHand.get(BRIDGESUITS[suitName]) || []).slice(0,3).filter(
            c => trickStrength[c.rank] < 11
        ).length
    }
    return loserCount
}
/**
 * Enum representing the different types of holdings in a game of bridge.
 * @enum {string}
 * @readonly
 */
export enum HOLDINGS {
    /** Represents the cards a player holds in their hand. */
    hands,
    /** Represents the tricks a player has won. */
    tricks
}


/**
 * Array representing the seating order in a game of bridge.
 * The order starts from the South and goes clockwise to West, North, and East.
 * @type {SEATS[]}
 */
const BRIDGESEATS = [SEATS.SOUTH, SEATS.WEST, SEATS.NORTH, SEATS.EAST]

/**
 * Function to generate the initial holdings for a game of bridge.
 *
 * This function creates a new map where the keys are the seats and the values are maps.
 * Each inner map has the key 'hands', representing the cards a player holds in their hand.
 * Initially, each player's hand is empty.
 *
 * @returns {GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS>} The initial holdings for a game of bridge.
 */
function generateHoldings():GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> {

    const holdings:GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> = new Map<SEATS, Map<HOLDINGS, Card<BRIDGESUITS, BRIDGERANKS>[]>>()
    for (const seat of BRIDGESEATS) {
        const seatMap = new Map<HOLDINGS, Card<BRIDGESUITS, BRIDGERANKS>> ()
        seatMap[HOLDINGS.hands] = []
        holdings[seat] = seatMap
    }
    return holdings
}
/**
 * Function to deal a game of bridge.
 *
 * This function creates a shuffled deck of bridge cards and distributes them to the players in a round-robin fashion.
 * The dealer is determined by the `dealerSeat` parameter, which defaults to 0 (South).
 * The function returns a map where the keys are the seats and the values are maps.
 * Each inner map has the key 'hands', representing the cards a player holds in their hand.
 *
 * @param {number} dealerSeat - The seat of the dealer. Defaults to 0 (South).
 * @returns {GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS>} The holdings for a game of bridge after dealing.
 */
export function deal(dealerSeat = 0): GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> {
    const deck = shuffle([...bridgeDeckGenerator()]);
    const holdings = generateHoldings();

    for (let i = 0; i < 13; i++) {
        for (let seatN = 0; seatN < 4; seatN++) {
            const seat = BRIDGESEATS[(seatN + dealerSeat) % 4];
            holdings[seat][HOLDINGS.hands].push(deck[i + seatN * 13]);
        }
    }

    return holdings;
}
/**
 * Function to calculate the number of quick tricks in a suit.
 *
 * Quick tricks are defined as certain combinations of high-ranking cards (Ace, King, Queen) in a suit.
 * Specifically, an Ace and a King in the same suit count as 2 quick tricks, an Ace and a Queen count as 1.5 quick tricks,
 * and a King with at least one other card counts as 0.5 quick tricks.
 *
 * This function takes a set of cards of the same suit and returns the number of quick tricks in the suit.
 *
 * @param {Set<Card<BRIDGESUITS, BRIDGERANKS>>} suit - The set of cards of the same suit.
 * @returns {number} The number of quick tricks in the suit.
 */
function quickTricksInSuit(suit: Set<Card<BRIDGESUITS, BRIDGERANKS>>): number {
    const suitRanking = new Set([...suit.values()].map(card => card.rank));

    if (suitRanking.has(BRIDGERANKS.ACE) && suitRanking.has(BRIDGERANKS.KING)) return 2;
    if (suitRanking.has(BRIDGERANKS.ACE) && suitRanking.has(BRIDGERANKS.QUEEN)) return 1.5;
    if (suitRanking.has(BRIDGERANKS.KING) && suitRanking.size > 1) return 0.5;
    return 0;
}

/**
 * Function to calculate the total number of quick tricks in a hand of bridge cards.
 *
 * Quick tricks are defined as certain combinations of high-ranking cards (Ace, King, Queen) in a suit.
 * Specifically, an Ace and a King in the same suit count as 2 quick tricks, an Ace and a Queen count as 1.5 quick tricks,
 * and a King with at least one other card counts as 0.5 quick tricks.
 *
 * This function takes an array of cards (a hand) and calculates the total number of quick tricks in the hand.
 * It does this by sorting the hand into suits using the `toCardSuitMap` function, then calculating the number of quick tricks in each suit using the `quickTricksInSuit` function.
 *
 * @param {Card<BRIDGESUITS, BRIDGERANKS>[]} hand - The hand of bridge cards.
 * @returns {number} The total number of quick tricks in the hand.
 */
export function quickTricks(hand:Card<BRIDGESUITS, BRIDGERANKS>[]):number {
    const sortedHand = toCardSuitMap(hand)
    var quickTricks = 0
    sortedHand.forEach(
        suit => {
            quickTricks += quickTricksInSuit(suit || new Set())
        }
    )
    return quickTricks
}

/**
 * Function to convert a suit of cards into a string representation.
 *
 * This function takes an array of cards of the same suit and returns a string representation of the suit.
 * If the suit is empty (i.e., the array is empty), the function returns a dash ('-').
 * Otherwise, the function returns a string of the ranks of the cards in the suit, joined together without spaces.
 *
 * @param {Card<BRIDGESUITS, BRIDGERANKS>[]} suit - The array of cards of the same suit.
 * @returns {string} A string representation of the suit.
 */
function suitString(suit: Card<BRIDGESUITS, BRIDGERANKS>[]) {
    if (suit.length == 0 ) {
        return ''
    } else {
        return suit.map(c => c.rank)
            .join('')
    }
}

/**
 * Show ranks of suits or a dash for a void suit down the line.
 * @param hand : the cards of the hand
 */
export function displayHand(hand: Card<BRIDGESUITS, BRIDGERANKS>[]): string {
    const suitedHand = handSortedByPower(hand)
    var description = ''
    const handOrder = [BRIDGESUITS.SPADE, BRIDGESUITS.HEART, BRIDGESUITS.DIAMOND, BRIDGESUITS.CLUB]
    return handOrder.map(s => suitString(suitedHand.get(s) || [])).join('.')
}



