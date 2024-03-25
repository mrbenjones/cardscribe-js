import {GameHoldings} from './card'
import {deal, SKATHOLDINGS, SKATRANKS, SKATSEATS, SKATSUITS} from "./skat";

describe('skat deal and points', () => {
    it('skat hand size and distribution', () => {
        const skatDeal:GameHoldings<SKATSUITS, SKATRANKS, SKATSEATS, SKATHOLDINGS> = deal()
        expect(skatDeal.get(SKATSEATS.VORHAND).get(SKATHOLDINGS.HAND).length).toEqual(10)
        expect(skatDeal.get(SKATSEATS.MITTELHAND).get(SKATHOLDINGS.HAND).length).toEqual(10)
        expect(skatDeal.get(SKATSEATS.BACKHAND).get(SKATHOLDINGS.HAND).length).toEqual(10)
        expect(skatDeal.get(SKATSEATS.SPIEL).get(SKATHOLDINGS.SKAT).length).toEqual(2)
    })
})