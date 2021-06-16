import PIXI from 'pixi.js';
import gsap from 'gsap';
import {DisplayVars, HSSettings, HSDisplaySettings, HSScoresLine} from './highscorestypes';

const	MONTH_TEXTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LINE_HEI = 38;
const PANE_WID = 496;
const PANE_RND = 8;
const NUM_ROWS = 6;
const FIELDS_X = -226;

class HighScoresTableLines extends PIXI.Container {
	private lineType:string;
	private playerHighlight:PIXI.Graphics;
	private fieldsMask:PIXI.Graphics;
	private fieldsContainer:PIXI.Container;
	private linesTween:GSAPTween|null=null;
	private columns:number;
	private tFields:PIXI.Text[];
	private tFieldsText:string[];
	private baseY:number=0;
	private minY:number=0;
	private rowsCount:number=0;

	constructor(dVars:DisplayVars, settings:HSSettings, dStngs:HSDisplaySettings) {
		super();
		this.lineType=settings.TABLE_TYPE;

		this.playerHighlight = new PIXI.Graphics();

		this.playerHighlight.lineStyle(1, dStngs.highlightColors[0]);
		this.playerHighlight.beginFill(dStngs.highlightColors[1]);
		this.playerHighlight.drawRoundedRect(-20, -6, PANE_WID, LINE_HEI - 3, PANE_RND);
		this.playerHighlight.alpha = dStngs.highlightAlpha;
		this.playerHighlight.visible = false;

		this.fieldsContainer = new PIXI.Container();
		this.fieldsContainer.alpha = 0;
		this.fieldsMask = new PIXI.Graphics();
		this.fieldsContainer.mask = this.fieldsMask;
		this.fieldsContainer.addChild(this.playerHighlight);

		this.columns = dStngs.xPositions.length;
		this.tFields = [];
		this.tFieldsText = [];
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i] = new PIXI.Text('', {
				fontFamily: dStngs.fonts[2],
				fill: dStngs.fontColors[2],
				lineHeight: LINE_HEI,
				align: 'center',
				fontWeight: 'bold'
			});

			this.fieldsContainer.addChild(this.tFields[i]);
			this.tFields[i].x = dStngs.xPositions[i];
			this.tFieldsText[i] = '';
			this.tFields[i].anchor.set(0.5, 0);
		}
		this.addChild(this.fieldsContainer, this.fieldsMask);
		this.setupDisplay(dVars, dStngs);
	}

	setupDisplay(dVars:DisplayVars, dStngs:HSDisplaySettings) {
		this.fieldsMask.clear();
		this.fieldsMask.beginFill(0xffffff);
		this.fieldsMask.drawRect(-248, -8, 500, 230);
		// this.fieldsMask.drawRect(-248, -8, 500, 306);
		this.baseY = 0;
		this.fieldsContainer.position.set(FIELDS_X, this.baseY);
		this.setMinY();
		this.updateFontSizes(dVars, dStngs);
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i].resolution = dVars.textRes;
		}
	}

	updateFontSizes(dVars:DisplayVars, dStngs:HSDisplaySettings) {
		let fontSizes = dVars.orient === 0 ? dStngs.fontSizes : dStngs.fontSizesPort;
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i].style.fontSize = fontSizes[2];
		}
	}

	getFieldsY() {
		return this.fieldsContainer.y - this.baseY;
	}

	showPlayerHighlight(pPos:number) {
		this.playerHighlight.visible = true;
		this.playerHighlight.y = LINE_HEI * pPos;
		let off = pPos;
		if (off <= 4)off = 0;
		if (off > 4)off -= 4;
		this.fieldsContainer.y = this.baseY - LINE_HEI * off;
		if (this.fieldsContainer.y >= this.baseY) this.fieldsContainer.y = this.baseY;
		if (this.fieldsContainer.y <= this.minY) this.fieldsContainer.y = this.minY;
	}

	showLastYPosition(yOff:number) {
		this.playerHighlight.visible = false;
		this.fieldsContainer.y = this.baseY + yOff;
	}

	showScores(scoresSet:HSScoresLine[], dir:number, curSet:number) {
		this.displayScores(scoresSet, curSet);
		this.setMinY();
		this.fieldsContainer.x = FIELDS_X + (20 * dir);
		this.fieldsContainer.alpha = 0;
		this.linesTween = gsap.to([this.fieldsContainer], { duration: 0.4, alpha: 1, x: FIELDS_X });
	}

	displayScores(scoresSet:HSScoresLine[], curSet:number) {
		for (let i = 0; i < this.tFields.length; i++) this.tFieldsText[i] = '';
		this.rowsCount = scoresSet.length;
		if(this.lineType==='score'){
			for (let i = 0; i < this.rowsCount; i++) {
				let dateLine=this.getDateLine(scoresSet[i].dote,curSet);
				this.addScoreLine(i + 1, scoresSet[i], dateLine);
			}
		}
		for (let i = 0; i < this.tFields.length; i++) {
			this.tFields[i].text = this.tFieldsText[i];
		}
	}

	getDateLine(date:string,curSet:number){
		if (curSet !== 0) {
			let myDate = new Date(date);
			if (curSet === 1)return myDate.getFullYear().toString();
			let myMon = MONTH_TEXTS[myDate.getMonth()];
			let myDay = myDate.getDate();
			return myDay + '-' + myMon;
		} else {
			return date;
		}
	}

	setMinY() {
		if (this.rowsCount <= NUM_ROWS) {
			this.minY = this.baseY;
		} else {
			this.minY = this.baseY - ((this.rowsCount - NUM_ROWS) * LINE_HEI);
		}
	}

	scrollUp() {
		let curY = this.fieldsContainer.y;
		let tarY = curY + LINE_HEI;
		if (tarY >= this.baseY)tarY = this.baseY;
		this.fieldsContainer.y = tarY;
	}

	scrollDown() {
		let curY = this.fieldsContainer.y;
		let tarY = curY - LINE_HEI;
		if (tarY <= this.minY)tarY = this.minY;
		this.fieldsContainer.y = tarY;
	}

	init() {
		this.rowsCount = 0;
		this.fieldsContainer.position.set(FIELDS_X, this.baseY);
	}

	deit() {
	}

	addScoreLine(ind:number, scoreEntry:HSScoresLine, dateLine:string) {
		this.tFieldsText[0] += ind + '\r\n';
		this.tFieldsText[1] += scoreEntry.nom + '\r\n';
		this.tFieldsText[2] += scoreEntry.score + '\r\n';
		this.tFieldsText[3] += dateLine + '\r\n';
		this.tFieldsText[4] += scoreEntry.local + '\r\n';
	}
}

export default HighScoresTableLines;
