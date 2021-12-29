import BaseSymbolSearcher from "./symbolSearcher";

export default class ChartSymbolSearcher extends BaseSymbolSearcher {
    constructor() {
        super({
            url: process.env.url.search
        });
    }
    searchServerForSymbol(text: string, headers?: HeadersInit): Promise<Response> {
        let requestController: AbortController = this.initRequestController();
        return (
            fetch(`${this.url}${text}`, {
                signal: requestController.signal,
                headers
            })
                .then(res => res.json())
                .catch(Err => {
                    console.error(Err);
                })
        );
    }

}