import {BRIDGERANKS, BRIDGESUITS} from "./bridge";
import {Card, toCardSuitListMap} from "./card";
import {v4 as uuidv4} from 'uuid';

describe('toCardSuitListMap tests', () => {
    it('should return an empty CardSuitListMap when given an empty array', () => {
        const cards: Card<BRIDGESUITS, BRIDGERANKS>[] = [];
        const result = toCardSuitListMap(cards);
        expect(result.size).toEqual(0);
    });

    it('should return a CardSuitListMap with one entry when given an array with one card', () => {
        const cards: Card<BRIDGESUITS, BRIDGERANKS>[] = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.ACE,
                suit: BRIDGESUITS.CLUB
            }
        ];
        const result = toCardSuitListMap(cards);
        expect(result.size).toEqual(1);
        expect(result.get(BRIDGESUITS.CLUB).length).toEqual(1);
    });

    it('should return a CardSuitListMap with multiple entries when given an array with multiple cards of different suits', () => {
        const cards: Card<BRIDGESUITS, BRIDGERANKS>[] = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.ACE,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.KING,
                suit: BRIDGESUITS.HEART
            }
        ];
        const result = toCardSuitListMap(cards);
        expect(result.size).toEqual(2);
        expect(result.get(BRIDGESUITS.CLUB).length).toEqual(1);
        expect(result.get(BRIDGESUITS.HEART).length).toEqual(1);
    });

    it('should return a CardSuitListMap with one entry and multiple cards when given an array with multiple cards of the same suit', () => {
        const cards: Card<BRIDGESUITS, BRIDGERANKS>[] = [
            {
                id: uuidv4(),
                rank: BRIDGERANKS.ACE,
                suit: BRIDGESUITS.CLUB
            },
            {
                id: uuidv4(),
                rank: BRIDGERANKS.KING,
                suit: BRIDGESUITS.CLUB
            }
        ];
        const result = toCardSuitListMap(cards);
        expect(result.size).toEqual(1);
        expect(result.get(BRIDGESUITS.CLUB).length).toEqual(2);
    })});