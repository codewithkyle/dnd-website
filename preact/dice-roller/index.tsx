import { h, render, Component, Fragment } from "preact";
import { DiceRoller as DRoller } from "rpg-dice-roller";

import "./dice-roller.scss";

type DrawerState = {
	open: boolean;
	queuedD4: number;
	queuedD6: number;
	queuedD8: number;
	queuedD10: number;
	queuedD12: number;
	queuedD20: number;
	view: "rolling" | "waiting" | "rolled";
	results: Array<string>;
};

class DiceRoller extends Component<{}, DrawerState> {
	private roller: any;
	constructor() {
		super();
		this.roller = new DRoller();
		this.state = {
			open: false,
			queuedD4: 0,
			queuedD6: 0,
			queuedD8: 0,
			queuedD10: 0,
			queuedD12: 0,
			queuedD20: 0,
			view: "waiting",
			results: [],
		};
	}
	private openDrawer: EventListener = () => {
		this.setState({ open: true, queuedD4: 0, queuedD8: 0, queuedD10: 0, queuedD12: 0, queuedD20: 0, queuedD6: 0, view: "waiting", results: [] });
	};
	private closeDrawer: EventListener = () => {
		this.setState({ open: false, queuedD4: 0, queuedD8: 0, queuedD10: 0, queuedD12: 0, queuedD20: 0, queuedD6: 0, view: "waiting", results: [] });
	};

	private queueDie: EventListener = (e: Event) => {
		if (this.state.view === "rolling") {
			return;
		}
		const target = e.currentTarget as HTMLButtonElement;
		const type = target.dataset.die;
		const updatedState = { ...this.state };
		updatedState.view = "waiting";
		switch (type) {
			case "d4":
				updatedState.queuedD4++;
				updatedState.queuedD6 = 0;
				updatedState.queuedD8 = 0;
				updatedState.queuedD10 = 0;
				updatedState.queuedD12 = 0;
				updatedState.queuedD20 = 0;
				break;
			case "d6":
				updatedState.queuedD4 = 0;
				updatedState.queuedD6++;
				updatedState.queuedD8 = 0;
				updatedState.queuedD10 = 0;
				updatedState.queuedD12 = 0;
				updatedState.queuedD20 = 0;
				break;
			case "d8":
				updatedState.queuedD4 = 0;
				updatedState.queuedD6 = 0;
				updatedState.queuedD8++;
				updatedState.queuedD10 = 0;
				updatedState.queuedD12 = 0;
				updatedState.queuedD20 = 0;
				break;
			case "d10":
				updatedState.queuedD4 = 0;
				updatedState.queuedD6 = 0;
				updatedState.queuedD8 = 0;
				updatedState.queuedD10++;
				updatedState.queuedD12 = 0;
				updatedState.queuedD20 = 0;
				break;
			case "d12":
				updatedState.queuedD4 = 0;
				updatedState.queuedD6 = 0;
				updatedState.queuedD8 = 0;
				updatedState.queuedD10 = 0;
				updatedState.queuedD12++;
				updatedState.queuedD20 = 0;
				break;
			case "d20":
				updatedState.queuedD4 = 0;
				updatedState.queuedD6 = 0;
				updatedState.queuedD8 = 0;
				updatedState.queuedD10 = 0;
				updatedState.queuedD12 = 0;
				updatedState.queuedD20++;
				break;
		}
		this.setState(updatedState);
	};

	private renderQueue(die: string) {
		switch (die) {
			case "d4":
				if (this.state.queuedD4 !== 0) {
					return <i>{this.state.queuedD4}</i>;
				} else {
					return null;
				}
			case "d6":
				if (this.state.queuedD6 !== 0) {
					return <i>{this.state.queuedD6}</i>;
				} else {
					return null;
				}
			case "d8":
				if (this.state.queuedD8 !== 0) {
					return <i>{this.state.queuedD8}</i>;
				} else {
					return null;
				}
			case "d10":
				if (this.state.queuedD10 !== 0) {
					return <i>{this.state.queuedD10}</i>;
				} else {
					return null;
				}
			case "d12":
				if (this.state.queuedD12 !== 0) {
					return <i>{this.state.queuedD12}</i>;
				} else {
					return null;
				}
			case "d20":
				if (this.state.queuedD20 !== 0) {
					return <i>{this.state.queuedD20}</i>;
				} else {
					return null;
				}
		}
	}

	private doRoll: EventListener = () => {
		if (this.state.view === "rolling") {
			return;
		}
		let numOfRolls = 0;
		let rollType;
		if (this.state.queuedD4) {
			rollType = "d4";
			numOfRolls = this.state.queuedD4;
		} else if (this.state.queuedD6) {
			rollType = "d6";
			numOfRolls = this.state.queuedD6;
		} else if (this.state.queuedD8) {
			rollType = "d8";
			numOfRolls = this.state.queuedD8;
		} else if (this.state.queuedD10) {
			rollType = "d10";
			numOfRolls = this.state.queuedD10;
		} else if (this.state.queuedD12) {
			rollType = "d12";
			numOfRolls = this.state.queuedD12;
		} else if (this.state.queuedD20) {
			rollType = "d20";
			numOfRolls = this.state.queuedD20;
		}
		this.setState({ view: "rolling" });
		setTimeout(() => {
			// @ts-ignore
			const rolls = this.roller.roll(`${numOfRolls}${rollType}`).toString();
			let array = rolls
				.match(/\[.*\]/g)[0]
				.replace(/(\[)|(\])/g, "")
				.split(",");
			if (!Array.isArray(array)) {
				array = [...array];
			}
			this.setState({ results: array, queuedD4: 0, queuedD8: 0, queuedD10: 0, queuedD12: 0, queuedD20: 0, queuedD6: 0, view: "rolled" });
		}, 600);
	};

	private calcTotal() {
		if (this.state.results.length === 1) {
			return null;
		}
		let total = 0;
		this.state.results.map((res) => {
			const num = parseInt(res);
			total += num;
		});
		return (
			<Fragment>
				<span class="font-grey-700">=</span>
				<span class="font-grey-700">{total}</span>
			</Fragment>
		);
	}

	render() {
		let rollBox = null;
		if (
			this.state.queuedD10 ||
			this.state.queuedD12 ||
			this.state.queuedD20 ||
			this.state.queuedD4 ||
			this.state.queuedD6 ||
			this.state.queuedD8 ||
			this.state.results.length
		) {
			let rollView = null;
			if (this.state.view === "waiting") {
				rollView = (
					<button className="button -solid -primary" onClick={this.doRoll}>
						Roll Dice
					</button>
				);
			} else if (this.state.view === "rolling") {
				rollView = (
					<div className="loader">
						<svg viewBox="0 0 66 66" aria-hidden="true">
							<circle cx="33" cy="33" r="30"></circle>
						</svg>
						<span>Rolling dice</span>
					</div>
				);
			} else if (this.state.view === "rolled") {
				rollView = (
					<div className="results">
						{this.state.results.map((res) => (
							<span>{res.trim()}</span>
						))}
						{this.calcTotal()}
					</div>
				);
			}
			rollBox = <div className="roll-box">{rollView}</div>;
		}
		return (
			<Fragment>
				<button onClick={this.openDrawer} className="open-dice-button">
					<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path
							fill="currentColor"
							d="M431.88 116.13L239.88 4.3a31.478 31.478 0 0 0-31.76 0l-192 111.84C6.15 121.94 0 132.75 0 144.46v223.09c0 11.71 6.15 22.51 16.12 28.32l192 111.83a31.478 31.478 0 0 0 31.76 0l192-111.83c9.97-5.81 16.12-16.62 16.12-28.32V144.46c0-11.71-6.15-22.52-16.12-28.33zM224 57.62L318.7 176H129.3L224 57.62zM124.62 208h198.75L224 369.47 124.62 208zm68.28 171.99L55.92 362.87l44.43-133.28 92.55 150.4zm154.75-150.41l44.43 133.28-136.98 17.13 92.55-150.41zm7.17-59.69L262.67 54.72l138.01 80.78-45.86 34.39zm-261.64 0l-46.24-34.68 138.54-80.7-92.3 115.38zm-16.01 27.98l-45.13 135.4.17-169.12 44.96 33.72zM208 414.12v56.43L85.4 398.8 208 414.12zm155.6-15.45L240 470.84v-56.72l123.6-15.45zm7.23-200.8l45.15-33.86-.17 168.79-44.98-134.93zM224.14 480h.17l-.09.05-.08-.05z"
						></path>
					</svg>
				</button>
				<div className={`dice-roller ${this.state.open ? "is-open" : ""}`}>
					{rollBox}
					<div className="dice">
						<button onClick={this.queueDie} className="die-button" data-die="d4">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M504.9 289.03L280.84 11.86C274.45 3.96 265.23 0 256 0s-18.45 3.96-24.85 11.86L7.1 289.03c-11.31 14-8.84 34.57 5.47 45.49l224.05 170.94c5.72 4.37 12.55 6.55 19.38 6.55s13.66-2.18 19.38-6.55l224.05-170.94c14.31-10.92 16.78-31.5 5.47-45.49zM31.99 309.14L240 51.75v416.04L31.99 309.14zM256.02 480h.03l-.01.01-.02-.01zM272 467.82v-416l208.02 257.26L272 467.82z"
								></path>
							</svg>
							<span>d4</span>
							{this.renderQueue("d4")}
						</button>
						<button onClick={this.queueDie} className="die-button" data-die="d6">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
									fill="currentColor"
									d="M431.88 116.13L239.88 4.3a31.478 31.478 0 0 0-31.76 0l-192 111.84C6.15 121.94 0 132.75 0 144.46v223.09c0 11.71 6.15 22.51 16.12 28.32l192 111.83a31.478 31.478 0 0 0 31.76 0l192-111.83c9.97-5.81 16.12-16.62 16.12-28.32V144.46c0-11.71-6.15-22.52-16.12-28.33zM224 32.08l175.75 102.86L224 237.48 47.83 134.7 224 32.08zM32.21 162.65L208 265.18v205.37L32 367.54l.21-204.89zM240 470.84V265.18l175.98-102.64-.21 205.67L240 470.84z"
								></path>
							</svg>
							<span>d6</span>
							{this.renderQueue("d6")}
						</button>
						<button onClick={this.queueDie} className="die-button" data-die="d8">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M502.1 232.1L279.9 9.9C273.3 3.3 264.6 0 256 0s-17.3 3.3-23.9 9.9L9.9 232.1c-13.2 13.2-13.2 34.5 0 47.7L232.1 502c6.6 6.6 15.2 9.9 23.9 9.9s17.3-3.3 23.9-9.9l222.2-222.2c13.2-13.1 13.2-34.5 0-47.7zM240 464.7L61.2 285.9 240 362.5zm0-137L43.7 243.6 240 47.3zm32 137V362.5l178.8-76.6zm0-137V47.3l196.3 196.3z"
								></path>
							</svg>
							<span>d8</span>
							{this.renderQueue("d8")}
						</button>
						<button onClick={this.queueDie} className="die-button" data-die="d10">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M503.88 261.29L279.8 10.64C273.45 3.55 264.72 0 256 0s-17.45 3.55-23.8 10.64L8.12 261.29c-11.81 13.21-10.6 33.5 2.69 45.22l224.08 197.52c6.03 5.32 13.57 7.97 21.11 7.97 7.54 0 15.08-2.66 21.11-7.97L501.19 306.5c13.29-11.71 14.49-32.01 2.69-45.21zM256 297.95l-75.86-50.57 75.86-177 75.86 177L256 297.95zm-107.28-58.24L47.69 264.97 220.97 71.12l-72.25 168.59zm214.56 0L291.03 71.12 464.5 265.01l-101.22-25.3zM31.91 282.62l.01.04-.03-.02.02-.02zm17.03 15.03l108.34-27.09 82.76 55.19v140.22L48.94 297.65zM271.96 465.9V325.75l82.76-55.19 108.2 27.06L271.96 465.9z"
								></path>
							</svg>
							<span>d10</span>
							{this.renderQueue("d10")}
						</button>
						<button onClick={this.queueDie} className="die-button" data-die="d12">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M505.24 178.49l-47.7-95.41a63.972 63.972 0 0 0-28.62-28.62l-95.41-47.7A63.905 63.905 0 0 0 304.89 0h-97.78c-9.94 0-19.73 2.31-28.62 6.76l-95.41 47.7a63.972 63.972 0 0 0-28.62 28.62l-47.7 95.41A63.874 63.874 0 0 0 0 207.11v97.78c0 9.94 2.31 19.73 6.76 28.62l47.7 95.41a63.972 63.972 0 0 0 28.62 28.62l95.41 47.7a64.07 64.07 0 0 0 28.62 6.76h97.78c9.94 0 19.73-2.31 28.62-6.76l95.41-47.7a63.972 63.972 0 0 0 28.62-28.62l47.7-95.41a64.07 64.07 0 0 0 6.76-28.62v-97.78c0-9.94-2.31-19.74-6.76-28.62zm-29.55 12.44l-95.58 109.23L272 246.11V140.22l156.94-42.8 46.75 93.51zM308.8 480H203.2l-55.29-152.06L256 273.89l108.09 54.05L308.8 480zM199.55 32h112.89l82.85 41.42L256 111.41 116.71 73.42 199.55 32zM83.06 97.42L240 140.22V246.1l-108.11 54.05-95.58-109.22 46.75-93.51zM32 312.45v-77.88l81.99 93.7 48.42 133.16-74.56-37.28L32 312.45zm392.15 111.7l-74.56 37.28 48.42-133.16 81.99-93.7v77.88l-55.85 111.7z"
								></path>
							</svg>
							<span>d12</span>
							{this.renderQueue("d12")}
						</button>
						<button onClick={this.queueDie} className="die-button" data-die="d20">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
									fill="currentColor"
									d="M431.88 116.13L239.88 4.3a31.478 31.478 0 0 0-31.76 0l-192 111.84C6.15 121.94 0 132.75 0 144.46v223.09c0 11.71 6.15 22.51 16.12 28.32l192 111.83a31.478 31.478 0 0 0 31.76 0l192-111.83c9.97-5.81 16.12-16.62 16.12-28.32V144.46c0-11.71-6.15-22.52-16.12-28.33zM224 57.62L318.7 176H129.3L224 57.62zM124.62 208h198.75L224 369.47 124.62 208zm68.28 171.99L55.92 362.87l44.43-133.28 92.55 150.4zm154.75-150.41l44.43 133.28-136.98 17.13 92.55-150.41zm7.17-59.69L262.67 54.72l138.01 80.78-45.86 34.39zm-261.64 0l-46.24-34.68 138.54-80.7-92.3 115.38zm-16.01 27.98l-45.13 135.4.17-169.12 44.96 33.72zM208 414.12v56.43L85.4 398.8 208 414.12zm155.6-15.45L240 470.84v-56.72l123.6-15.45zm7.23-200.8l45.15-33.86-.17 168.79-44.98-134.93zM224.14 480h.17l-.09.05-.08-.05z"
								></path>
							</svg>
							<span>d20</span>
							{this.renderQueue("d20")}
						</button>
					</div>
					<button className="close-dice-button" onClick={this.closeDrawer}>
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
render(<DiceRoller />, document.body.querySelector("#dice-mounting-point"));
