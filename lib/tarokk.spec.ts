import {tarokkDeck, trickPower} from './tarokk'
import {Card} from './card'
describe ('test index file', () => {

    it ('tarokk deck', () => {
        const deck = tarokkDeck()
        console.log(JSON.stringify(deck, null, 4))
        expect(deck.length).toEqual(42)
        deck.forEach(
            d => {
                expect(trickPower(d)).toBeGreaterThan(0)
            }
        )
    })
})