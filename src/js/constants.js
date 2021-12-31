/**
 * This constant is what will be visible on URL as a query param which will contain the encoded data
 * Kindly make use of URL Query param for data communication to charts
 * i.e., Any details which are required to pass like
 *  - Symbol details
 *  - Session of user
 *  - Theme etc.,
 * All details has to be sent vvia URL query param
 */
export const URL_QUERY_KEY = "data", CONTAINER_ID = "chartContainer", STORE_KEY = "chartStore", ANDROID_JS_INTERFACE_KEY = "charts";
