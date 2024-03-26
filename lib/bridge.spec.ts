import {Card} from './card'
import {
    BRIDGERANKS,
    BRIDGESUITS,
    displayHand,
    handSortedByPower,
    highCardPoints,
    loserCount,
    quickTricks,
    deal,
    SEATS,
    HOLDINGS
} from "./bridge";
import {v4 as uuidv4} from 'uuid';

function emptyHand(): Card<BRIDGESUITS, BRIDGERANKS>[] {
    return []
}

function ninePpointHand(): Card<BRIDGESUITS, BRIDGERANKS>[] {
    return [
        {
            id: uuidv4(),
            rank: BRIDGERANKS.ACE,
            suit: BRIDGESUITS.CLUB
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.KING,
            suit: BRIDGESUITS.CLUB
        },{
            id: uuidv4(),
            rank: BRIDGERANKS.QUEEN,
            suit: BRIDGESUITS.HEART
        },
    ]
}

function sampleFullHand(): Card<BRIDGESUITS, BRIDGERANKS>[] {
    return [
        {
            id: uuidv4(),
            rank: BRIDGERANKS.ACE,
            suit: BRIDGESUITS.CLUB
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.KING,
            suit: BRIDGESUITS.CLUB
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.JACK,
            suit: BRIDGESUITS.CLUB
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.TEN,
            suit: BRIDGESUITS.CLUB
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.QUEEN,
            suit: BRIDGESUITS.DIAMOND
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.ACE,
            suit: BRIDGESUITS.DIAMOND
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.SIX,
            suit: BRIDGESUITS.DIAMOND
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.TEN,
            suit: BRIDGESUITS.SPADE
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.NINE,
            suit: BRIDGESUITS.SPADE
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.SEVEN,
            suit: BRIDGESUITS.SPADE
        },
        {
            id: uuidv4(),
            rank: BRIDGERANKS.KING,
            suit: BRIDGESUITS.HEART
        },{
            id: uuidv4(),
            rank: BRIDGERANKS.QUEEN,
            suit: BRIDGESUITS.HEART
        },
    ]
}
describe ('bridge tests', () => {
    it ('goren points', () => {
        expect(highCardPoints(emptyHand())).toEqual(0)
        expect(highCardPoints(ninePpointHand())).toEqual(9)
    })
    it ('hand sorting', () => {
        const sortedHand = handSortedByPower(ninePpointHand())
        expect(sortedHand.get(BRIDGESUITS.CLUB).length).toEqual(2)
        expect(sortedHand.get(BRIDGESUITS.HEART).length).toEqual(1)
        expect(sortedHand.get(BRIDGESUITS.CLUB)[0].rank).toEqual(BRIDGERANKS.ACE)
        expect(sortedHand.get(BRIDGESUITS.CLUB)[1].rank).toEqual(BRIDGERANKS.KING)
    })
    it ('loser count', () => {
        const currentHand:Card<BRIDGESUITS, BRIDGERANKS>[] = sampleFullHand()
        expect(loserCount(currentHand)).toEqual(5)
    })
    it ('quick tricks', () => {
        console.log(quickTricks(sampleFullHand()))
        expect(quickTricks(sampleFullHand())).toBeGreaterThan(0)
        console.log(displayHand(sampleFullHand()))
    })
    it ('deal', () => {
        const firstHand = deal()
        var gorenPoints = 0
        for (var seat of [SEATS.EAST, SEATS.SOUTH, SEATS.WEST, SEATS.NORTH]) {
            var handLet = handSortedByPower(firstHand[seat][HOLDINGS.hands])
            var hcp = highCardPoints(firstHand[seat][HOLDINGS.hands])
            gorenPoints += highCardPoints(firstHand[seat][HOLDINGS.hands])
        }
        expect(gorenPoints).toEqual(40)
    })
})

describe ('bridge tests', () => {
    // ... existing tests ...

    it ('quick tricks calculation for empty hand', () => {
        const emptyHand = [];
        expect(quickTricks(emptyHand)).toEqual(0);
    });

    it ('quick tricks calculation for hand with no quick tricks', () => {
        const handWithoutQuickTricks = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.TWO,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.THREE,
                suit: BRIDGESUITS.HEART
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.FOUR,
                suit: BRIDGESUITS.DIAMOND
            },
        ];
        expect(quickTricks(handWithoutQuickTricks)).toEqual(0);
    });

    it ('quick tricks calculation for hand with quick tricks', () => {
        const handWithQuickTricks = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.ACE,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.KING,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.QUEEN,
                suit: BRIDGESUITS.HEART
            },
        ];
        expect(quickTricks(handWithQuickTricks)).toEqual(2);
    });

    it ('display hand for empty hand', () => {
        const emptyHand = [];
        expect(displayHand(emptyHand)).toEqual('...');
    });

    it ('display hand for full hand', () => {
        const fullHand = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.ACE,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.KING,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.QUEEN,
                suit: BRIDGESUITS.HEART
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.JACK,
                suit: BRIDGESUITS.SPADE
            },
        ];
        expect(displayHand(fullHand)).toEqual('J.Q..AK');
    });
});