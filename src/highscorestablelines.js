import PIXI from 'pixi.js';
import gsap from 'gsap';

const	MONTH_TEXTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LINE_HEI = 38;
const PANE_WID = 496;
const PANE_RND = 8;
const NUM_ROWS = 8;
const FIELDS_X = -226;

class HighScoresTableLines extends PIXI.Container {
	constructor(displayVars, dSettings) {
		super();
		this.lineEntries = dSettings.LINE_ENTRIES;
		this.playerHighlight = new PIXI.Graphics();

		this.linesTween = null;

		this.playerHighlight.lineStyle(1, dSettings.highlightColors[0]);
		this.playerHighlight.beginFill(dSettings.highlightColors[1]);
		this.playerHighlight.drawRoundedRect(-20, -6, PANE_WID, LINE_HEI - 3, PANE_RND);
		this.playerHighlight.alpha = dSettings.highlightAlpha;
		this.playerHighlight.visible = false;

		this.fieldsContainer = new PIXI.Container();
		this.fieldsContainer.alpha = 0;
		this.fieldsMask = new PIXI.Graphics();
		this.fieldsContainer.mask = this.fieldsMask;
		this.fieldsContainer.addChild(this.playerHighlight);

		this.columns = dSettings.X_POS.length;
		this.tFields = [];
		this.tFieldsText = [];
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i] = new PIXI.Text('', {
				fontFamily: dSettings.fonts[2],
				fill: dSettings.fontColors[2],
				lineHeight: LINE_HEI,
				align: 'center',
				fontWeight: 'bold'
			});

			this.fieldsContainer.addChild(this.tFields[i]);
			this.tFields[i].x = dSettings.X_POS[i];
			this.tFieldsText[i] = '';
			this.tFields[i].anchor.set(0.5, 0);
		}
		this.addChild(this.fieldsContainer, this.fieldsMask);
		this.setupDisplay(displayVars, dSettings);
	}

	setupDisplay(displayVars, dSettings) {
		this.fieldsMask.clear();
		this.fieldsMask.beginFill(0xffffff);
		this.fieldsMask.drawRect(-248, -8, 500, 306);
		this.baseY = 0;
		this.fieldsContainer.position.set(FIELDS_X, this.baseY);
		this.setMinY();
		this.updateFontSizes(displayVars, dSettings);
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i].resolution = displayVars.textRes;
		}
	}

	updateFontSizes(displayVars, dSettings) {
		let fontSizes = displayVars.orient === 0 ? dSettings.fontSizes : dSettings.fontSizesPort;
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i].style.fontSize = fontSizes[2];
		}
	}

	getFieldsY() {
		return this.fieldsContainer.y - this.baseY;
	}

	showPlayerHighlight(pPos) {
		this.playerHighlight.visible = true;
		this.playerHighlight.y = LINE_HEI * pPos;
		let off = pPos;
		if (off <= 4)off = 0;
		if (off > 4)off -= 4;
		this.fieldsContainer.y = this.baseY - LINE_HEI * off;
		if (this.fieldsContainer.y >= this.baseY) this.fieldsContainer.y = this.baseY;
		if (this.fieldsContainer.y <= this.minY) this.fieldsContainer.y = this.minY;
	}

	showLastYPosition(yOff) {
		this.playerHighlight.visible = false;
		this.fieldsContainer.y = this.baseY + yOff;
	}

	showScores(sJson, dir, curSet) {
		this.displayScores(sJson, curSet);
		this.setMinY();
		this.fieldsContainer.x = FIELDS_X + (20 * dir);
		this.fieldsContainer.alpha = 0;
		this.linesTween = gsap.to([this.fieldsContainer], { duration: 0.4, alpha: 1, x: FIELDS_X });
	}

	displayScores(sJson, curSet) {
		for (let i = 0; i < this.tFields.length; i++) this.tFieldsText[i] = '';
		this.rowsCount = sJson.length;
		for (let i = 0; i < this.rowsCount; i++) {
			let dateLine = '';
			if (curSet !== 0) {
				let myDate = new Date(sJson[i].dote);
				let myMon = MONTH_TEXTS[myDate.getMonth()];
				let myDay = myDate.getDate();
				dateLine = myDay + '-' + myMon;
				if (curSet === 1)dateLine = myDate.getFullYear();
			} else {
				dateLine = sJson[i].dote;
			}
			this.addLineFun(i + 1, sJson[i], dateLine);
		}
		for (let i = 0; i < this.tFields.length; i++) {
			this.tFields[i].text = this.tFieldsText[i];
		}
	}

	setMinY() {
		if (this.rowsCount <= NUM_ROWS) {
			this.minY = this.baseY;
		} else {
			this.minY = this.baseY - ((this.rowsCount - 8) * LINE_HEI);
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

	addLineFun(ind, scoreEntry, dateLine) {
		this.tFieldsText[0] += ind + '\r\n';
		for (let i = 1; i < this.lineEntries.length; i++) {
			if (this.lineEntries[i] === 'date') this.tFieldsText[i] += dateLine + '\r\n';
			else this.tFieldsText[i] += scoreEntry[this.lineEntries[i]] + '\r\n';
		}
	}
}

export default HighScoresTableLines;
