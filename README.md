# cardscribe-js
Library to record states, events,  and narratives in card and tile games

# General Approach
A stack of cards is a list of objects with the attributes `rank`, `id`, and `suit`. Nothing will stop 
a developer from adding additional ranks or suits on the fly but certain functions will define a **deck**, which is 
the stack of cards that a game starts from - the maximal set of cards. 

## Common Card Game Attributes
* `deck()` generates the deck of card (no arg), and returns a deck with the elements validated (passed an array).
For example, to generate a standard 48 card pinochle deck, you might produce the following generator: 
```javascript
function* pinochleDeckGenerator() {
    enum PINOCHLESUITS {
        HEART = 'H',
        CLUB = 'C',
        DIAMOND = 'D',
        SPADE = 'S'
    }
    enum PINOCHLERANKS {
        NINE = '9',
        JACK = 'J',
        QUEEN = 'Q',
        KING = 'K',
        TEN = 'T',
        ACE = 'A'
    }
    const suits:string[] = ['HEART', 'CLUB', 'DIAMOND', 'SPADE']
    const ranks:string[] = ['NINE', 'JACK', '']
    for (copy in [1,2]) {
        for (const suit in suits) {
            for (const rank in ranks) {
                yield {
                    id: uuid(),
                    rank: rank,
                    suit: suit
                }
            }
        }
    }
}

function deck() {
    return [c for c in pinochleDeckGenerator()]
}
```

# AUTHOR
Benjamin Jones (github: mrbenjones)
