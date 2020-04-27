import { environment } from "./config.mjs";
class Env {
    constructor() {
        this.handleNetworkChange = () => {
            // @ts-ignore
            this.connection = window.navigator.connection.effectiveType;
        };
        this.memory = 4;
        this.cpu = window.navigator.hardwareConcurrency;
        this.connection = "4g";
        // @ts-ignore
        this.isProduciton = environment === "production";
        this.isDebug = !this.isProduciton;
        this.domState = "hard-loading";
        this.dataSaver = false;
        this._tickets = [];
        this.init();
    }
    init() {
        if ("connection" in navigator) {
            // @ts-ignore
            this.connection = window.navigator.connection.effectiveType;
            // @ts-ignore
            this.dataSaver = window.navigator.connection.saveData;
            // @ts-ignore
            navigator.connection.onchange = this.handleNetworkChange;
        }
        if ("deviceMemory" in navigator) {
            // @ts-ignore
            this.memory = window.navigator.deviceMemory;
        }
        if (document.documentElement.getAttribute("debug")) {
            this.isDebug = true;
        }
        if (window.location.search) {
            if (new URL(window.location.href).searchParams.get("debug")) {
                this.isDebug = true;
            }
        }
    }
    /**
     * Attempts to set the DOM to the `idling` state. The DOM will only idle when all `startLoading()` methods have been resolved.
     * @param ticket - the `string` the was provided by the `startLoading()` method.
     */
    stopLoading(ticket) {
        if ((!ticket && this.isDebug) || (typeof ticket !== "string" && this.isDebug)) {
            console.error(`A ticket with the typeof 'string' is required to end the loading state.`);
            return;
        }
        for (let i = 0; i < this._tickets.length; i++) {
            if (this._tickets[i] === ticket) {
                this._tickets.splice(i, 1);
                break;
            }
        }
        if (this._tickets.length === 0 && this.domState !== "hard-loading") {
            this.domState = "idling";
            document.documentElement.setAttribute("state", this.domState);
        }
    }
    /**
     * Sets the DOM to the `soft-loading` state.
     * @returns a ticket `string` that is required to stop the loading state.
     */
    startLoading() {
        if (this.domState !== "hard-loading") {
            this.domState = "soft-loading";
            document.documentElement.setAttribute("state", this.domState);
        }
        const ticket = this.uuid();
        this._tickets.push(ticket);
        return ticket;
    }
    startPageTransition() {
        this.domState = "page-loading";
        document.documentElement.setAttribute("state", this.domState);
    }
    endPageTransition() {
        this.domState = "page-loading-complete";
        document.documentElement.setAttribute("state", this.domState);
        setTimeout(() => {
            if (this._tickets.length) {
                this.domState = "soft-loading";
                document.documentElement.setAttribute("state", this.domState);
            }
            else {
                this.domState = "idling";
                document.documentElement.setAttribute("state", this.domState);
            }
        }, 600);
    }
    /**
     * Quick and dirty unique ID generation.
     * This method does not follow RFC 4122 and does not guarantee a universally unique ID.
     * @see https://tools.ietf.org/html/rfc4122
     */
    uuid() {
        return new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
    }
    /**
     * Sets the DOMs state attribute.
     * DO NOT USE THIS METHOD. DO NOT MANUALLY SET THE DOMs STATE.
     * @param newState - the new state of the document element
     * @deprecated since version 0.1.0
     */
    setDOMState(newState) {
        this.domState = newState;
        document.documentElement.setAttribute("state", this.domState);
    }
}
export const env = new Env();
export const debug = env.isDebug;
export const uuid = env.uuid;
export const dataSaver = env.dataSaver;
