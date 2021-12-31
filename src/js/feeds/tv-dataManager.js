import { getHolidaySessionFromMarketRules, getHolidaysStringFromMarketRules, getSessionTimeFromCurrentRule } from "@msf/msf-charts-helper/dist/utils/trading-view";
import { activeSymbol, chartManager, marketRules } from "../tv_App";
import APIManager from "./tv-apiManager";
import ChartSymbolSearcher from "./tv-symbolSearcher";
export default class DataFeedManager {
    constructor() {
        this.__apiManager = new APIManager();
        this.__basicConfiguration = {
            supported_resolutions: ["1", "2", "3", "4", "5", "10", "15", "30", "60", "120", "180", "240", "300", "1D", "1W", "1M"].map((res) => res),
            supports_time: true
        };
        this.__symbolSearcher = new ChartSymbolSearcher();
    }
    onReady(callback) {
        setTimeout(() => {
            callback(this.__basicConfiguration);
        }, 0);
    }
    searchSymbols(userInput, _exchange, _symbolType, onResult) {
        this.__symbolSearcher.searchServerForSymbol(userInput).then((jsonRes) => {
            if (jsonRes && jsonRes.msg) {
                throw new Error(jsonRes.msg);
            }
            else {
                onResult(jsonRes.data.map((data) => ({
                    symbol: data.symbolId,
                    description: data.symbol,
                    exchange: data.exchange
                })));
            }
        });
    }
    resolveSymbol(_symbolName, onResolve, _onError) {
        this.__apiManager.clearSubscriptions();
        chartManager.symbol.changeSymbol({
            symbolId: activeSymbol.symbolId,
            symbolName: activeSymbol.symbolName,
            exchange: activeSymbol.exchange
        });
        console.log(chartManager.symbol.toString());
        setTimeout(() => onResolve({
            ticker: chartManager.symbol.toString(),
            minmov: 1,
            pricescale: 100,
            exchange: chartManager.symbol.props.exchange,
            name: chartManager.symbol.props.symbolId.toString(),
            session: getSessionTimeFromCurrentRule(marketRules[0]),
            corrections: getHolidaySessionFromMarketRules(marketRules),
            holidays: getHolidaysStringFromMarketRules(marketRules),
            full_name: chartManager.symbol.props.symbolName,
            description: "",
            type: "stock",
            listed_exchange: "",
            has_daily: true,
            has_intraday: true,
            has_no_volume: false,
            timezone: "Asia/Kolkata",
            format: "price",
            supported_resolutions: this.__basicConfiguration.supported_resolutions || []
        }), 0);
    }
    getBars(symbolInfo, resolution, _rangeStartDate, _rangeEndDate, onResult, _onError, isFirstCall) {
        const customOnResult = (bars) => {
            if (bars.length) {
                onResult(bars, {
                    noData: false
                });
                chartManager.updateStreamingStatus(true);
            }
            else {
                onResult([], {
                    noData: true
                });
            }
        };
        let requestRange = chartManager.apiHandler.generateRequestRange(resolution, isFirstCall);
        if (requestRange.from && requestRange.to) {
            let requestBody = JSON.stringify(this.__apiManager.__generateRequestBody(requestRange.from, requestRange.to, symbolInfo.ticker || chartManager.symbol.toString(), resolution));
            if (isFirstCall) {
                chartManager.getInitialData(resolution, requestBody, {
                    "Content-Type": "application/json"
                }).then((res) => res.json()).then((jsonRes) => this.__apiManager.onSuccessResponseFromAPI(customOnResult, jsonRes))
                    .catch(err => this.__apiManager.onFailureResponse(err, customOnResult));
            }
            else {
                chartManager.getHistoricData(requestBody, {
                    "Content-Type": "application/json"
                }).then((res) => res.json()).then((jsonRes) => this.__apiManager.onSuccessResponseFromAPI(jsonRes, customOnResult))
                    .catch(err => this.__apiManager.onFailureResponse(err, customOnResult));
            }
        }
    }
    subscribeBars(_symbolInfo, _resolution, onTick, listenerGuid, _onResetCacheNeededCallback) {
        this.__apiManager.addSubscription(listenerGuid, onTick);
    }
    unsubscribeBars(_listenerGuid) {
    }
}
