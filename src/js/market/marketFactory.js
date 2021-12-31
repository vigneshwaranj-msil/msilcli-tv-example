let marketRules;
export function fetchMarketRules(exchange) {
    if (marketRules) {
        return Promise.resolve(marketRules.rules);
    }
    else {
        return fetch("./marketRules.json")
            .then((res) => res.json())
            .then((jsonResponse) => {
            if (exchange in jsonResponse) {
                marketRules = jsonResponse[exchange];
                return marketRules.rules;
            }
            else {
                throw new Error("Unknown exchange");
            }
        })
            .catch((err) => Promise.reject(err));
    }
}
