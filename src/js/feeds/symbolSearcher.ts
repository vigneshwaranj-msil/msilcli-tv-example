export interface ISymbolSearcherProps {
	url: string;
}
export default abstract class BaseSymbolSearcher {
	private __url: string;
	protected __requestHandler: { [key: string]: AbortController };
	#requestCounter: number = 0;
	constructor(props: ISymbolSearcherProps) {
		this.__url = props.url;
		this.__requestHandler = {};

		this.newRequest = this.newRequest.bind(this);
		this.initRequestController = this.initRequestController.bind(this);
		this.abortRequest = this.abortRequest.bind(this);
		this.searchServerForSymbol = this.searchServerForSymbol.bind(this);
	}

	get url(): string {
		return this.__url;
	}

	protected newRequest(): number {
		return ++this.#requestCounter;
	}

	protected initRequestController(): AbortController {
		this.abortRequest(this.#requestCounter);
		this.newRequest();
		let abortController: AbortController = new AbortController();
		this.__requestHandler[this.#requestCounter] = abortController;
		return abortController;
	}

	protected abortRequest(requestNumber: number) {
		if (requestNumber in this.__requestHandler) {
			this.__requestHandler[requestNumber].abort();
		}
	}

	/**
	 * @abstract
	 * @method searchServerForSymbol
	 * @description This function will contain the logic to request to Server to provide list of relevant symbol the user is searching for
	 * @param {string} text Search input by the user
	 * @param {HeadersInit} [headers] Additional requst headers i.e., X-Auth-Token etc.,
	 */
	abstract searchServerForSymbol(
		text: string,
		headers?: HeadersInit
	): Promise<Response>;
}
