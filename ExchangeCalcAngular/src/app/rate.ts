// {
//     "USD_PHP": 52.103504,
//     "PHP_USD": 0.019193
// }
export interface Rate {
    // from_to: number;
    // to_from: number;

    success : boolean,
    timestamp: string,
    base: string,
    date: string,
    rates: {
        fromRate : number,
        toRate : number
    }
}
