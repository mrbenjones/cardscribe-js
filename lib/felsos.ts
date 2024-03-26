import {germanDeck, GERMANSUITS} from "./german32";
import {shuffle} from "./shuffle";

/**
 * Define game roles;
 */
/**
 * Enum representing the roles in the game.
 * @enum {string}
 */
enum roles {
    /**
     * Represents the dealer role in the game.
     * The dealer is the player who distributes the cards to the other players.
     */
    DEALER = 'DEALER',

    /**
     * Represents the forehand role in the game.
     * The forehand is the player who plays the first card in a round.
     */
    FOREHAND = 'FOREHAND',

    /**
     * Represents the game role.
     * These are identified with card piles, e.g. the talon, that are hidden from all human players.
     */
    GAME = 'GAME'
}
/**
 * Enum representing the locations of the cards in the game.
 * @enum {string}
 */
enum cardLocations {
    /**
     * Represents the hand location in the game.
     * The hand is where the player holds their playable cards.
     */
    HAND = 'HAND',

    /**
     * Represents the tricks location in the game.
     * Tricks are the cards that a player has won in a round.
     */
    TRICKS = 'TRICKS',

    /**
     * Represents the trump location in the game.
     * The trump is a card that has been designated to have the highest rank in the game.
     */
    TRUMP = 'TRUMP',

    /**
     * Represents the stock location in the game.
     * The stock is the pile of cards that are not yet in play.
     */
    STOCK = 'STOCK'
}
enum scopes {
    GAME = 'GAME',
    MATCH = 'MATCH'
}


