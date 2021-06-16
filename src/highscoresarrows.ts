import PIXI from 'pixi.js';
import { makeArrow, makeRect } from './highscoresutils';
import { DisplayVars,HSDisplaySettings} from './highscorestypes';


class HighScoresArrows extends PIXI.Container {
	private INTERVAL_TIME = 20;
	private myUpBut:PIXI.Container;
	private myDownBut:PIXI.Container;
	private upRect:PIXI.Graphics;
	private downRect:PIXI.Graphics;
	private myInterval:number|null=null;
	private delta:number=0;

	constructor(dVars:DisplayVars, displaySettings:HSDisplaySettings) {
		super();

		this.stopUp = this.stopUp.bind(this);
		this.stopDown = this.stopDown.bind(this);
		this.startUp = this.startUp.bind(this);
		this.startDown = this.startDown.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);

		this.myUpBut = new PIXI.Container();
		this.myDownBut = new PIXI.Container();

		let myUpArrow = new PIXI.Graphics();
		let myDownArrow = new PIXI.Graphics();
		makeArrow(myUpArrow, 32, displaySettings.arrowStroke, displaySettings.arrowColor);
		makeArrow(myDownArrow, 32, displaySettings.arrowStroke, displaySettings.arrowColor);
		myUpArrow.rotation = -1.57;
		myDownArrow.rotation = 1.57;

		this.upRect = new PIXI.Graphics();
		this.downRect = new PIXI.Graphics();
		makeRect(this.upRect, 120, 80, 0, 0xffffff, 0xffffff);
		makeRect(this.downRect, 120, 80, 0, 0xffffff, 0xffffff);
		this.upRect.alpha = 0.01;
		this.downRect.alpha = 0.01;

		this.myUpBut.addChild(myUpArrow, this.upRect);
		this.myDownBut.addChild(myDownArrow, this.downRect);

		this.addChild(this.myUpBut, this.myDownBut);
		this.setupDisplay(dVars, displaySettings);
	}

	setupDisplay(dVars:DisplayVars, displaySettings:HSDisplaySettings) {
		let yAdj = dVars.orient === 0 ? displaySettings.adjustYs[0] : displaySettings.adjustYs[1];
		if (dVars.orient === 0) {
			this.myUpBut.position.set(735, 180 + yAdj);
			this.myDownBut.position.set(735, 290 + yAdj);
			this.upRect.visible = false;
			this.downRect.visible = false;
		} else {
			// this.myUpBut.position.set(275, 30 + yAdj);
			// this.myDownBut.position.set(275, 578 + yAdj);
			this.myUpBut.position.set(220, 35 + yAdj);
			this.myDownBut.position.set(330, 60 + yAdj);
			this.upRect.visible = true;
			this.downRect.visible = true;
		}
	}

	startUp() {
		this.delta = 0;
		this.removeInterval();
		this.myInterval = window.setInterval(this.scrollUp, this.INTERVAL_TIME);
		this.myUpBut.on('mouseout', this.stopUp);
	}

	stopUp() {
		this.removeInterval();
		if (this.delta === 0) this.scrollUp();
		this.delta = 0;
	}

	removeInterval() {
		if (this.myInterval !== null) {
			clearInterval(this.myInterval);
			this.myInterval = null;
		}
		this.myUpBut.off('mouseout');
		this.myDownBut.off('mouseout');
	}

	startDown() {
		this.delta = 0;
		this.removeInterval();
		this.myInterval = window.setInterval(this.scrollDown, this.INTERVAL_TIME);
		this.myDownBut.on('mouseout', this.stopDown);
	}

	stopDown() {
		this.removeInterval();
		if (this.delta === 0) this.scrollDown();
		this.delta = 0;
	}

	scrollUp() {
		this.delta += 1;
		this.emit('scrollup');
	}

	scrollDown() {
		this.delta += 1;
		this.emit('scrolldown');
	}

	addLists() {
		this.myUpBut.on('pointerdown', this.startUp);
		this.myDownBut.on('pointerdown', this.startDown);
		this.myUpBut.on('pointerup', this.stopUp);
		this.myDownBut.on('pointerup', this.stopDown);
		this.myUpBut.buttonMode = true;
		this.myDownBut.buttonMode = true;
		this.myUpBut.interactive = true;
		this.myDownBut.interactive = true;
	}

	removeLists() {
		this.myUpBut.off('pointerdown');
		this.myDownBut.off('pointerdown');
		this.myUpBut.off('pointerup');
		this.myUpBut.off('pointerup');
		this.myUpBut.buttonMode = false;
		this.myDownBut.buttonMode = false;
		this.myUpBut.interactive = false;
		this.myDownBut.interactive = false;
		this.removeInterval();
	}
}

export default HighScoresArrows;
