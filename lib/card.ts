
export interface Card<S,T> {
    id: string,
    suit: S,
    rank: T
}

export type CardSuitMap<S,T> = Map<S,Set<Card<S,T>>>

export type CardSuitListMap<S,T> = Map<S,Card<S,T>[]>

export function appendCard<S,T>(map:CardSuitMap<S,T>, card:Card<S,T>): CardSuitMap<S,T>{
    if (!map.has(card.suit)) {
        map.set(card.suit, new Set<Card<S,T>>())
    }
    map.get(card.suit).add(card)
    return map
}

export function appendCardToList<S,T>(map:CardSuitListMap<S,T>, card:Card<S,T>): CardSuitListMap<S,T>{
    if (!map.has(card.suit)) {
        map.set(card.suit, [])
    }
    map.get(card.suit).push(card)
    return map
}

export function toCardSuitMap<S,T>(cards: Card<S,T>[]):CardSuitMap<S, T> {
    return cards.reduce(
        (m, c) => {
            return appendCard(m, c)
        }
        , new Map<S,Set<Card<S,T>>>()
    );
}

export function toCardSuitListMap<S,T>(cards: Card<S,T>[]):CardSuitListMap<S, T> {
    return cards.reduce(
        (m, c) => {
            return appendCardToList(m, c)
        }
        , new Map<S,Card<S,T>[]>()
    );
}

