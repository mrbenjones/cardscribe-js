import {v4 as uuidv4} from 'uuid';
import {Card, CardSuitListMap, CardSuitMap, GameHoldings, toCardSuitListMap, toCardSuitMap} from './card'
import {shuffle} from './shuffle'
import {deck, PINOCHLERANKS, PINOCHLESUITS} from "./pinochleDeck";
export enum BRIDGESUITS {
    HEART = 'H',
    CLUB = 'C',
    DIAMOND = 'D',
    SPADE = 'S'
}

export enum BRIDGERANKS {
    ACE = 'A',
    KING = 'K',
    QUEEN = 'Q',
    JACK = 'J',
    TEN = 'T',
    NINE = '9',
    EIGHT = '8',
    SEVEN = '7',
    SIX = '6',
    FIVE = '5',
    FOUR = '4',
    THREE = '3',
    TWO = '2'
}

export enum SEATS {
    NORTH = 'North',
    EAST = 'East',
    SOUTH = 'South',
    WEST = 'West'
}


const trickStrength: Map<BRIDGERANKS, number> = new Map(
    [[BRIDGERANKS.ACE, 13],
            [BRIDGERANKS.KING, 12],
        [BRIDGERANKS.QUEEN, 11],
        [BRIDGERANKS.JACK, 10],
        [BRIDGERANKS.TEN, 9],
        [BRIDGERANKS.NINE, 8],
        [BRIDGERANKS.EIGHT, 7],
        [BRIDGERANKS.SEVEN, 6],
        [BRIDGERANKS.SIX, 5],
        [BRIDGERANKS.FIVE, 4],
        [BRIDGERANKS.FOUR, 3],
        [BRIDGERANKS.THREE, 2],
        [BRIDGERANKS.TWO, 1]]
)

const gorenPoints: Map<BRIDGERANKS, number> = new Map(
    [[BRIDGERANKS.ACE, 4],
    [BRIDGERANKS.KING, 3],
    [BRIDGERANKS.QUEEN, 2],
    [BRIDGERANKS.JACK, 1]]
)

export function highCardPoints(hand: Card<BRIDGESUITS, BRIDGERANKS>[]): number {
    return hand.reduce(
        (s, t) =>
            s + (gorenPoints.get(t.rank) || 0)
        ,0
    )
}

export function handSortedByPower(hand: Card<BRIDGESUITS, BRIDGERANKS>[]):CardSuitListMap<BRIDGESUITS, BRIDGERANKS> {
    const cardListMap = toCardSuitListMap(hand)
    for (const suitName in BRIDGESUITS){
        const cardList = cardListMap.get(BRIDGESUITS[suitName]) || []
        cardList.sort((s, t) =>
            (trickStrength.get(t.rank) - trickStrength.get(s.rank)))
        cardListMap.set(BRIDGESUITS[suitName], cardList)
    }
    return cardListMap
}

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
export function loserCount(hand: Card<BRIDGESUITS, BRIDGERANKS>[]): number {
    const powerHand = handSortedByPower(hand)
    var loserCount:number = 0
    for (const suitName in BRIDGESUITS) {
        loserCount += powerHand.get(BRIDGESUITS[suitName]).slice(0,3).filter(
            c => trickStrength.get(c.rank) < 11
        ).length
    }
    return loserCount
}

export enum HOLDINGS {
    hands
}
const BRIDGESEATS = [SEATS.SOUTH, SEATS.WEST, SEATS.NORTH, SEATS.EAST]
function generateHoldings():GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> {
    const holdings:GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> = new Map<SEATS, Map<HOLDINGS, Card<BRIDGESUITS, BRIDGERANKS>[]>>()
    for (const seat of BRIDGESEATS) {
        const seatMap = new Map<HOLDINGS, Card<BRIDGESUITS, BRIDGERANKS>> ()
        seatMap[HOLDINGS.hands] = []
        holdings[seat] = seatMap
    }
    return holdings
}

export function deal(dealerSeat = 0):GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> {
    const deck:Card<BRIDGESUITS, BRIDGERANKS>[] = shuffle([...bridgeDeckGenerator()])
    const holdings:GameHoldings<BRIDGESUITS, BRIDGERANKS, SEATS, HOLDINGS> = generateHoldings()
        for (var i =0; i < 13; i++) {
            for (var seatN =0; seatN < 4; seatN++) {
                holdings[BRIDGESEATS[(seatN + dealerSeat) % 4]][HOLDINGS.hands]
                    .push(deck[i + seatN * 13])
            }
        }
        return holdings
}


/**
 * Internal function to count quick tricks in a given suit in a holding.
 * @param suit
 */
function quickTricksInSuit(suit: Set<Card<BRIDGESUITS, BRIDGERANKS>>):number {
    const suitRanking = new Set<BRIDGERANKS>()
    suit.forEach(
        c => {
            suitRanking.add(c.rank)
        }
    )
    // AK 2 tricks
    if (suitRanking.has(BRIDGERANKS.ACE) && suitRanking.has(BRIDGERANKS.KING)) {
        return 2
    } else if (suitRanking.has(BRIDGERANKS.ACE) && suitRanking.has(BRIDGERANKS.QUEEN)) {
        return 1.5
    } else if (suitRanking.has(BRIDGERANKS.KING) && suitRanking.has(BRIDGERANKS.KING)) {
        return 1
    } else if (suitRanking.has(BRIDGERANKS.KING) && suitRanking.size > 1) {
        return 0.5
    } else {
        return 0
    }
}

export function  quickTricks(hand:Card<BRIDGESUITS, BRIDGERANKS>[]):number {
    const sortedHand = toCardSuitMap(hand)
    var quickTricks = 0
    sortedHand.forEach(
        suit => {
            quickTricks += quickTricksInSuit(suit || new Set())
        }
    )
    return quickTricks
}

function suitString(suit: Card<BRIDGESUITS, BRIDGERANKS>[]) {
    if (suit.length == 0 ) {
        return '-'
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
    for (const suit of [BRIDGESUITS.SPADE, BRIDGESUITS.HEART, BRIDGESUITS.DIAMOND, BRIDGESUITS.CLUB]) {
        description += suitString(suitedHand.get(suit) || []) + '|'
    }
    return description
}



