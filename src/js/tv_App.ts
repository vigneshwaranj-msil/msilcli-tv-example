import ChartDataManager from "@msf/msf-charts-helper";
import "./App.css";
import { fetchMarketRules } from "./market/marketFactory";
import { extractCssUrl, SymbolDetails, URLProperties } from "./utils/helpers";
import { extractDetailsFromURL } from "./utils/url";
import { ResolutionString, widget } from "chartLibrary/bundles/charting_library/charting_library";
import DataFeedManager from "./feeds/tv-dataManager";
import { ANDROID_JS_INTERFACE_KEY, CONTAINER_ID } from "./constants";
import MarketRule from "@msf/msf-charts-helper/dist/market/rules";
import responseFromExternalInterfaces from "./utils/device-interfaces";

let chartManager: ChartDataManager,
	urlData: URLProperties = extractDetailsFromURL(),
	activeSymbol: SymbolDetails = urlData.symbol,
	hasChartLoaded: boolean = false,
	marketRules: MarketRule[],
	tradingViewWidget: any,
	chartDataFeed: DataFeedManager = new DataFeedManager();

/**
 * @method urlFactory
 * @description Returns a URL which will be used by the API requestor to fetch data from data for getting candles
 * @returns {string}
 */
function urlFactory(): string {
	return process.env.url.feed;
}

/**
 * @method resolutionFactory
 * @description Should return the active resolution i.e., the time difference between each candle displayed on chart
 * @example 1, 2, 3 ... 240 min which means 1min, 2min, 3min ... 4hr (or) 1D, 1W, or 1M day week or month
 * @returns {string}
 */
function resolutionFactory(): string {
	return tradingViewWidget ? tradingViewWidget.activeChart().resolution() : "1";
}

function initializeChart(): void {
	fetchMarketRules(activeSymbol.exchange).then(
		(rules: void | MarketRule[]) => {
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
						interval: "1" as ResolutionString,
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

export function createChart(): void {
	document.addEventListener(
		"DOMContentLoaded",
		function () {
			initializeChart();
		},
		false
	);
}

export {
	chartManager,
	urlData,
	activeSymbol,
	marketRules
}