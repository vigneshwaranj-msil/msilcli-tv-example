import { Candle } from "@msf/msf-charts-helper/dist/feeds/utils";
import { convertCandleToTradingViewCandle } from "@msf/msf-charts-helper/dist/utils/trading-view";
import BaseAPIManager from "./baseApiManager";
import { CustomHistoryCallback } from "./tv-dataManager";

export default class APIManager extends BaseAPIManager {
	checkForRealTimeCandlesUpdate(cb: Function): Function {
		return (candle: Candle) => cb(convertCandleToTradingViewCandle(candle));
	}
	onSuccessResponseFromAPI(
		callback: CustomHistoryCallback,
		jsonResponse: any
	): void {
		if (jsonResponse && jsonResponse.data) {
			callback(
				this.__formatChartData(jsonResponse.data).map((candle: Candle) => convertCandleToTradingViewCandle(candle))
			)
		} else {
			this.onFailureResponse(jsonResponse.msg, callback);
		}
	}
	onFailureResponse(error: any, callback: CustomHistoryCallback): void {
		console.error(error)
		callback([]);
	}
	protected __formatChartData(jsonResponse: any): Candle[] {
		return (jsonResponse || [])
			.map((responseCandle: any): Candle => {
				return {
					date: new Date(responseCandle.date),
					open: parseFloat(responseCandle.open),
					close: parseFloat(responseCandle.close),
					high: parseFloat(responseCandle.high),
					low: parseFloat(responseCandle.low),
					volume: parseFloat(responseCandle.volume)
				}
			})
			.filter(
				(candle: Candle) =>
					!!candle.date &&
					!!candle.close &&
					!!candle.open &&
					!!candle.low &&
					!!candle.high
			)
			.sort(
				(candleA: Candle, candleB: Candle) =>
					(candleA.date?.getTime() || 0) -
					(candleB.date?.getTime() || 0)
			);
	}
}
