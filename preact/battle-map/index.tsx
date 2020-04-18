import { h, render, Component, Fragment } from "preact";
import { hookup, message } from "djinnjs/broadcaster";

import "./battle-map.scss";

type BattleMapState = {
	open: boolean;
	map: string;
	name: string;
	characterUid: string;
	showNametags: boolean;
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
			showNametags: false,
		};
		this.inboxUid = hookup("battle-map", this.inbox.bind(this));
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
		message("server", {
			type: "init-map",
		});
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

	private toggleNameTags: EventListener = () => {
		this.setState({ showNametags: this.state.showNametags ? false : true });
	};

	private handleRightClick: EventListener = (e: Event) => {
		if (e instanceof MouseEvent) {
			e.preventDefault();
			// Is PC
			if (this.state.characterUid) {
				const map = e.currentTarget as HTMLElement;
				const bounds = map.getBoundingClientRect();
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
					type: "send-ping",
					pos: newPos,
				});
				message("pinger", {
					type: "ping",
					pos: newPos,
				});
			}
		}
	};

	render() {
		let map: any = <span>The Game Master hasn't loaded a map yet.</span>;

		let drawer = null;
		if (this.state.characterUid && this.state.open) {
			drawer = (
				<div className="map-action-drawer">
					<button onClick={this.toggleNameTags} className={this.state.showNametags ? "is-active" : ""}>
						<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
							<path
								fill="currentColor"
								d="M512 32H64C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm32 384c0 17.6-14.4 32-32 32H64c-17.6 0-32-14.4-32-32V96c0-17.6 14.4-32 32-32h448c17.6 0 32 14.4 32 32v320zm-72-128H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm0-64H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm0-64H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zM208 288c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80zm0-128c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zm46.8 144c-19.5 0-24.4 7-46.8 7s-27.3-7-46.8-7c-21.2 0-41.8 9.4-53.8 27.4C100.2 342.1 96 355 96 368.9V392c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-23.1c0-7 2.1-13.8 6-19.6 5.6-8.3 15.8-13.2 27.3-13.2 12.4 0 20.8 7 46.8 7 25.9 0 34.3-7 46.8-7 11.5 0 21.7 5 27.3 13.2 3.9 5.8 6 12.6 6 19.6V392c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-23.1c0-13.9-4.2-26.8-11.4-37.5-12.3-18-32.9-27.4-54-27.4z"
							></path>
						</svg>
						<span>Nametags</span>
					</button>
				</div>
			);
		}

		if (this.state.map) {
			let entities = this.state.entities.map((entity) => (
				<div className={`entity -${entity.type}`} style={{ transform: `translate(${entity.pos.x - 12}px, ${entity.pos.y - 12}px)` }}>
					<div className={`tooltip ${this.state.showNametags ? "is-visible" : ""}`}>
						<span>{entity.name}</span>
					</div>
				</div>
			));
			console.log("Rendered new entity pos");
			map = (
				<div className="map-wrapper">
					<img onClick={this.moveMarker} onContextMenu={this.handleRightClick} draggable={false} className="map" src={this.state.map} alt="a D&D battle map" />
					<div className="entities">{entities}</div>
					{/* 
					// @ts-ignore */}
					<ping-manager web-component loading="eager"></ping-manager>
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
				{drawer}
			</Fragment>
		);
	}
}
render(<BattleMap />, document.body.querySelector("#battle-map-mounting-point"));
