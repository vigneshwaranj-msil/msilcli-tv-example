import { Candle } from "@msf/msf-charts-helper/dist/feeds/utils";
import { chartManager } from "../tv_App";

/**
 * @interface SubscriptionMap
 * @property {Array<number>} symbolId = The list of subscription's interval returned by window.setInterval function
 */
interface SubscriptionMap {
	[symbolId: string]: Array<number>;
}

export default abstract class BaseAPIManager {
	protected __subscriptionObject: SubscriptionMap;
	#refreshInterval: number;
	constructor(refresInterval: number = 1) {
		this.#refreshInterval = refresInterval;
		this.__subscriptionObject = {};

		this.checkForRealTimeCandlesUpdate =
			this.checkForRealTimeCandlesUpdate.bind(this);
		this.onFailureResponse = this.onFailureResponse.bind(this);
		this.onSuccessResponseFromAPI =
			this.onSuccessResponseFromAPI.bind(this);
		this.addSubscription = this.addSubscription.bind(this);
		this.clearSubscriptions = this.clearSubscriptions.bind(this);
		this.__generateRequestBody = this.__generateRequestBody.bind(this);
	}

	/**
	 * @abstract
	 * @method checkForRealTimeCandlesUpdate
	 * @description This function should return a new function which contains the logic which will check for real time candles (or) broadcast candles and should update the Chart's
	 * @param {Function} cb - Callback from Framework which will update the Chart's
	 * @returns {Function}
	 */
	abstract checkForRealTimeCandlesUpdate(cb: Function): Function;
	/**
	 * @abstract
	 * @method onSuccessResponseFromAPI
	 * @description Function will be called on successfull response from the API
	 * @param {Function} callback function from Framework which will be provided with all the data that has to be plotted on charts
	 * @param {any} jsonResponse - jsonResponse from the API
	 */
	abstract onSuccessResponseFromAPI(
		callback: Function,
		jsonResponse: any
	): void;
	/**
	 * @abstract
	 * @method onFailureResponse
	 * @description Function called on error response from API
	 * @param {any} error Error occurred
	 * @param {Function} callback Framework's function which will passed with Data from API that will be plotted on charts
	 */
	abstract onFailureResponse(
		error: any,
		callback: Function
	): void;
	/**
	 * @abstract
	 * @protected
	 * @method __formatChartData
	 * @description Function which will format your response from API and convert the response it to Array of candle's
	 * @param {any} jsonResponse JSON response from API
	 */
	protected abstract __formatChartData(jsonResponse: any): Array<Candle>;

	get refreshInterval(): number {
		return this.#refreshInterval * 1e3;
	}
	/** 
	 * @method clearSubscriptions
	 * @description Will clear all the existing interval's callback using clearInterval
	 */
	clearSubscriptions(): void {
		Object.values(this.__subscriptionObject).forEach(
			(listOfSubscriptionIntevals: Array<number>) => {
				listOfSubscriptionIntevals.forEach((subscription: number) =>
					window.clearInterval(subscription)
				);
			}
		);
	}
	/**
	 * @description Adds a new subscription for the given symbol which will be called for every refreshInterval's second
	 * @method addSubscription
	 * @param {string} symbolId - active symbol on charts
	 * @param {Function} callbackFromFramework - The callback from framework we will send our candle to this function and it will update the API
	 */
	addSubscription(
		symbolId: string,
		callbackFromFramework: Function
	): void {
		let subscriptionList = this.__subscriptionObject[symbolId];
		subscriptionList = subscriptionList ? [...subscriptionList] : [];
		subscriptionList.push(
			window.setInterval(() => {
				if (chartManager.isStreaming) {
					this.checkForRealTimeCandlesUpdate(callbackFromFramework)(chartManager.broadcastHandler.broadcastCandle);
				}
			}, this.refreshInterval)
		);
	}

	/**
	 * @method __generateRequestBody
	 * @description Returns the request object / payload which will sent to Data server that will returns the data
	 * @param {Date} from the start date of the response
	 * @param {Date} to the end date of the response
	 * @param {string} symbolId The symbol unique identifier which will allow the API to identify the respective symbol
	 * @param {string} resolution The active resolution on chart
	 * @returns {any}
	 */
	__generateRequestBody(
		from: Date,
		to: Date,
		symbolId: string,
		resolution: string
	): any {
		let isDailyCandle: boolean = /[DWM]/.test(resolution);
		return {
			from: from.toISOString(),
			to: to.toISOString(),
			symbolId,
			time: isDailyCandle ? 1 : parseInt(resolution, 10),
			period: isDailyCandle ? "day" : "min"
		};
	}
}
