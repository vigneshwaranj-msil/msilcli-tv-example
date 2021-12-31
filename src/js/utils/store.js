import { LocalStore } from "@msf/msf-charts-helper";
import { STORE_KEY } from "../constants";
const localStore = new LocalStore(STORE_KEY), previousStore = () => {
    let store = localStore.store;
    store.layout = store.layout || {};
    store.preferences = store.preferences || {};
    store.drawings = store.drawings || {};
    store.timeFrame = store.timeFrame || "1D";
    return store;
};
export { previousStore, localStore };
