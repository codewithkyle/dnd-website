import { hookup, disconnect } from "./broadcaster.mjs";
class CombatTimer extends HTMLElement {
    constructor() {
        super();
        this.timer = this.querySelector("time");
        this.inboxUid = hookup("initiation-order", this.inbox.bind(this));
        this.time = performance.now();
        this.tick();
    }
    inbox(data) {
        switch (data.type) {
            case "update-initiation-index":
                this.checkIndex(data.index);
                break;
            case "clear-order":
                this.index = null;
                this.classList.remove("is-visible");
                break;
            case "set-order":
                this.setIndex(data.order);
                break;
            default:
                break;
        }
    }
    tick() {
        const newTime = performance.now();
        const deltaTime = (newTime - this.time) / 1000;
        this.time = newTime;
        if (this.countdown > 0) {
            this.countdown -= deltaTime;
            if (this.countdown < 0) {
                this.countdown = 0;
            }
            this.timer.innerHTML = `${Math.round(this.countdown)}`;
        }
        window.requestAnimationFrame(this.tick.bind(this));
    }
    checkIndex(index) {
        if (index === this.index) {
            this.countdown = 60;
            this.classList.add("is-visible");
        }
        else {
            this.classList.remove("is-visible");
            this.countdown = 0;
        }
    }
    setIndex(order) {
        for (let i = 0; i < order.length; i++) {
            if (order[i].characterUid === this.dataset.characterUid) {
                this.index = i;
                break;
            }
        }
    }
    disconnectedCallback() {
        disconnect(this.inboxUid);
        this.tick = () => { };
    }
}
customElements.define("combat-timer", CombatTimer);
