import URLHandler from "@msf/msf-charts-helper/dist/utils/url";
import { URL_QUERY_KEY } from "../constants";
import { URLProperties } from "./helpers";

let urlHandler: URLHandler = new URLHandler();
/**
 * @method extractDetailsFromURL
 * @description Will extract the necessary details from the URL using the url handler
 * @returns {URLProperties}
 */
export function extractDetailsFromURL(): URLProperties {
	const dataQuery: string = urlHandler.get(URL_QUERY_KEY);
	if (dataQuery) {
		let extractedObject: URLProperties;
		try {
			extractedObject = JSON.parse(dataQuery);
		} catch (err) {
			console.error(err);
			extractedObject = {} as URLProperties;
		}
		return extractedObject;
	} else {
		throw new Error("URL query is not being passed");
	}
}
