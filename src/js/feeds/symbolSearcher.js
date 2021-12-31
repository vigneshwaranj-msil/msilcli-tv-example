var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _BaseSymbolSearcher_requestCounter;
export default class BaseSymbolSearcher {
    constructor(props) {
        _BaseSymbolSearcher_requestCounter.set(this, 0);
        this.__url = props.url;
        this.__requestHandler = {};
        this.newRequest = this.newRequest.bind(this);
        this.initRequestController = this.initRequestController.bind(this);
        this.abortRequest = this.abortRequest.bind(this);
        this.searchServerForSymbol = this.searchServerForSymbol.bind(this);
    }
    get url() {
        return this.__url;
    }
    newRequest() {
        var _a;
        return __classPrivateFieldSet(this, _BaseSymbolSearcher_requestCounter, (_a = __classPrivateFieldGet(this, _BaseSymbolSearcher_requestCounter, "f"), ++_a), "f");
    }
    initRequestController() {
        this.abortRequest(__classPrivateFieldGet(this, _BaseSymbolSearcher_requestCounter, "f"));
        this.newRequest();
        let abortController = new AbortController();
        this.__requestHandler[__classPrivateFieldGet(this, _BaseSymbolSearcher_requestCounter, "f")] = abortController;
        return abortController;
    }
    abortRequest(requestNumber) {
        if (requestNumber in this.__requestHandler) {
            this.__requestHandler[requestNumber].abort();
        }
    }
}
_BaseSymbolSearcher_requestCounter = new WeakMap();
