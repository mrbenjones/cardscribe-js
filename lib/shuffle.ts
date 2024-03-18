import {Card} from "./card";

export function shuffle<S,T>(cards:Card<S,T>[]): Card<S,T>[] {
    const array = [...cards]
    let currentIndex:number = array.length,  randomIndex:number;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function deal<S,T>(deck: Card<S,T>, schema: number[]):Card<S,T>[][] {
    const index = 0

    return [[]]
}