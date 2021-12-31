import ChartDataManager from "@msf/msf-charts-helper";
import "./App.css";
import { fetchMarketRules } from "./market/marketFactory";
import { extractCssUrl } from "./utils/helpers";
import { extractDetailsFromURL } from "./utils/url";
import { widget } from "chartLibrary/bundles/charting_library/charting_library";
import DataFeedManager from "./feeds/tv-dataManager";
import { ANDROID_JS_INTERFACE_KEY, CONTAINER_ID } from "./constants";
import responseFromExternalInterfaces from "./utils/deviceInterface";
let chartManager, urlData = extractDetailsFromURL(), activeSymbol = urlData.symbol, hasChartLoaded = false, marketRules, tradingViewWidget, chartDataFeed = new DataFeedManager();
/**
 * @method urlFactory
 * @description Returns a URL which will be used by the API requestor to fetch data from data for getting candles
 * @returns {string}
 */
function urlFactory() {
    return process.env.url.feed;
}
/**
 * @method resolutionFactory
 * @description Should return the active resolution i.e., the time difference between each candle displayed on chart
 * @example 1, 2, 3 ... 240 min which means 1min, 2min, 3min ... 4hr (or) 1D, 1W, or 1M day week or month
 * @returns {string}
 */
function resolutionFactory() {
    return tradingViewWidget ? tradingViewWidget.activeChart().resolution() : "1";
}
function initializeChart() {
    fetchMarketRules(activeSymbol.exchange).then((rules) => {
        if (rules) {
            marketRules = rules;
            chartManager = new ChartDataManager({
                symbol: {
                    symbolId: activeSymbol.symbolId,
                    symbolName: activeSymbol.symbolName,
                    exchange: activeSymbol.exchange
                },
                api: {
                    url: urlFactory,
                    rules: () => marketRules,
                },
                resolutionFactory,
                deviceInterface: {
                    androidTag: ANDROID_JS_INTERFACE_KEY,
                    onMessage: responseFromExternalInterfaces
                },
                iframeInterface: {
                    onMessage: responseFromExternalInterfaces
                }
            });
            /**
             * Create your chart engine here based on the function from default configuration
             */
            if (!hasChartLoaded && tradingViewWidget === undefined) {
                tradingViewWidget = new widget({
                    timezone: "Asia/Kolkata",
                    datafeed: chartDataFeed,
                    symbol: "S",
                    container_id: CONTAINER_ID,
                    interval: "1",
                    locale: "en",
                    library_path: "js/thirdparty/charting_library/",
                    load_last_chart: true,
                    custom_css_url: extractCssUrl() || undefined
                });
            }
        }
    })
        .catch(err => console.error(err));
}
export function createChart() {
    document.addEventListener("DOMContentLoaded", function () {
        initializeChart();
    }, false);
}
export { chartManager, urlData, activeSymbol, marketRules };
