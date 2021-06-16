import PIXI from 'pixi.js';
import {DisplayVars, HSDisplaySettings} from './highscorestypes';

const TITLE_TEXTS = ['Offline', 'All', '30 days', '7 days', '24 hours'];
const PANE_WID = 522;
// const PANE_HEI = 440;
const PANE_HEI = 364;
const PANE_RND = 48;
const TITLE_Y = -140;
const TITLES_X = -226;//this should match with FIELDS_X in HighScoresTableLines
const TITLES_Y = -91;

class HighScoresTable extends PIXI.Container {
	private contentTitle:string='';
	private titlesContainer:PIXI.Container;
	private backPane:PIXI.Graphics;
	private titleText:PIXI.Text;
	private numColumns:number;
	private titles:PIXI.Text[]=[];

	constructor(dVars:DisplayVars, dStngs:HSDisplaySettings) {
		super();
		this.titlesContainer = new PIXI.Container();
		this.backPane = new PIXI.Graphics();
		this.drawBackPane(dStngs);
		this.titleText = new PIXI.Text('title', { fontFamily: dStngs.fonts[0], fill: dStngs.fontColors[0], fontWeight: 'bold' });
		this.titleText.anchor.set(0.5);
		this.numColumns = dStngs.titleLabels.length;
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i] = new PIXI.Text(dStngs.titleLabels[i],
				{ fontFamily: dStngs.fonts[1], fill: dStngs.fontColors[1], align: 'center', fontWeight: 'bold' });
			this.titlesContainer.addChild(this.titles[i]);
			this.titles[i].x = dStngs.xPositions[i];
			this.titles[i].anchor.set(0.5);
		}
		this.titleText.position.set(0, TITLE_Y);
		this.titlesContainer.position.set(TITLES_X, TITLES_Y);

		this.addChild(this.backPane, this.titleText, this.titlesContainer);
		this.setupDisplay(dVars, dStngs);
	}

	setupDisplay(dVars:DisplayVars, dStngs:HSDisplaySettings) {
		this.updateFontSizes(dVars, dStngs);
		this.titleText.resolution = dVars.textRes;
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i].resolution = dVars.textRes;
		}
	}

	setContentTitle(title:string) { this.contentTitle = title; }

	drawBackPane(dStngs:HSDisplaySettings) {
		let w = PANE_WID;
		let h = PANE_HEI;
		let r = PANE_RND;
		if (dStngs.backPaneMargin > 0) {
			this.backPane.clear();
			this.backPane.lineStyle(1, dStngs.backPaneColors[0]);
			this.backPane.beginFill(dStngs.backPaneColors[1]);
			this.backPane.drawRoundedRect(-w / 2, -h / 2, w, h, r);
			w -= dStngs.backPaneMargin;
			h -= dStngs.backPaneMargin;
			r -= Math.floor(dStngs.backPaneMargin / 3);
		}
		this.backPane.lineStyle(1, dStngs.backPaneColors[2]);
		this.backPane.beginFill(dStngs.backPaneColors[3]);
		this.backPane.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		this.backPane.alpha = dStngs.backPaneAlpha;
	}

	updateFontSizes(dVars:DisplayVars, dStngs:HSDisplaySettings) {
		let fontSizes = dVars.orient === 0 ? dStngs.fontSizes : dStngs.fontSizesPort;
		this.titleText.style.fontSize = fontSizes[0];
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i].style.fontSize = fontSizes[1];
		}
	}

	updateTitle(curSet:number) {
		let curText = TITLE_TEXTS[curSet];
		if (this.contentTitle !== '' && curSet !== 0) {
			this.titleText.text = this.contentTitle + ' - ' + curText;
		} else {
			this.titleText.text = curText;
		}
		// this.titleTween.restart(true, false);
		// this.titlesTween.restart(true, false);
	}

	init() {
	}

	deit() {
	}
}

export default HighScoresTable;
