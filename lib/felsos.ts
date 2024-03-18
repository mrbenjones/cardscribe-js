import {germanDeck, GERMANSUITS} from "./german32";
import {shuffle} from "./shuffle";

/**
 * Define game roles;
 */
enum roles {
    DEALER = 'DEALER',
    FOREHAND = 'FOREHAND',
    GAME = 'GAME'
}

enum cardLocations {
    HAND = 'HAND',
    TRICKS = 'TRICKS',
    TRUMP = 'TRUMP',
    STOCK = 'STOCK'
}

enum scopes {
    GAME = 'GAME',
    MATCH = 'MATCH'
}


