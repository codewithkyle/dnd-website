import { h, render, Component, Fragment } from "preact";
import { hookup, message } from "djinnjs/broadcaster";

import "./battle-map.scss";

type BattleMapState = {
	open: boolean;
	map: string;
	name: string;
	characterUid: string;
	showNametags: boolean;
	gmModal: null | "pin" | "entity";
	entityType: null | "enemy" | "npc";
	selectedEntity: string;
	enableDrawing: boolean;
	drawing: string;
	savedPos: null | {
		x: number;
		y: number;
	};
	entities: Array<{
		name: string;
		uid: string;
		type: string;
		pos: {
			x: number;
			y: number;
		};
	}>;
	gmMenuPos: {
		x: number;
		y: number;
	};
	pins: Array<{
		uid: string;
		label: string;
		pos: {
			x: number;
			y: number;
		};
	}>;
};

class BattleMap extends Component<{}, BattleMapState> {
	private inboxUid: string;
	private canPing: boolean;

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
			gmMenuPos: null,
			pins: [],
			gmModal: null,
			savedPos: null,
			entityType: null,
			selectedEntity: null,
			enableDrawing: false,
			drawing: null,
		};
		this.canPing = true;
		this.inboxUid = hookup("battle-map", this.inbox.bind(this));
		document.body.addEventListener("keyup", this.handleKeypress);
	}

	private inbox(data) {
		switch (data.type) {
			case "stop-drawing":
				this.setState({ enableDrawing: false });
				break;
			case "render-pins":
				this.setState({ pins: data.pins });
				break;
			case "init-map":
				this.setState({ map: data.url, entities: data.entities, pins: data.pins, drawing: data.drawing });
				break;
			case "render-entities":
				this.setState({ entities: data.entities });
				break;
			case "load-map":
				this.setState({ map: data.url, entities: [] });
				message("dynamic-map", {
					type: "init",
					map: data.url,
					drawing: null,
				});
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
		if (e instanceof MouseEvent) {
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

			if (this.state.characterUid && !e.ctrlKey && !e.metaKey) {
				message("server", {
					type: "send-position",
					entity: {
						name: this.state.name,
						uid: this.state.characterUid,
						pos: newPos,
						type: "pc",
					},
				});
			} else if ((this.state.characterUid && e.ctrlKey) || e.metaKey) {
				this.setState({ gmModal: "pin", savedPos: newPos, selectedEntity: null });
			} else if (!this.state.characterUid && this.state.selectedEntity) {
				message("server", {
					type: "send-position",
					entity: {
						uid: this.state.selectedEntity,
						pos: newPos,
					},
				});
			}
		}
	};

	private toggleNameTags: EventListener = () => {
		this.setState({ showNametags: this.state.showNametags ? false : true });
	};

	private handleRightClick: EventListener = (e: Event) => {
		if (e instanceof MouseEvent) {
			e.preventDefault();
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
			if (this.state.characterUid && this.canPing) {
				this.canPing = false;
				message("server", {
					type: "send-ping",
					pos: newPos,
				});
				message("pinger", {
					type: "ping",
					pos: newPos,
				});
				setTimeout(() => {
					this.canPing = true;
				}, 900);
			} else if (this.state.characterUid === null) {
				this.setState({ gmMenuPos: newPos, savedPos: newPos, selectedEntity: null });
			}
		}
	};

	private closeGMMenu: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		this.setState({ gmMenuPos: null, savedPos: null });
	};

	private gmPing: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		message("pinger", {
			type: "ping",
			pos: this.state.gmMenuPos,
		});
		this.setState({ gmMenuPos: null });
	};

	private placePin: EventListener = (e: Event) => {
		this.setState({ gmModal: "pin" });
	};

	private createPin: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		e.preventDefault();
		const target = e.currentTarget as HTMLFormElement;
		const labelInput = target.querySelector("input");
		message("server", {
			type: "place-pin",
			label: labelInput.value,
			pos: this.state.savedPos,
		});
		this.setState({ gmMenuPos: null, gmModal: null, savedPos: null });
	};

	private closeGMModal: EventListener = (e: Event) => {
		this.setState({ gmMenuPos: null, gmModal: null, savedPos: null });
	};

	private spawnEntity: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		const target = e.currentTarget as HTMLButtonElement;
		// @ts-ignore
		this.setState({ gmModal: "entity", entityType: target.dataset.type });
	};

	private createEntity: EventListener = (e: Event) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		const target = e.currentTarget as HTMLFormElement;
		const labelInput = target.querySelector("input");
		message("server", {
			type: "add-entity",
			entityType: this.state.entityType,
			label: labelInput.value,
			pos: this.state.gmMenuPos,
		});
		this.setState({ gmMenuPos: null, gmModal: null, entityType: null, savedPos: null });
	};

	private entityClick: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		if (e instanceof MouseEvent) {
			const target = e.currentTarget as HTMLElement;
			const type = target.dataset.type;
			const uid = target.dataset.uid;
			if ((this.state.characterUid === null && type === "enemy") || type === "npc") {
				if (e.metaKey || e.ctrlKey) {
					this.setState({ selectedEntity: null });
					message("server", {
						type: "remove-entity",
						uid: uid,
					});
				} else {
					if (uid === this.state.selectedEntity) {
						this.setState({ selectedEntity: null });
					} else {
						this.setState({ selectedEntity: target.dataset.uid });
					}
				}
			}
		}
	};

	private pinClick: EventListener = (e: Event) => {
		e.stopImmediatePropagation();
		if (e instanceof MouseEvent) {
			if (e.ctrlKey || e.metaKey) {
				const target = e.currentTarget as HTMLElement;
				const uid = target.dataset.uid;
				message("server", {
					type: "remove-pin",
					uid: uid,
				});
			}
		}
	};

	private toggleDrawing: EventListener = (e: Event) => {
		const updatedState = { ...this.state };
		if (this.state.enableDrawing) {
			updatedState.enableDrawing = false;
		} else {
			updatedState.enableDrawing = true;
			message("dynamic-map", {
				type: "init",
				map: this.state.map,
				drawing: this.state.drawing,
			});
		}
		this.setState(updatedState);
	};

	private clearDrawing: EventListener = (e: Event) => {
		message("dynamic-map", {
			type: "clear",
		});
		message("server", {
			type: "clear-dynamic-map",
		});
	};

	private mapLoaded: EventListener = () => {
		message("dynamic-map", {
			type: "init",
			map: this.state.map,
			drawing: this.state.drawing,
		});
	};

	render() {
		let map: any = <span>The Game Master hasn't loaded a map yet.</span>;

		let drawer = null;
		if (this.state.characterUid && this.state.open) {
			// Player drawer
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
		} else if (!this.state.characterUid && this.state.open) {
			// GM drawer
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
					<button onClick={this.toggleDrawing} className={this.state.enableDrawing ? "is-active" : ""}>
						<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path
								fill="currentColor"
								d="M493.255 56.236l-37.49-37.49c-24.993-24.993-65.515-24.994-90.51 0L12.838 371.162.151 485.346c-1.698 15.286 11.22 28.203 26.504 26.504l114.184-12.687 352.417-352.417c24.992-24.994 24.992-65.517-.001-90.51zM164.686 347.313c6.249 6.249 16.379 6.248 22.627 0L368 166.627l30.059 30.059L174 420.745V386h-48v-48H91.255l224.059-224.059L345.373 144 164.686 324.687c-6.249 6.248-6.249 16.378 0 22.626zm-38.539 121.285l-58.995 6.555-30.305-30.305 6.555-58.995L63.255 366H98v48h48v34.745l-19.853 19.853zm344.48-344.48l-49.941 49.941-82.745-82.745 49.941-49.941c12.505-12.505 32.748-12.507 45.255 0l37.49 37.49c12.506 12.506 12.507 32.747 0 45.255z"
							></path>
						</svg>
						<span>Drawing Mode</span>
					</button>
					<button onClick={this.clearDrawing}>
						<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path
								fill="currentColor"
								d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z"
							></path>
						</svg>
						<span>Clear Drawing</span>
					</button>
				</div>
			);
		}

		let gmModal;
		switch (this.state.gmModal) {
			case "entity":
				gmModal = (
					<div className="gm-modal">
						<div className="modal-backdrop" onClick={this.closeGMModal}></div>
						<form onSubmit={this.createEntity}>
							<label htmlFor="name-input" className="block w-full font-sm font-grey-800 mb-0.5 text-left font-medium">
								Name
							</label>
							<input type="text" id="name-input" />
							<div className="block w-full text-right">
								<button onClick={this.closeGMModal} type="button" className="button -text -black mr-1">
									cancel
								</button>
								<button type="submit" className="button -solid -primary">
									Spawn
								</button>
							</div>
						</form>
					</div>
				);
				break;
			case "pin":
				gmModal = (
					<div className="gm-modal">
						<div className="modal-backdrop" onClick={this.closeGMModal}></div>
						<form onSubmit={this.createPin}>
							<label htmlFor="label-input" className="block w-full font-sm font-grey-800 mb-0.5 text-left font-medium">
								Pin Label
							</label>
							<input type="text" id="label-input" />
							<div className="block w-full text-right">
								<button onClick={this.closeGMModal} type="button" className="button -text -black mr-1">
									cancel
								</button>
								<button type="submit" className="button -solid -primary">
									Create Pin
								</button>
							</div>
						</form>
					</div>
				);
				break;
			default:
				gmModal = null;
				break;
		}

		let gmMenu = null;
		if (this.state.gmMenuPos !== null && this.state.gmModal === null) {
			gmMenu = (
				<Fragment>
					<div className="gm-backdrop" onClick={this.closeGMMenu}></div>
					<div className="gm-menu" style={{ transform: `translate(${this.state.gmMenuPos.x - 230}px, ${this.state.gmMenuPos.y - 85}px)` }}>
						<button onClick={this.closeGMMenu} className="close-button">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
								<path
									fill="currentColor"
									d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
								></path>
							</svg>
						</button>
						<button onClick={this.gmPing} className="gm-button -ping">
							<i>
								<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<path
										fill="currentColor"
										d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm42-104c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42zm-81.37-211.401l6.8 136c.319 6.387 5.591 11.401 11.985 11.401h41.17c6.394 0 11.666-5.014 11.985-11.401l6.8-136c.343-6.854-5.122-12.599-11.985-12.599h-54.77c-6.863 0-12.328 5.745-11.985 12.599z"
									></path>
								</svg>
							</i>
							<span>ping</span>
						</button>
						<button onClick={this.spawnEntity} data-type="enemy" className="gm-button -enemy">
							<i>
								<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<path
										fill="currentColor"
										d="M507.31 462.06L448 402.75l31.64-59.03c3.33-6.22 2.2-13.88-2.79-18.87l-17.54-17.53c-6.25-6.25-16.38-6.25-22.63 0L420 324 112 16 18.27.16C8.27-1.27-1.42 7.17.17 18.26l15.84 93.73 308 308-16.69 16.69c-6.25 6.25-6.25 16.38 0 22.62l17.53 17.54a16 16 0 0 0 18.87 2.79L402.75 448l59.31 59.31c6.25 6.25 16.38 6.25 22.63 0l22.62-22.62c6.25-6.25 6.25-16.38 0-22.63zm-149.36-76.01L60.78 88.89l-5.72-33.83 33.84 5.72 297.17 297.16-28.12 28.11zm65.17-325.27l33.83-5.72-5.72 33.84L340.7 199.43l33.94 33.94L496.01 112l15.84-93.73c1.43-10-7.01-19.69-18.1-18.1l-93.73 15.84-121.38 121.36 33.94 33.94L423.12 60.78zM199.45 340.69l-45.38 45.38-28.12-28.12 45.38-45.38-33.94-33.94-45.38 45.38-16.69-16.69c-6.25-6.25-16.38-6.25-22.62 0l-17.54 17.53a16 16 0 0 0-2.79 18.87L64 402.75 4.69 462.06c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L109.25 448l59.03 31.64c6.22 3.33 13.88 2.2 18.87-2.79l17.53-17.54c6.25-6.25 6.25-16.38 0-22.63L188 420l45.38-45.38-33.93-33.93z"
									></path>
								</svg>
							</i>
							<span>spawn enemy</span>
						</button>
						<button onClick={this.spawnEntity} data-type="npc" className="gm-button -npc">
							<i>
								<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
									<path
										fill="currentColor"
										d="M340.3 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 42.6 0 70-11.9 80.1-14.4-.1-7.5-.1-24.8 6.1-49.2-28.6 1.4-40.9 15.6-86.2 15.6-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h342c-19.4-12.9-36.2-29.2-49.7-48zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96zm386.5 325.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5z"
									></path>
								</svg>
							</i>
							<span>spawn npc</span>
						</button>
						<button onClick={this.placePin} className="gm-button -pin">
							<i>
								<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512">
									<path
										fill="currentColor"
										d="M144 0C64.47 0 0 64.47 0 144c0 71.31 51.96 130.1 120 141.58v197.64l16.51 24.77c3.56 5.34 11.41 5.34 14.98 0L168 483.22V285.58C236.04 274.1 288 215.31 288 144 288 64.47 223.53 0 144 0zm0 240c-52.94 0-96-43.07-96-96 0-52.94 43.06-96 96-96s96 43.06 96 96c0 52.93-43.06 96-96 96zm0-160c-35.28 0-64 28.7-64 64 0 8.84 7.16 16 16 16s16-7.16 16-16c0-17.64 14.34-32 32-32 8.84 0 16-7.16 16-16s-7.16-16-16-16z"
									></path>
								</svg>
							</i>
							<span>place marker</span>
						</button>
					</div>
				</Fragment>
			);
		}

		if (this.state.map) {
			let entities = this.state.entities.map((entity) => (
				<div
					onClick={this.entityClick}
					data-type={entity.type}
					data-uid={entity.uid}
					className={`entity -${entity.type} ${entity.uid === this.state.selectedEntity ? "is-selected" : ""}`}
					style={{ transform: `translate(${entity.pos.x - 12}px, ${entity.pos.y - 12}px)` }}
				>
					<div className={`tooltip ${this.state.showNametags ? "is-visible" : ""}`}>
						<span>{entity.name}</span>
					</div>
				</div>
			));
			let pins = this.state.pins.map((pin) => (
				<i onClick={this.pinClick} className="pin" data-uid={pin.uid} style={{ transform: `translate(${pin.pos.x - 16}px, ${pin.pos.y - 31}px)` }}>
					<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
						<path
							fill="currentColor"
							d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
						></path>
					</svg>
					<span className={this.state.showNametags ? "is-visible" : ""}>{pin.label}</span>
				</i>
			));
			map = (
				<div className="map-wrapper">
					<img
						onLoad={this.mapLoaded}
						onClick={this.moveMarker}
						onContextMenu={this.handleRightClick}
						draggable={false}
						className="map"
						src={this.state.map}
						alt="a D&D battle map"
					/>
					{/* 
					// @ts-ignore */}
					<dynamic-map web-component loading="eager" className={this.state.enableDrawing ? "is-active" : null}>
						<canvas></canvas>
						{/* 
					// @ts-ignore */}
					</dynamic-map>
					<div className="entities">
						{pins}
						{entities}
					</div>
					{/* 
					// @ts-ignore */}
					<ping-manager web-component loading="eager"></ping-manager>
					{gmMenu}
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
				{gmModal}
			</Fragment>
		);
	}
}
render(<BattleMap />, document.body.querySelector("#battle-map-mounting-point"));
