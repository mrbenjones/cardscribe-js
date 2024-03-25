import {deck, PINOCHLESUITS, PINOCHLERANKS} from './pinochleDeck'
import {Card} from './card'
describe ('test index file', () => {
    it ('tests', () => {
        var stack:Card<PINOCHLESUITS,PINOCHLERANKS>[] = deck()
        console.log(JSON.stringify(stack))
        expect(stack.length).toEqual(48)
    })
})