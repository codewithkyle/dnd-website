import { hookup, disconnect } from "djinnjs/broadcaster";
import { PingComponent } from "./ping-component";

class PingManger extends HTMLElement {
	private inboxUid: string;

	constructor() {
		super();
		this.inboxUid;
	}

	private inbox(data) {
		switch (data.type) {
			case "ping":
				this.createPing(data.pos);
				break;
			default:
				console.warn(`Ping Component recieved an unknown message type: ${data.type}`);
				break;
		}
	}

	private createPing(pingPos) {
		const ping = document.createElement("ping-component");
		ping.style.transform = `translate(${pingPos.x - 21}px, ${pingPos.y - 21}px)`;
		ping.innerHTML =
			'<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"></path></svg>';
		this.appendChild(ping);
		const audio = new Audio(`${location.origin}/static/ping.wav`);
		audio.volume = 0.75;
		audio.play();
	}

	connectedCallback() {
		this.inboxUid = hookup("pinger", this.inbox.bind(this));
	}

	disconnectedCallback() {
		disconnect(this.inboxUid);
	}
}
customElements.define("ping-manager", PingManger);
customElements.define("ping-component", PingComponent);
