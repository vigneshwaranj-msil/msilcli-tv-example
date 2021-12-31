var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseAPIManager_refreshInterval;
import { chartManager } from "../tv_App";
export default class BaseAPIManager {
    constructor(refresInterval = 1) {
        _BaseAPIManager_refreshInterval.set(this, void 0);
        __classPrivateFieldSet(this, _BaseAPIManager_refreshInterval, refresInterval, "f");
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
    get refreshInterval() {
        return __classPrivateFieldGet(this, _BaseAPIManager_refreshInterval, "f") * 1e3;
    }
    /**
     * @method clearSubscriptions
     * @description Will clear all the existing interval's callback using clearInterval
     */
    clearSubscriptions() {
        Object.values(this.__subscriptionObject).forEach((listOfSubscriptionIntevals) => {
            listOfSubscriptionIntevals.forEach((subscription) => window.clearInterval(subscription));
        });
    }
    /**
     * @description Adds a new subscription for the given symbol which will be called for every refreshInterval's second
     * @method addSubscription
     * @param {string} symbolId - active symbol on charts
     * @param {Function} callbackFromFramework - The callback from framework we will send our candle to this function and it will update the API
     */
    addSubscription(symbolId, callbackFromFramework) {
        let subscriptionList = this.__subscriptionObject[symbolId];
        subscriptionList = subscriptionList ? [...subscriptionList] : [];
        subscriptionList.push(window.setInterval(() => {
            if (chartManager.isStreaming) {
                this.checkForRealTimeCandlesUpdate(callbackFromFramework)(chartManager.broadcastHandler.broadcastCandle);
            }
        }, this.refreshInterval));
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
    __generateRequestBody(from, to, symbolId, resolution) {
        let isDailyCandle = /[DWM]/.test(resolution);
        return {
            from: from.toISOString(),
            to: to.toISOString(),
            symbolId,
            time: isDailyCandle ? 1 : parseInt(resolution, 10),
            period: isDailyCandle ? "day" : "min"
        };
    }
}
_BaseAPIManager_refreshInterval = new WeakMap();
