import { h, Component, Fragment } from "preact";
import { message } from "djinnjs/broadcaster";

import "./entity-drawer.scss";

type EntityDrawerProps = {
	entity: {
		name: string;
		uid: string;
		hp: string;
		ac: string;
	} | null;
	monster: Monster | null;
};
type Monster = {
	uid: string;
	name: string;
	flavorText: string;
	alignment: string;
	ac: number;
	maxHitPoints: number;
	speed: string;
	exp: number;
	notes: string;
	actions: string;
	legendaryActions: string;
	charisma: number;
	charismaModifier: number;
	constitution: number;
	constitutionModifier: number;
	dexterity: number;
	dexterityModifier: number;
	intelligence: number;
	intelligenceModifier: number;
	strength: number;
	strengthModifier: number;
	wisdom: number;
	wisdomModifier: number;
};
type EntityDrawerState = {
	forceClose: boolean;
};

export class EntityDrawer extends Component<EntityDrawerProps, EntityDrawerState> {
	constructor() {
		super();
		this.state = {
			forceClose: false,
		};
	}

	private updateEntity: EventListener = (e: Event) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		const form = e.currentTarget as HTMLFormElement;
		const hpInput = form.querySelector("#current-hp-input") as HTMLInputElement;
		const acInput = form.querySelector("#current-ac-input") as HTMLInputElement;
		message("server", {
			type: "update-entity",
			uid: this.props.entity.uid,
			hp: hpInput.value,
			ac: acInput.value,
		});
	};

	private forceCloseDrawer: EventListener = () => {
		this.setState({ forceClose: true });
	};

	componentWillReceiveProps() {
		this.setState({ forceClose: false });
	}

	render() {
		let info = null;
		let flavorText = null;
		if (this.props?.monster) {
			flavorText = (
				<span className="font-xs font-grey-700 block mt-0.5" style={{ fontStyle: "italic" }}>
					{this.props?.monster?.flavorText}
				</span>
			);
		}
		if (this.props.entity !== null) {
			info = (
				<form className="block w-full" onSubmit={this.updateEntity}>
					<div className="w-full block text-left mb-1 pb-1 bb-1 bb-solid bb-grey-300">
						<span className="font-grey-800 font-medium font-lg block">{this.props.entity.name}</span>
						{flavorText}
					</div>
					<div className="block w-full mb-1">
						<label htmlFor="hp-input" className="block w-full font-sm font-grey-800 mb-0.5 text-left font-medium">
							Hit Points
						</label>
						<input value={this.props.entity.hp} min={0} step={1} type="number" id="current-hp-input" />
					</div>
					<div className="block w-full mb-1">
						<label htmlFor="ac-input" className="block w-full font-sm font-grey-800 mb-0.5 text-left font-medium">
							Armor Class
						</label>
						<input value={this.props.entity.ac} min={0} step={1} type="number" id="current-ac-input" />
					</div>
					<button className="button -solid -primary block w-full" type="submit">
						Update
					</button>
				</form>
			);
		}
		let monsterInfo = null;
		if (this.props?.monster) {
			monsterInfo = (
				<Fragment>
					<div className="block w-full mt-1 pt-1 bt-1 bt-grey-300 bt-solid text-left">
						<span className="font-grey-700 block mb-0.5">{this.props.monster.alignment}</span>
						<span className="font-grey-700 block">{this.props.monster.speed}</span>
					</div>
					<div className="block w-full mt-1 pt-1 bt-1 bt-grey-300 bt-solid text-left">
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Str:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.strength} ({this.props.monster.strengthModifier})
							</span>
						</div>
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Dex:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.dexterity} ({this.props.monster.dexterityModifier})
							</span>
						</div>
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Con:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.constitution} ({this.props.monster.constitutionModifier})
							</span>
						</div>
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Int:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.intelligence} ({this.props.monster.intelligenceModifier})
							</span>
						</div>
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Wis:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.wisdom} ({this.props.monster.wisdomModifier})
							</span>
						</div>
						<div class="block w-full mb-0.25">
							<span className="inline-block font-grey-800 font-bold mr-0.25">Char:</span>
							<span className="inline-block font-grey-700">
								{this.props.monster.charisma} ({this.props.monster.charismaModifier})
							</span>
						</div>
					</div>
					<div className="block w-full mt-1 pt-1 bt-1 bt-grey-300 bt-solid text-left">
						<p className="font-sm font-grey-700 block mb-1 line-normal">
							{this.props.monster.actions ? this.props.monster.actions : "This monster does not have any actions."}
						</p>
						<p className="font-sm font-grey-700 block line-normal">
							{this.props.monster.legendaryActions ? this.props.monster.legendaryActions : "This monster does not have any legendary actions."}
						</p>
					</div>
				</Fragment>
			);
		}
		return (
			<div className={`entity-drawer ${this.props.entity !== null && !this.state.forceClose ? "is-open" : ""}`}>
				<div className="block w-full h-full" style={{ overflowY: "auto" }}>
					{info}
					{monsterInfo}
				</div>
				<button className="close-button" onClick={this.forceCloseDrawer}>
					<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
						<path
							fill="currentColor"
							d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
						></path>
					</svg>
				</button>
			</div>
		);
	}
}
