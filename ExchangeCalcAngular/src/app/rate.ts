// {
//     "USD_PHP": 52.103504,
//     "PHP_USD": 0.019193
// }
export interface Rate {
    // from_to: number;
    // to_from: number;

    // success : boolean,
    // timestamp: string,
    // base: string,
    // date: string,
    // rates: {
    //     fromRate : number,
    //     toRate : number
    // }

    "query": {
        "count": number;
    },
    "results": {
        "USD_PHP": {
            "id":string,    //"USD_PHP",
            "val":number,     //52.015498,
            "to":string,    //"PHP",
            "fr":string    //"USD"
        },
        "PHP_USD": {
            "id": string, //"PHP_USD",
            "val": number, //0.019225,
            "to": string, //"USD",
            "fr": string //"PHP"
        }
    }

}
