import { h, render, Component, Fragment } from "preact";
import { hookup } from "djinnjs/broadcaster";

import "./initiation-order.scss";

type InitiationOrderState = {
	open: boolean;
	order: Array<{
		name: string;
		characterUid: string | null;
	}>;
};

class InitiationOrder extends Component<{}, InitiationOrderState> {
	private inboxUid: string;

	constructor() {
		super();
		this.state = {
			open: false,
			order: [],
		};
		this.inboxUid = hookup("initiation-order", this.inbox.bind(this));
	}

	private inbox(data) {
		switch (data.type) {
			case "clear-order":
				this.setState({ order: [] });
				break;
			case "set-order":
				this.setState({ order: data.order });
				break;
			default:
				console.log(`Initiation Order recieved an undefined message type: ${data.type}`);
				break;
		}
	}

	private openDrawer: EventListener = () => {
		this.setState({ open: true });
	};
	private closeDrawer: EventListener = () => {
		this.setState({ open: false });
	};

	render() {
		let entities: any = <span>The Game Master hasn't set the combat order yet.</span>;
		if (this.state.order.length) {
			entities = this.state.order.map((entity) => <span className="mx-0.5 font-primary-700 font-medium">{entity.name}</span>);
		}
		return (
			<Fragment>
				<button onClick={this.openDrawer} className="open-initiation-button">
					<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
						<path
							fill="currentColor"
							d="M544 224c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80zm0-112c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zM96 224c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80zm0-112c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm396.4 210.9c-27.5-40.8-80.7-56-127.8-41.7-14.2 4.3-29.1 6.7-44.7 6.7s-30.5-2.4-44.7-6.7c-47.1-14.3-100.3.8-127.8 41.7-12.4 18.4-19.6 40.5-19.6 64.3V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-44.8c.2-23.8-7-45.9-19.4-64.3zM464 432H176v-44.8c0-36.4 29.2-66.2 65.4-67.2 25.5 10.6 51.9 16 78.6 16 26.7 0 53.1-5.4 78.6-16 36.2 1 65.4 30.7 65.4 67.2V432zm92-176h-24c-17.3 0-33.4 5.3-46.8 14.3 13.4 10.1 25.2 22.2 34.4 36.2 3.9-1.4 8-2.5 12.3-2.5h24c19.8 0 36 16.2 36 36 0 13.2 10.8 24 24 24s24-10.8 24-24c.1-46.3-37.6-84-83.9-84zm-236 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm0-176c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM154.8 270.3c-13.4-9-29.5-14.3-46.8-14.3H84c-46.3 0-84 37.7-84 84 0 13.2 10.8 24 24 24s24-10.8 24-24c0-19.8 16.2-36 36-36h24c4.4 0 8.5 1.1 12.3 2.5 9.3-14 21.1-26.1 34.5-36.2z"
						></path>
					</svg>
				</button>
				<div className={`initiation-order ${this.state.open ? "is-open" : ""}`}>
					<div className="entities">{entities}</div>
					<button className="close-button" onClick={this.closeDrawer}>
						<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
							<path
								fill="currentColor"
								d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
							></path>
						</svg>
					</button>
				</div>
			</Fragment>
		);
	}
}
render(<InitiationOrder />, document.body.querySelector("#initiation-mounting-point"));
