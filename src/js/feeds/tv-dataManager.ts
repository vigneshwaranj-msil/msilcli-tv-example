import { Range } from "@msf/msf-charts-helper/dist/feeds/rangeManager";
import { getHolidaySessionFromMarketRules, getHolidaysStringFromMarketRules, getSessionTimeFromCurrentRule } from "@msf/msf-charts-helper/dist/utils/trading-view";
import { ErrorCallback, HistoryCallback, IDatafeedChartApi, IExternalDatafeed, OnReadyCallback, LibrarySymbolInfo, ResolutionString, ResolveCallback, SearchSymbolsCallback, SubscribeBarsCallback, DatafeedConfiguration, SearchSymbolResultItem, Bar } from "chartLibrary/bundles/charting_library/charting_library";
import { activeSymbol, chartManager, marketRules } from "../tv_App";
import APIManager from "./tv-apiManager";
import ChartSymbolSearcher from "./tv-symbolSearcher";

export type CustomHistoryCallback = (bars: Bar[]) => void;
export default class DataFeedManager implements IExternalDatafeed, IDatafeedChartApi {
    private __apiManager: APIManager;
    private __symbolSearcher: ChartSymbolSearcher;
    private __basicConfiguration: DatafeedConfiguration
    constructor() {
        this.__apiManager = new APIManager();
        this.__basicConfiguration = {
            supported_resolutions: ["1", "2", "3", "4", "5", "10", "15", "30", "60", "120", "180", "240", "300", "1D", "1W", "1M"].map((res: string) => <ResolutionString>res),
            supports_time: true
        };
        this.__symbolSearcher = new ChartSymbolSearcher();
    }

    onReady(callback: OnReadyCallback): void {
        setTimeout(() => {
            callback(this.__basicConfiguration)
        }, 0);
    }
    searchSymbols(userInput: string, _exchange: string, _symbolType: string, onResult: SearchSymbolsCallback): void {
        this.__symbolSearcher.searchServerForSymbol(
            userInput
        ).then((jsonRes: any) => {
            if (jsonRes && jsonRes.msg) {
                throw new Error(jsonRes.msg);
            } else {
                onResult(jsonRes.data.map((data: any) => ({
                    symbol: data.symbolId,
                    description: data.symbol,
                    exchange: data.exchange
                } as SearchSymbolResultItem)))
            }
        })
    }
    resolveSymbol(_symbolName: string, onResolve: ResolveCallback, _onError: ErrorCallback): void {
        this.__apiManager.clearSubscriptions();
        chartManager.symbol.changeSymbol({
            symbolId: activeSymbol.symbolId,
            symbolName: activeSymbol.symbolName,
            exchange: activeSymbol.exchange
        });
        console.log(chartManager.symbol.toString())
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
    getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, _rangeStartDate: number, _rangeEndDate: number, onResult: HistoryCallback, _onError: ErrorCallback, isFirstCall: boolean): void {
        const customOnResult: CustomHistoryCallback = (bars: Bar[]) => {
            if (bars.length) {
                onResult(bars, {
                    noData: false
                });
                chartManager.updateStreamingStatus(true);
            } else {
                onResult([], {
                    noData: true
                })
            }
        }
        let requestRange: Range = chartManager.apiHandler.generateRequestRange(resolution, isFirstCall);
        if (requestRange.from && requestRange.to) {
            let requestBody: any = JSON.stringify(this.__apiManager.__generateRequestBody(requestRange.from, requestRange.to, symbolInfo.ticker || chartManager.symbol.toString(), resolution));
            if (isFirstCall) {
                chartManager.getInitialData(
                    resolution,
                    requestBody,
                    {
                        "Content-Type": "application/json"
                    }
                ).then((res: Response) => res.json()).then((jsonRes: any) => this.__apiManager.onSuccessResponseFromAPI(customOnResult, jsonRes))
                    .catch(err => this.__apiManager.onFailureResponse(err, customOnResult))
            } else {
                chartManager.getHistoricData(
                    requestBody,
                    {
                        "Content-Type": "application/json"
                    }
                ).then((res: Response) => res.json()).then((jsonRes: any) => this.__apiManager.onSuccessResponseFromAPI(jsonRes, customOnResult))
                    .catch(err => this.__apiManager.onFailureResponse(err, customOnResult))
            }
        }
    }
    subscribeBars(_symbolInfo: LibrarySymbolInfo, _resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, _onResetCacheNeededCallback: () => void): void {
        this.__apiManager.addSubscription(listenerGuid, onTick);
    }
    unsubscribeBars(_listenerGuid: string): void {
    }

}