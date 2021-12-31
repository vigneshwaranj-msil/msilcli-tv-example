import URLHandler from "@msf/msf-charts-helper/dist/utils/url";
import { URL_QUERY_KEY } from "../constants";
let urlHandler = new URLHandler();
/**
 * @method extractDetailsFromURL
 * @description Will extract the necessary details from the URL using the url handler
 * @returns {URLProperties}
 */
export function extractDetailsFromURL() {
    const dataQuery = urlHandler.get(URL_QUERY_KEY);
    if (dataQuery) {
        let extractedObject;
        try {
            extractedObject = JSON.parse(dataQuery);
        }
        catch (err) {
            console.error(err);
            extractedObject = {};
        }
        return extractedObject;
    }
    else {
        throw new Error("URL query is not being passed");
    }
}
export function changeSymbol(newURLJSONString) {
    if (newURLJSONString) {
        urlHandler.set(URL_QUERY_KEY, newURLJSONString);
        return Promise.resolve(extractDetailsFromURL());
    }
    else {
        return Promise.resolve();
    }
}
