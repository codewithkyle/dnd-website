import { h, render, Component, Fragment } from "preact";
import { hookup, message } from "djinnjs/broadcaster";

import "./battle-map.scss";

type BattleMapState = {
	open: boolean;
	map: string;
	name: string;
	characterUid: string;
	entities: Array<{
		name: string;
		uid: string;
		type: string;
		pos: {
			x: number;
			y: number;
		};
	}>;
};

class BattleMap extends Component<{}, BattleMapState> {
	private inboxUid: string;

	constructor() {
		super();
		const characterSheet: HTMLElement = document.body.querySelector("character-sheet") || null;
		this.state = {
			map: null,
			open: false,
			entities: [],
			name: characterSheet ? characterSheet.dataset.characterName : null,
			characterUid: characterSheet ? characterSheet.dataset.characterUid : null,
		};
		this.inboxUid = hookup("battle-map", this.inbox.bind(this));
		message(
			"server",
			{
				type: "init-map",
			},
			this.inboxUid
		);
		document.body.addEventListener("keyup", this.handleKeypress);
	}

	private inbox(data) {
		switch (data.type) {
			case "init-map":
				this.setState({ map: data.url, entities: data.entities });
				break;
			case "render-entities":
				this.setState({ entities: data.entities });
				break;
			case "load-map":
				this.setState({ map: data.url, entities: [] });
				break;
			default:
				console.log(`Battle Map recieved an undefined message type: ${data.type}`);
				break;
		}
	}

	private toggleDrawer: EventListener = () => {
		this.setState({ open: this.state.open ? false : true });
	};

	private handleKeypress: EventListener = (e: KeyboardEvent) => {
		if (e instanceof KeyboardEvent) {
			if (e.key.toLowerCase() === "escape") {
				this.setState({ open: false });
			}
		}
	};

	private moveMarker: EventListener = (e: MouseEvent) => {
		if (!this.state.characterUid) {
			return;
		}
		const map = e.currentTarget as HTMLElement;
		const bounds = map.getBoundingClientRect();
		if (e instanceof MouseEvent) {
			const newPos = {
				x: e.pageX + (e.offsetX - e.pageX),
				y: e.pageY + (e.offsetY - e.pageY),
			};
			if (bounds.x > 0) {
				newPos.x - bounds.x;
			}
			if (bounds.y > 0) {
				newPos.y - bounds.y;
			}
			message("server", {
				type: "send-position",
				entity: {
					name: this.state.name,
					uid: this.state.characterUid,
					pos: newPos,
					type: "pc",
				},
			});
		}
	};

	render() {
		let map: any = <span>The Game Master hasn't loaded a map yet.</span>;
		if (this.state.map) {
			let entities = this.state.entities.map((entity) => (
				<div className={`entity -${entity.type}`} style={{ transform: `translate(${entity.pos.x - 12}px, ${entity.pos.y - 12}px)` }}>
					<div className="tooltip">
						<span>{entity.name}</span>
					</div>
				</div>
			));
			map = (
				<div className="map-wrapper">
					<img onClick={this.moveMarker} draggable={false} className="map" src={this.state.map} alt="a D&D battle map" />
					<div className="entities">{entities}</div>
				</div>
			);
		}
		let svgIcon;
		if (this.state.open) {
			svgIcon = (
				<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
					<path
						fill="currentColor"
						d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
					></path>
				</svg>
			);
		} else {
			svgIcon = (
				<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
					<path
						fill="currentColor"
						d="M608 336h-64v-65.94L529.94 256 544 241.94v-99.88L529.94 128 544 113.94V88c0-48.52-39.47-88-88-88H80C35.88 0 0 35.89 0 80v64c0 17.64 14.34 32 32 32h80v65.94L126.06 256 112 270.06v133.38c0 55.44 41.69 105.46 98.66 108.3l312 .26C587.38 512 640 459.36 640 394.67V368c0-17.64-14.34-32-32-32zM48 128V80c0-17.64 14.34-32 32-32s32 14.36 32 32v48H48zm112 275.44v-113.5L193.94 256 160 222.06V80c0-11.38-2.38-22.2-6.69-32H456c22.06 0 40 17.94 40 40v6.06L462.06 128 496 161.94v60.12L462.06 256 496 289.94V336h-65.94L416 350.06 401.94 336H304c-17.66 0-32 14.36-32 32v40c0 15.78-6.72 30.92-18.44 41.53-11.88 10.73-27.25 15.67-43.41 14.19-28.12-2.83-50.15-29.3-50.15-60.28zm432-8.77c0 38.23-31.09 69.33-69.34 69.33H303.11c10.67-16.62 16.89-35.92 16.89-56v-24h62.06L416 417.94 449.94 384H592v10.67z"
					></path>
				</svg>
			);
		}
		return (
			<Fragment>
				<button onClick={this.toggleDrawer} className="open-map-button">
					{svgIcon}
				</button>
				<div className={`battle-map ${this.state.open ? "is-open" : ""}`}>{map}</div>
			</Fragment>
		);
	}
}
render(<BattleMap />, document.body.querySelector("#battle-map-mounting-point"));
