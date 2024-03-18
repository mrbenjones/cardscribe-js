import {Card} from './card'
import {toRoman} from 'roman-numerals'
import {v4 as uuidv4} from 'uuid';
enum tarokkSuits {
    HEARTS = "H",
    SPADES = "S",
    CLUBS = "C",
    DIAMONDS = "D",
    TAROKKS = "T"
}

enum suitRanks {
    ACE = 'A',
    TEN = 'T',
    JACK = 'J',
    RIDER = 'R',
    QUEEN = 'Q',
    KING = 'K'
}


function rankString(rankKey: number):string {
    if (rankKey < 22) {
        return toRoman(rankKey + 1)
    } else {
        return 'SKIZ'
    }
}
function keyForRankAndSuit(rank:string, suit:string) : string {
    return `${rank.length}${rank}::${suit.length}${suit}`
}
function cardKey(card:Card): string {
    return keyForRankAndSuit(card.rank, card.suit)
}
const faces:string[] = [suitRanks.JACK, suitRanks.RIDER, suitRanks.QUEEN, suitRanks.KING]
const redOrder:string[] = [...[suitRanks.ACE], ...faces]
const blackOrder:string[] = [...[suitRanks.TEN], ...faces]
const redSuits:string[] = [tarokkSuits.DIAMONDS, tarokkSuits.HEARTS]
const blackSuits:string[] = [tarokkSuits.CLUBS, tarokkSuits.SPADES]

export function trickPower(card: Card): number {
    const trickStrengthMap:Map<string, number>  = new Map<string,number>()
    if (trickStrengthMap.size == 0) {
        // prime tarokks
        for (const rank of Array(22).keys()) {
            trickStrengthMap.set(keyForRankAndSuit(rankString(rank +1), tarokkSuits.TAROKKS), rank + 1)
        }
        //prime suits

        // red suits
        for (const suitName of redSuits) {
            for (var i = 0; i < redOrder.length; i++) {
                trickStrengthMap.set(keyForRankAndSuit(redOrder[i], suitName), i+1)
            }
        }
        // black suits
        for (const suitName of blackSuits) {
            for (var i = 0; i < blackOrder.length; i++) {
                trickStrengthMap.set(keyForRankAndSuit(blackOrder[i], suitName), i+1)
            }
        }
    }
    const keyString:string = cardKey(card)
    return trickStrengthMap.get(keyString)
}

function * tarokkDeckGenerator(){
    for (const rankName of faces) {
        for (const suitName of [...redSuits, ...blackSuits]) {
            yield {
                id: uuidv4(),
                rank: rankName,
                suit: suitName
            }
        }
    }
    for (const suitName of blackSuits) {
        yield {
            id: uuidv4(),
            rank: suitRanks.TEN,
            suit: suitName
        }
    }
    for (const suitName of redSuits) {
        yield {
            id: uuidv4(),
            rank: suitRanks.ACE,
            suit: suitName
        }
    }
    for (const rank of  Array(22).keys()) {
        yield {
            id: uuidv4(),
            rank: rankString(rank + 1),
            suit: tarokkSuits.TAROKKS
        }
    }
}

export function tarokkDeck():Card[] {
    return [...tarokkDeckGenerator()]
}