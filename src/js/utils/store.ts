import { LocalStore } from "@msf/msf-charts-helper";
import { STORE_KEY } from "../constants";
import { Theme } from "./helpers";

export interface Store {
	layout: any;
	preferences?: any;
	timeFrame: string;
	drawings?: any;
	theme: Theme;
}

const localStore: LocalStore<Store> = new LocalStore<Store>(STORE_KEY),
	previousStore: () => Store = () => {
		let store: Store = localStore.store;
		store.layout = store.layout || {};
		store.preferences = store.preferences || {};
		store.drawings = store.drawings || {};
		store.timeFrame = store.timeFrame || "1D";
		return store;
	};

export { previousStore, localStore };
