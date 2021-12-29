import MarketRule from "@msf/msf-charts-helper/dist/market/rules";

interface IMarket {
	hour_aligned: boolean;
	rules: Array<MarketRule>;
	market_tz: string;
	name: string;
}

let marketRules: IMarket;

export function fetchMarketRules(
	exchange: string
): Promise<void | Array<MarketRule>> {
	if (marketRules) {
		return Promise.resolve(marketRules.rules);
	} else {
		return fetch("./marketRules.json")
			.then((res: Response) => res.json())
			.then((jsonResponse: any) => {
				if (exchange in jsonResponse) {
					marketRules = jsonResponse[exchange];
					return marketRules.rules;
				} else {
					throw new Error("Unknown exchange");
				}
			})
			.catch((err) => Promise.reject(err));
	}
}
