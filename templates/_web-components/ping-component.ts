export class PingComponent extends HTMLElement {
	connectedCallback() {
		setTimeout(() => {
			this.remove();
		}, 900);
	}
}
