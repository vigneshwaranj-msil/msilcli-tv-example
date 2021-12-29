enum Themes {
	day,
	night
}

export declare type Theme = keyof typeof Themes;

export interface SymbolDetails {
	symbolName: string;
	symbolId: string;
	exchange: string;
	[extraDetail: string]: string;
}

export interface URLProperties {
	symbol: SymbolDetails;
	theme: Theme;
	[extraDetails: string]: any;
}

export function getDetailsFromURL(): URLProperties {
	return {} as URLProperties;
}

export interface Configuration {
	symbol: string;
	theme: Theme;
	datafeed: object;
	lastStoredLayout?: object;
	extras?: any;
	containerId: string;
	onChartReady?: Function;
	marketFactory?: Function;
}

export function extractCssUrl(): string {
	let link: HTMLLinkElement | null = document.querySelector("link[rel='stylesheet']");
	if (link) {
		return link.href;
	}
	return "";
}