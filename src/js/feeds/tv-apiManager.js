import { convertCandleToTradingViewCandle } from "@msf/msf-charts-helper/dist/utils/trading-view";
import BaseAPIManager from "./tv-baseApiManager";
export default class APIManager extends BaseAPIManager {
    checkForRealTimeCandlesUpdate(cb) {
        return (candle) => cb(convertCandleToTradingViewCandle(candle));
    }
    onSuccessResponseFromAPI(callback, jsonResponse) {
        if (jsonResponse && jsonResponse.data) {
            callback(this.__formatChartData(jsonResponse.data).map((candle) => convertCandleToTradingViewCandle(candle)));
        }
        else {
            this.onFailureResponse(jsonResponse.msg, callback);
        }
    }
    onFailureResponse(error, callback) {
        console.error(error);
        callback([]);
    }
    __formatChartData(jsonResponse) {
        return (jsonResponse || [])
            .map((responseCandle) => {
            return {
                date: new Date(responseCandle.date),
                open: parseFloat(responseCandle.open),
                close: parseFloat(responseCandle.close),
                high: parseFloat(responseCandle.high),
                low: parseFloat(responseCandle.low),
                volume: parseFloat(responseCandle.volume)
            };
        })
            .filter((candle) => !!candle.date &&
            !!candle.close &&
            !!candle.open &&
            !!candle.low &&
            !!candle.high)
            .sort((candleA, candleB) => (candleA.date?.getTime() || 0) -
            (candleB.date?.getTime() || 0));
    }
}
