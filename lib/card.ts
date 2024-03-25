
export interface Card<S,T> {
    id: string,
    suit: S,
    rank: T
}

/**
 * Given a suit enum S and a rank enum T, this type represents a mapping for a sorted hand,
 * taking each suit to a set of the cards of that suit.
 */
export type CardSuitMap<S,T> = Map<S,Set<Card<S,T>>>

/**
 * Type representing a map to a list of cards (to use for ordered representations, such as sorted bridge hands).
 */
export type CardSuitListMap<S,T> = Map<S,Card<S,T>[]>

/**
 * Type alias for game holdings (hands, stock) : a mapping from players to holding names (usually just the hand)
 * to stacks of cards.
 */
export type GameHoldings<S,T,P,Q> = Map<P, Map<Q,Card<S,T>[]>>

/**
 * Type alias for e.g. trick piles from games.
 */
export type GamePiles<S,T,P,Q> = Map<P, Map<Q,Card<S,T>[][]>>

/**
 * Type alias to keep track of scores.
 */
export type GameScores<S,T,P,Q> = Map<P, Map<Q,number>>

/**
 * State parametrized by Suit (S), Rank (T), Player role (P), and
 * title (Q)
 */
export type GameState<S,T,P,Q> = {
    holdings: GameHoldings<S, T, P, Q>,
    piles: GamePiles<S,T, P, Q>,
    scores: GameScores<S, T, P, Q>
}

export function emptyGameHoldings<S,T,P,Q>(): GameHoldings<S, T, P, Q> {
    return new Map<P, Map<Q,Card<S,T>[]>>()
}/**
 * Append card to game holdings, creating empty spaces if necessary.
 * @param holdings
 * @param seat
 * @param holding
 * @param card
 */
export function appendCardToGameHoldings<S,T,P,Q>(holdings: GameHoldings<S,T,P,Q>,
                                                  seat: P,
                                                  holding: Q,
                                                  card: Card<S,T>) {
    const seatHoldings = holdings.get(seat) || new Map<Q,Card<S,T>[]>();
    const cards = seatHoldings.get(holding) || [];
    cards.push(card);
    seatHoldings.set(holding, cards);
    holdings.set(seat, seatHoldings);
}

/**
 * Appends a card to a CardSuitMap.
 *
 * @param {CardSuitMap<S,T>} map - The CardSuitMap to which the card will be appended.
 * @param {Card<S,T>} card - The card to be appended to the CardSuitMap.
 * @returns {CardSuitMap<S,T>} - The updated CardSuitMap after appending the card.
 */
export function appendCard<S,T>(map:CardSuitMap<S,T>, card:Card<S,T>): CardSuitMap<S,T>{
    const cardSet = map.get(card.suit) || new Set<Card<S,T>>();
    cardSet.add(card);
    map.set(card.suit, cardSet);
    return map;
}

/**
 * Appends a card to a CardSuitListMap.
 *
 * @param {CardSuitListMap<S,T>} map - The CardSuitListMap to which the card will be appended.
 * @param {Card<S,T>} card - The card to be appended to the CardSuitListMap.
 * @returns {CardSuitListMap<S,T>} - The updated CardSuitListMap after appending the card.
 */
export function appendCardToList<S,T>(map:CardSuitListMap<S,T>, card:Card<S,T>): CardSuitListMap<S,T>{
    const cardList = map.get(card.suit) || [];
    cardList.push(card);
    map.set(card.suit, cardList);
    return map;
}
/**
 * Converts an array of cards into a CardSuitMap.
 *
 * @param {Card<S,T>[]} cards - The array of cards to be converted.
 * @returns {CardSuitMap<S,T>} - The CardSuitMap created from the array of cards.
 */
export function toCardSuitMap<S,T>(cards: Card<S,T>[]):CardSuitMap<S, T> {
    return cards.reduce(appendCard, new Map<S,Set<Card<S,T>>>());
}
/**
 * Converts an array of cards into a CardSuitListMap.
 *
 * @param {Card<S,T>[]} cards - The array of cards to be converted.
 * @returns {CardSuitListMap<S,T>} - The CardSuitListMap created from the array of cards.
 */
export function toCardSuitListMap<S,T>(cards: Card<S,T>[]):CardSuitListMap<S, T> {
    return cards.reduce(appendCardToList, new Map<S,Card<S,T>[]>());
}

