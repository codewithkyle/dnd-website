import { hookup, disconnect } from "./broadcaster.mjs";
import { debug } from "./env.mjs";
export class Actor extends HTMLElement {
    constructor(inboxName) {
        super();
        this.inboxName = inboxName;
    }
    // eslint-disable-next-line
    inbox(data) { }
    connected() { }
    disconnected() { }
    connectedCallback() {
        if (!this.inboxName) {
            if (debug) {
                console.warn(`This actor is missing an inbox name. Did you forget to call the classes constructor?`);
            }
            this.inboxName = "nil";
        }
        this.inboxId = hookup(this.inboxName, this.inbox.bind(this));
        this.connected();
    }
    disconnectedCallback() {
        disconnect(this.inboxId);
        this.disconnected();
    }
}
