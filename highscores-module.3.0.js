'use strict';

var PIXI = require('pixi.js');
var gsap = require('gsap');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PIXI__default = /*#__PURE__*/_interopDefaultLegacy(PIXI);
var gsap__default = /*#__PURE__*/_interopDefaultLegacy(gsap);

const TITLE_TEXTS = ['Offline', 'All', '30 days', '7 days', '24 hours'];
const PANE_WID = 534;
const PANE_HEI = 440;
const PANE_RND = 48;
const TITLE_Y = -178;
const TITLES_X = -226;//this should match with FIELDS_X in HighScoresTableLines
const TITLES_Y = -129;

class HighScoresTable extends PIXI__default['default'].Container {
	constructor(displayVars, dStngs) {
		super();
		this.contentTitle = '';
		this.titlesContainer = new PIXI__default['default'].Container();
		this.backPane = new PIXI__default['default'].Graphics();
		this.drawBackPane(dStngs);
		this.titleText = new PIXI__default['default'].Text('title', { fontFamily: dStngs.fonts[0], fill: dStngs.fontColors[0], fontWeight: 'bold' });
		this.titleText.anchor.set(0.5);
		this.numColumns = dStngs.TITLE_LABELS.length;
		this.titles = [];
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i] = new PIXI__default['default'].Text(dStngs.TITLE_LABELS[i],
				{ fontFamily: dStngs.fonts[1], fill: dStngs.fontColors[1], align: 'center', fontWeight: 'bold' });
			this.titlesContainer.addChild(this.titles[i]);
			this.titles[i].x = dStngs.X_POS[i];
			this.titles[i].anchor.set(0.5);
		}
		this.titleText.position.set(0, TITLE_Y);
		this.titlesContainer.position.set(TITLES_X, TITLES_Y);

		this.addChild(this.backPane, this.titleText, this.titlesContainer);
		this.setupDisplay(displayVars, dStngs);
	}

	setupDisplay(displayVars, dStngs) {
		this.updateFontSizes(displayVars, dStngs);
		this.titleText.resolution = displayVars.textRes;
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i].resolution = displayVars.textRes;
		}
	}

	setContentTitle(title) { this.contentTitle = title; }

	drawBackPane(dStngs) {
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

	updateFontSizes(displayVars, dStngs) {
		let fontSizes = displayVars.orient === 0 ? dStngs.fontSizes : dStngs.fontSizesPort;
		this.titleText.style.fontSize = fontSizes[0];
		for (let i = 0; i < this.numColumns; i++) {
			this.titles[i].style.fontSize = fontSizes[1];
		}
	}

	updateTitle(curSet) {
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
		this.delta = 0;
	}

	deit() {
	}
}

const	MONTH_TEXTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LINE_HEI = 38;
const PANE_WID$1 = 496;
const PANE_RND$1 = 8;
const NUM_ROWS = 8;
const FIELDS_X = -226;

class HighScoresTableLines extends PIXI__default['default'].Container {
	constructor(displayVars, dSettings) {
		super();
		this.lineEntries = dSettings.LINE_ENTRIES;
		this.playerHighlight = new PIXI__default['default'].Graphics();

		this.linesTween = null;

		this.playerHighlight.lineStyle(1, dSettings.highlightColors[0]);
		this.playerHighlight.beginFill(dSettings.highlightColors[1]);
		this.playerHighlight.drawRoundedRect(-20, -6, PANE_WID$1, LINE_HEI - 3, PANE_RND$1);
		this.playerHighlight.alpha = dSettings.highlightAlpha;
		this.playerHighlight.visible = false;

		this.fieldsContainer = new PIXI__default['default'].Container();
		this.fieldsContainer.alpha = 0;
		this.fieldsMask = new PIXI__default['default'].Graphics();
		this.fieldsContainer.mask = this.fieldsMask;
		this.fieldsContainer.addChild(this.playerHighlight);

		this.columns = dSettings.X_POS.length;
		this.tFields = [];
		this.tFieldsText = [];
		for (let i = 0; i < this.columns; i++) {
			this.tFields[i] = new PIXI__default['default'].Text('', {
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
		this.linesTween = gsap__default['default'].to([this.fieldsContainer], { duration: 0.4, alpha: 1, x: FIELDS_X });
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

//this utils duplicates some functions in general/utils
//this is to keep the highscores stuff encapsulated and as indepdent from rest of code

function makeArrow(g, size, s, f) {
	g.clear();
	g.beginFill(f);
	g.lineStyle(1, s);
	g.arc(0, 0, size * 0.56, -1, 1);
	g.arc(-size, size, size * 0.40, 1, Math.PI);
	g.arc(-size, -size, size * 0.40, Math.PI, -1);
	g.closePath();
}

function makeRect(g, w, h, r, s, f) {
	g.clear();
	g.beginFill(f);
	g.lineStyle(1, s);
	g.drawRoundedRect(-w / 2, -h / 2, w, h, r);
}

function capitalizeFirst(inText) {
	return inText.charAt(0).toUpperCase() + inText.slice(1);
}

const INTERVAL_TIME = 20;

class HighScoresArrows extends PIXI__default['default'].Container {
	constructor(displayVars, displaySettings) {
		super();

		this.stopUp = this.stopUp.bind(this);
		this.stopDown = this.stopDown.bind(this);
		this.startUp = this.startUp.bind(this);
		this.startDown = this.startDown.bind(this);
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);

		this.myUpBut = new PIXI__default['default'].Container();
		this.myDownBut = new PIXI__default['default'].Container();

		this.myInterval = null;

		let myUpArrow = new PIXI__default['default'].Graphics();
		let myDownArrow = new PIXI__default['default'].Graphics();
		makeArrow(myUpArrow, 32, displaySettings.arrowColor, displaySettings.arrowColor);
		makeArrow(myDownArrow, 32, displaySettings.arrowColor, displaySettings.arrowColor);
		myUpArrow.rotation = -1.57;
		myDownArrow.rotation = 1.57;

		this.upRect = new PIXI__default['default'].Graphics();
		this.downRect = new PIXI__default['default'].Graphics();
		makeRect(this.upRect, 120, 80, 0, 0xffffff, 0xffffff);
		makeRect(this.downRect, 120, 80, 0, 0xffffff, 0xffffff);
		this.upRect.alpha = 0.01;
		this.downRect.alpha = 0.01;

		this.myUpBut.addChild(myUpArrow, this.upRect);
		this.myDownBut.addChild(myDownArrow, this.downRect);

		this.addChild(this.myUpBut, this.myDownBut);
		this.setupDisplay(displayVars, displaySettings);
	}

	setupDisplay(displayVars, displaySettings) {
		let yAdj = displayVars.orient === 0 ? displaySettings.adjustYs[0] : displaySettings.adjustYs[1];
		if (displayVars.orient === 0) {
			this.myUpBut.position.set(735, 180 + yAdj);
			this.myDownBut.position.set(735, 290 + yAdj);
			this.upRect.visible = false;
			this.downRect.visible = false;
		} else {
			this.myUpBut.position.set(275, 30 + yAdj);
			this.myDownBut.position.set(275, 578 + yAdj);
			this.upRect.visible = true;
			this.downRect.visible = true;
		}
	}

	startUp() {
		this.delta = 0;
		this.removeInterval();
		this.myInterval = setInterval(this.scrollUp, INTERVAL_TIME);
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
		this.myInterval = setInterval(this.scrollDown, INTERVAL_TIME);
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

class HighScoresSeqArrows extends PIXI__default['default'].Container {
	constructor(displaySettings) {
		super();

		this.carouselClick = this.carouselClick.bind(this);

		this.rArrow = new PIXI__default['default'].Container();
		this.lArrow = new PIXI__default['default'].Container();

		let rRect = new PIXI__default['default'].Graphics();
		let lRect = new PIXI__default['default'].Graphics();
		makeRect(rRect, 120, 80, 0, 0xffffff, 0xffffff);
		makeRect(lRect, 120, 80, 0, 0xffffff, 0xffffff);
		rRect.alpha = 0.01;
		lRect.alpha = 0.01;

		this.rArrow.addChild(rRect);
		this.lArrow.addChild(lRect);

		let rArr = this.drawArrow(12, '0xbbbbbb');
		let lArr = this.drawArrow(12, '0xbbbbbb');
		lArr.rotation = Math.PI;
		this.rArrow.dir = 'next';
		this.lArrow.dir = 'prev';

		this.rArrow.addChild(rArr);
		this.lArrow.addChild(lArr);

		this.rArrow.x = displaySettings.seqArrowsWidth / 2;
		this.lArrow.x = -displaySettings.seqArrowsWidth / 2;

		this.addChild(this.rArrow, this.lArrow);
	}

	hideArrows() {
		this.rArrow.visible = false;
		this.lArrow.visible = false;
	}

	showArrows() {
		this.rArrow.visible = true;
		this.lArrow.visible = true;
	}

	carouselClick(e) {
		if (e.currentTarget.dir === 'next') {
			this.emit('seqnext');
		} else {
			this.emit('seqprev');
		}
	}

	addLists() {
		this.rArrow.on('pointerup', this.carouselClick);
		this.lArrow.on('pointerup', this.carouselClick);
		this.rArrow.buttonMode = true;
		this.lArrow.buttonMode = true;
		this.rArrow.interactive = true;
		this.lArrow.interactive = true;
	}

	removeLists() {
		this.rArrow.off('pointerup');
		this.lArrow.off('pointerup');
		this.rArrow.buttonMode = false;
		this.lArrow.buttonMode = false;
		this.rArrow.interactive = false;
		this.lArrow.interactive = false;
	}

	drawArrow(size, color) {
		let outShape = new PIXI__default['default'].Graphics();
		outShape.beginFill(color);
		outShape.lineStyle(1, 0x888888);
		outShape.arc(0, 0, size * 0.56, -1, 1);
		outShape.arc(-size, size, size * 0.40, 1, Math.PI);
		outShape.arc(-size, -size, size * 0.40, Math.PI, -1);
		outShape.closePath();
		return outShape;
	}
}

class HighScoresScoresPane extends PIXI__default['default'].Container {
	constructor(displayVars, dSettings) {
		super();
		this.back = new PIXI__default['default'].Graphics();
		this.back.alpha = dSettings.scoresPaneAlpha;
		this.scoreDisp = new PIXI__default['default'].Text('0', {
			fontFamily: dSettings.fonts[2],
			fill: dSettings.fontColors[3],
			fontWeight: 'bold'
		});

		this.scoreLabel = new PIXI__default['default'].Text('label', {
			fontFamily: dSettings.fonts[2],
			fill: dSettings.fontColors[3],
			fontWeight: 'bold'
		});

		this.scoreLabel.anchor.set(0.5);
		this.scoreDisp.anchor.set(0.5);
		this.addChild(this.back, this.scoreLabel, this.scoreDisp);
		this.setupDisplay(displayVars, dSettings);
	}

	setupDisplay(displayVars, dSettings) {
		this.back.clear();
		let backWidth = 116;
		let backHeight = 80;
		if (displayVars.orient === 0) {
			this.scoreLabel.position.set(0, -10);
			this.scoreDisp.position.set(0, 15);
			this.scoreLabel.style.fontSize = dSettings.fontSizes[3];
			this.scoreDisp.style.fontSize = dSettings.fontSizes[3];
		} else {
			backWidth = 210;
			this.scoreLabel.position.set(-40, 0);
			this.scoreDisp.position.set(44, 0);
			this.scoreLabel.style.fontSize = dSettings.fontSizesPort[3];
			this.scoreDisp.style.fontSize = dSettings.fontSizesPort[3];
		}

		let w = backWidth;
		let h = backHeight;
		let r = 20;
		if (dSettings.scoresPaneMargin > 0) {
			this.back.lineStyle(1, dSettings.backPaneColors[0]);
			this.back.beginFill(dSettings.backPaneColors[1]);
			this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
			w -= dSettings.scoresPaneMargin;
			h -= dSettings.scoresPaneMargin;
			r -= Math.floor(dSettings.scoresPaneMargin / 3);
		}
		this.back.beginFill(dSettings.backPaneColors[3]);
		this.back.lineStyle(1, dSettings.backPaneColors[2]);
		this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);

		this.scoreLabel.resolution = displayVars.textRes;
		this.scoreDisp.resolution = displayVars.textRes;
	}

	setScores(label, score) {
		this.scoreLabel.text = capitalizeFirst(label);
		this.scoreDisp.text = score;
	}
}

const SWEARS_LIST = ['fuck', 'shit', 'dick', 'suck', 'cock', 'twat', 'gun', 'shoot', 'kill',
	'fock', 'bitch', 'penis', 'arse', 'nigger', 'vagina', 'cunt'];
const CANVAS_ID = 'myCanvas';//this is defined in display.js

class HighScoresEntryInputs extends PIXI__default['default'].Container {
	constructor(displayVars, dStngs) {
		super();
		this.myScale = displayVars.scale;
		this.visible = false;
		this.entryMaxLength = dStngs.entryMaxLength;
		this.bStyles = ['1px solid #bbbbbb', '1px solid #ffdd00'];
		this.offsetX = 0;
		this.offsetY = 0;

		this.cleanInputs = this.cleanInputs.bind(this);

		this.fieldTween1 = null;
		this.fieldTween2 = null;

		this.nDiv = document.createElement('input');
		this.nDiv.id = 'inputName';
		this.setInputStyle(this.nDiv, dStngs.fonts[2], dStngs.fontColors[5]);
		document.getElementById('containerDiv').appendChild(this.nDiv);
		this.lDiv = document.createElement('input');
		this.lDiv.id = 'inputLocal';
		this.setInputStyle(this.lDiv, dStngs.fonts[2], dStngs.fontColors[5]);
		document.getElementById('containerDiv').appendChild(this.lDiv);

		this.setupDisplay(displayVars, dStngs);
	}

	setupDisplay(displayVars, dStngs) {
		if (displayVars.orient === 0) {
			this.nameElemX = 0;
			this.nameElemY = -22;
			this.localElemX = 0;
			this.localElemY = 45;
			this.fieldWidth = 84;
			this.fieldHeight = 18;
			this.fontSizes = dStngs.fontSizes;
		} else {
			this.nameElemX = -1;
			this.nameElemY = -130;
			this.localElemX = -1;
			this.localElemY = -15;
			this.fieldWidth = 230;
			this.fieldHeight = 44;
			this.fontSizes = dStngs.fontSizesPort;
		}
	}

	displayChange(displayVars, dStngs) {
		this.setupDisplay(displayVars, dStngs);
	}

	updateInputs(displayVars) {
		this.myScale = displayVars.scale;
		if (this.visible) this.updateInputElements();
	}

	setInputOffsets(entryPaneX, entryPaneY) {
		this.offsetX = entryPaneX;
		this.offsetY = entryPaneY;
	}

	updateInputElements() {
		let wid = Math.round(this.fieldWidth * this.myScale);
		let hei = Math.round(this.fieldHeight * this.myScale);

		let newFontSize = Math.round(this.fontSizes[4] * this.myScale);
		newFontSize = Math.floor(newFontSize);
		this.nDiv.style.fontSize = newFontSize + 'px';
		this.lDiv.style.fontSize = newFontSize + 'px';
		this.nDiv.style.height = hei + 'px';
		this.lDiv.style.height = hei + 'px';
		this.nDiv.style.width = wid + 'px';
		this.lDiv.style.width = wid + 'px';

		let newPadding = Math.round(4 * this.myScale);
		this.nDiv.style.padding = newPadding + 'px 0px';
		this.lDiv.style.padding = newPadding + 'px 0px';

		let myCan = document.getElementById(CANVAS_ID);
		let myX = myCan.offsetLeft;
		let myY = myCan.offsetTop;

		let xPosName = Math.round(myX + (this.offsetX + this.nameElemX) * this.myScale - wid / 2);
		let yPosName = Math.round(myY + (this.offsetY + this.nameElemY) * this.myScale - hei / 2);
		let xPosLocal = Math.round(myX + (this.offsetX + this.localElemX) * this.myScale - wid / 2);
		let yPosLocal = Math.round(myY + (this.offsetY + this.localElemY) * this.myScale - hei / 2);

		this.nDiv.style.left = xPosName + 'px';
		this.nDiv.style.top = yPosName + 'px';
		this.lDiv.style.left = xPosLocal + 'px';
		this.lDiv.style.top = yPosLocal + 'px';
	}

	showFields(fadeIn) {
		this.visible = true;
		this.updateInputElements();
		document.querySelector('input').autofocus = true;
		this.nDiv.style.display = 'block';
		this.lDiv.style.display = 'block';
		if (fadeIn) {
			this.lDiv.style.opacity = 0;
			this.nDiv.style.opacity = 0;
			this.fieldTween1 = gsap__default['default'].to(this.lDiv, { delay: 0.3, duration: 0.4, opacity: 1 });
			this.fieldTween2 = gsap__default['default'].to(this.nDiv, { delay: 0.3, duration: 0.4, opacity: 1 });
		}
	}

	hideFields() {
		this.visible = false;
		this.nDiv.style.display = 'none';
		this.lDiv.style.display = 'none';
	}

	cleanInputs() {
		let max = this.entryMaxLength;
		let nom = this.nDiv.value;
		if (nom.length > max)nom = nom.slice(0, max);
		nom = nom.replace(/[^a-zA-Z ]/g, '');
		this.nDiv.value = nom;
		let loc = this.lDiv.value;
		if (loc.length > max)loc = loc.slice(0, max);
		loc = loc.replace(/[^a-zA-Z ]/g, '');
		this.lDiv.value = loc;
		if (nom.length > 0) this.nDiv.style.border = this.bStyles[0];
		if (loc.length > 0) this.lDiv.style.border = this.bStyles[0];
	}

	getInputs() {
		this.cleanInputs();
		let nom = this.nDiv.value;
		let loc = this.lDiv.value;
		nom = this.checkText(nom);
		loc = this.checkText(loc);
		this.nDiv.value = nom;
		this.lDiv.value = loc;
		if (loc.length === 0) this.lDiv.style.border = this.bStyles[1];
		if (nom.length === 0) this.nDiv.style.border = this.bStyles[1];
		return { nom, loc };
	}

	setInputStyle(div, fnt, fntCol) {
		div.setAttribute('type', 'text');
		div.setAttribute('maxlength', this.entryMaxLength);
		div.style.position = 'absolute';
		div.style.left = 0;
		div.style.top = 0;
		div.style.display = 'none';
		div.style.textAlign = 'center';
		div.style.fontFamily = fnt;
		div.style.color = fntCol;
		div.style.textDecoration = 'none';
		div.style.border = this.bStyles[0];
		div.style.borderRadius = '0.5em';
		div.style.outline = 'none';
		div.style.margin = '0px';
		div.style.padding = '4px 0px';
		div.style.zIndex = '4';
	}

	checkText(leText) {
		let outText = leText.slice(0, this.entryMaxLength);
		outText = outText.replace(/[^a-z]/gi, '');
		outText = outText.toLowerCase();
		for (let i = 0; i < SWEARS_LIST.length; i++) {
			let re = new RegExp(SWEARS_LIST[i], 'g');
			outText = outText.replace(re, '');
		}
		outText = outText.charAt(0).toUpperCase() + outText.slice(1);
		return outText;
	}

	init() {
		document.addEventListener('keyup', this.cleanInputs);
	}

	deit() {
		document.removeEventListener('keyup', this.cleanInputs);
	}
}

class HighScoresEntryPane extends PIXI__default['default'].Container {
	constructor(displayVars, dStngs) {
		super();
		this.visible = false;

		this.submitClick = this.submitClick.bind(this);
		this.enterClick = this.enterClick.bind(this);
		this.cancelClick = this.cancelClick.bind(this);

		this.back = new PIXI__default['default'].Graphics();
		this.back.alpha = dStngs.scoresPaneAlpha;
		this.backShade = new PIXI__default['default'].Graphics();
		this.submitBut = new PIXI__default['default'].Container();
		this.submitButBack = new PIXI__default['default'].Graphics();
		this.cancelBut = new PIXI__default['default'].Container();
		this.cancelButBack = new PIXI__default['default'].Graphics();
		this.enterBut = new PIXI__default['default'].Container();
		this.enterButBack = new PIXI__default['default'].Graphics();
		this.inputFields = new HighScoresEntryInputs(displayVars, dStngs);

		this.enterText = new PIXI__default['default'].Text('Enter', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });
		this.enterText.anchor.set(0.5);
		this.enterBut.cursor = 'pointer';
		this.enterBut.addChild(this.enterButBack, this.enterText);

		this.nameLabel = new PIXI__default['default'].Text('Name', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[3], fontWeight: 'bold' });
		this.localLabel = new PIXI__default['default'].Text('Location', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[3], fontWeight: 'bold' });
		this.submitText = new PIXI__default['default'].Text('Enter', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });
		this.cancelText = new PIXI__default['default'].Text('Cancel', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });

		this.submitText.anchor.set(0.5);
		this.cancelText.anchor.set(0.5);
		this.nameLabel.anchor.set(0.5);
		this.localLabel.anchor.set(0.5);

		this.submitBut.cursor = 'pointer';
		this.submitBut.addChild(this.submitButBack, this.submitText);
		this.cancelBut.cursor = 'pointer';
		this.cancelBut.addChild(this.cancelButBack, this.cancelText);

		this.addChild(this.enterBut, this.backShade, this.back, this.submitBut, this.cancelBut);
		this.addChild(this.nameLabel, this.localLabel, this.inputFields);

		this.setupDisplay(displayVars, dStngs);
	}

	setupDisplay(displayVars, dStngs) {
		this.orient = displayVars.orient;
		if (displayVars.orient === 0) {
			this.submitBut.position.set(0, 110);
			this.nameLabel.position.set(0, -48);
			this.localLabel.position.set(0, 18);
		} else {
			this.submitBut.position.set(-0, 85);
			this.nameLabel.position.set(-0, -180);
			this.localLabel.position.set(0, -65);
			this.cancelBut.position.set(0, 165);
			this.enterBut.position.set(115, 250);
		}
		this.setupBack(displayVars, dStngs);
		this.setupButs(displayVars, dStngs);
		this.setupFonts(displayVars, dStngs);
	}

	displayChange(displayVars, dStngs) {
		this.setupDisplay(displayVars, dStngs);
		this.inputFields.displayChange(displayVars, dStngs);
		if (this.visible) this.show();
	}

	updateInputs(displayVars) {
		this.inputFields.updateInputs(displayVars);
	}

	setInputOffsets(entryPaneX, entryPaneY) {
		this.inputFields.setInputOffsets(entryPaneX, entryPaneY);
	}

	setupBack(displayVars, dStngs) {
		let w = displayVars.orient === 0 ? 116 : 340;
		let h = displayVars.orient === 0 ? 160 : 470;
		let r = displayVars.orient === 0 ? 22 : 36;
		this.back.clear();
		if (dStngs.scoresPaneMargin > 0) {
			this.back.beginFill(dStngs.backPaneColors[1]);
			this.back.lineStyle(1, dStngs.backPaneColors[0]);
			this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
			w -= dStngs.scoresPaneMargin;
			h -= dStngs.scoresPaneMargin;
			r -= Math.floor(dStngs.scoresPaneMargin / 3);
		}
		this.back.lineStyle(1, dStngs.backPaneColors[2]);
		this.back.beginFill(dStngs.backPaneColors[3]);
		this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
	}

	setupButs(displayVars, dStngs) {
		let w = displayVars.orient === 0 ? 112 : 260;
		let h = displayVars.orient === 0 ? 44 : 72;
		let r = displayVars.orient === 0 ? 16 : 20;
		this.submitButBack.clear();
		this.submitButBack.beginFill(0xffff88);
		if (dStngs.submitBorder > 0) this.submitButBack.lineStyle(1, 0xaaaaaa);
		this.submitButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		this.cancelButBack.clear();
		this.cancelButBack.beginFill(0xcccccc);
		this.cancelButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		w = 210;
		h = 75;
		this.enterButBack.clear();
		this.enterButBack.beginFill(0xffff88);
		if (dStngs.submitBorder > 0) this.enterButBack.lineStyle(1, 0xaaaaaa);
		this.enterButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		w = dStngs.entryShadeWidth;
		this.backShade.clear();
		this.backShade.beginFill(0x000000);
		this.backShade.drawRect(-w / 2, -400, w, 800);
		this.backShade.alpha = 0.6;
	}

	setupFonts(displayVars, dStngs) {
		let fontSizes = displayVars.orient === 0 ? dStngs.fontSizes : dStngs.fontSizesPort;
		this.enterText.style.fontSize = fontSizes[4];
		this.nameLabel.style.fontSize = fontSizes[3];
		this.localLabel.style.fontSize = fontSizes[3];
		this.submitText.style.fontSize = fontSizes[4];
		this.cancelText.style.fontSize = fontSizes[4];
		this.enterText.resolution = displayVars.textRes;
		this.nameLabel.resolution = displayVars.textRes;
		this.localLabel.resolution = displayVars.textRes;
		this.submitText.resolution = displayVars.textRes;
		this.cancelText.resolution = displayVars.textRes;
	}

	submitClick() {
		let inputs = this.inputFields.getInputs();
		if (inputs.nom.length > 0 && inputs.loc.length > 0) {
			this.hide();//this is important to prevent double clicks
			this.emit('submitclick', inputs.nom, inputs.loc);
		}
	}

	cancelClick() {
		this.toggleEntryPane(false);
	}

	enterClick() {
		this.toggleEntryPane(true);
	}

	show() {
		this.visible = true;
		if (this.orient === 0) {
			this.showLand();
		} else {
			this.showPort();
		}
		//stuff here
		//remember, this is typically called b4 init
	}

	hide() {
		this.visible = false;
		this.inputFields.hideFields();
	}

	showLand() {
		this.back.visible = true;
		this.submitBut.visible = true;
		this.nameLabel.visible = true;
		this.localLabel.visible = true;
		this.backShade.visible = false;
		this.enterBut.visible = false;
		this.cancelBut.visible = false;
		this.inputFields.showFields(true);
	}

	showPort() {
		this.enterBut.visible = true;
		this.back.visible = false;
		this.nameLabel.visible = false;
		this.localLabel.visible = false;
		this.submitBut.visible = false;
		this.cancelBut.visible = false;
		this.backShade.visible = false;
		this.inputFields.hideFields();
	}

	toggleEntryPane(showBool) {
		let myBool = showBool;
		this.back.visible = myBool;
		this.cancelBut.visible = myBool;
		this.submitBut.visible = myBool;
		this.nameLabel.visible = myBool;
		this.localLabel.visible = myBool;
		this.backShade.visible = myBool;
		if (showBool) {
			this.inputFields.showFields(false);
		} else {
			this.inputFields.hideFields();
		}
	}

	init() {
		document.addEventListener('keyup', this.keyPress);
		this.submitBut.on('pointerup', this.submitClick);
		this.cancelBut.on('pointerup', this.cancelClick);
		this.enterBut.on('pointerup', this.enterClick);
		this.backShade.on('pointerup', this.cancelClick);

		this.submitBut.interactive = true;
		this.cancelBut.interactive = true;
		this.enterBut.interactive = true;
		this.submitBut.buttonMode = true;

		this.inputFields.init();
	}

	deit() {
		this.submitBut.off('pointerup');
		this.cancelBut.off('pointerup');
		this.enterBut.off('pointerup');
		this.backShade.off('pointerup');

		this.submitBut.interactive = false;
		this.cancelBut.interactive = false;
		this.enterBut.interactive = false;
		this.submitBut.buttonMode = false;

		this.inputFields.deit();
	}
}

const SEQ_LIM = 30;//bounds for set sequence timer
const SEQ_START = 12;
const SEQ_LOW = -10;

class HighScoresView extends PIXI__default['default'].Container {
	constructor(displayVars, scores, settings, displaySettings) {
		super();
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
		this.seqNext = this.seqNext.bind(this);
		this.seqPrev = this.seqPrev.bind(this);
		this.myCounter = this.myCounter.bind(this);
		this.submitClick = this.submitClick.bind(this);

		this.orient = displayVars.orient;
		this.scores = scores;
		this.displaySettings = displaySettings;
		this.active = false;

		this.playerPositions = [null, null, null, null, null];

		this.scoresReceived = false;
		this.submitSent = false;
		this.displayInd = 0;
		this.displaySeq = [0];
		this.incDisplayInd = true;
		this.showEntryPaneFlag = false;
		this.myTimer = null;
		this.yOffs = [];

		this.highScoresTable = new HighScoresTable(displayVars, displaySettings);
		this.highScoresTableLines = new HighScoresTableLines(displayVars, displaySettings);
		this.highScoresScoresPane = new HighScoresScoresPane(displayVars, displaySettings);
		this.highScoresArrows = new HighScoresArrows(displayVars, displaySettings);
		this.highScoresSeqArrows = new HighScoresSeqArrows(displaySettings);
		this.highScoresEntryPane = new HighScoresEntryPane(displayVars, displaySettings);

		this.highScoresEntryPane.alpha = 0;
		this.highScoresScoresPane.alpha = 0;
		this.fadeInEntry = gsap__default['default'].to(this.highScoresEntryPane, { delay: 0.2, duration: 0.5, alpha: 1 });
		this.fadeInScores = gsap__default['default'].to(this.highScoresScoresPane, { delay: 0.2, duration: 0.5, alpha: 1 });

		this.addChild(this.highScoresTable, this.highScoresTableLines, this.highScoresArrows);
		this.addChild(this.highScoresSeqArrows, this.highScoresScoresPane);
		this.addChild(this.highScoresEntryPane);

		this.setupDisplay(displayVars);
	}

	setupDisplay(displayVars) {
		let xPos = displayVars.orient === 0 ? 400 : 275;
		let yPos = displayVars.orient === 0 ? 228 : 304;
		yPos += this.displaySettings.adjustYs[displayVars.orient];
		this.highScoresTable.position.set(xPos, yPos);
		this.highScoresTableLines.position.set(xPos, yPos - 97);
		this.highScoresSeqArrows.position.set(xPos, yPos - 178);
		let entryPaneX = displayVars.orient === 0 ? 68 : 275;
		let entryPaneY = displayVars.orient === 0 ? yPos + 25 : 400;
		this.highScoresEntryPane.position.set(entryPaneX, entryPaneY);
		this.highScoresEntryPane.setInputOffsets(entryPaneX, entryPaneY);
		this.positionScoresPane();
	}

	displayChange(displayVars) {
		this.orient = displayVars.orient;
		this.setupDisplay(displayVars);
		this.highScoresTable.setupDisplay(displayVars, this.displaySettings);
		this.highScoresTableLines.setupDisplay(displayVars, this.displaySettings);
		this.highScoresArrows.setupDisplay(displayVars, this.displaySettings);
		this.highScoresScoresPane.setupDisplay(displayVars, this.displaySettings);
		this.highScoresEntryPane.displayChange(displayVars, this.displaySettings);
	}

	updateInputs(displayVars) {
		this.highScoresEntryPane.updateInputs(displayVars);
	}

	positionScoresPane() {
		if (this.orient === 0) {
			this.highScoresScoresPane.x = 68;
			this.highScoresScoresPane.y = this.highScoresTable.y;
			if (this.highScoresEntryPane.visible) this.highScoresScoresPane.y -= 105;
		} else {
			this.highScoresScoresPane.x = this.highScoresEntryPane.visible ? 163 : 275;
			this.highScoresScoresPane.y = 650;
		}
	}

	setContentTitle(title) { this.highScoresTable.setContentTitle(title); }

	setPlayerPosition(ind, pos) {	this.playerPositions[ind] = pos; }

	getPlayerPosition(ind) { return this.playerPositions[ind]; }

	setScoresPane(label, score) {
		this.highScoresScoresPane.setScores(label, score);
	}

	gettingScores() {
		this.scoresReceived = false;
		this.submitSent = false;
	}

	setDisplaySeq(displaySeq) {
		this.displaySeq = displaySeq;
	}

	gotScores() {
		this.scoresReceived = true;
		this.displayInd = this.displaySeq.length - 1;
		if (this.submitSent) {
			this.resetCounter();
			if (this.active) this.showScores(0);
		} else {
			this.showEntryPaneFlag = true;
			this.incDisplayInd = false;
		}
	}

	updateSeq(add) {
		this.storeYOff();
		let tmp = -1;
		if (this.incDisplayInd) {
			tmp = this.displayInd;
			this.displayInd += add;
		}
		this.incDisplayInd = true;
		if (this.displayInd < 0) this.displayInd = this.displaySeq.length - 1;
		if (this.displayInd === this.displaySeq.length) this.displayInd = 0;
		if (this.displayInd !== tmp) this.showScores(add);
	}

	showScores(dir) {
		let curSet = this.displaySeq[this.displayInd];
		this.highScoresTableLines.showScores(this.scores[curSet], dir, curSet);
		let pPos = this.playerPositions[this.displaySeq[this.displayInd]];
		if (pPos !== null) { //always return y position to place where player score shows
			this.highScoresTableLines.showPlayerHighlight(pPos);
		} else {
			this.highScoresTableLines.showLastYPosition(this.yOffs[this.displayInd]);
		}
		this.highScoresTable.updateTitle(curSet);
		if (this.displaySeq.length !== 1) {
			this.highScoresSeqArrows.visible = true;
		} else {
			this.highScoresSeqArrows.visible = false;
		}
		if (this.showEntryPaneFlag) this.showEntryPane();
	}

	showEntryPane() {
		this.showEntryPaneFlag = false;
		//got scores for first time, so can have entrypane display input stuff
		this.highScoresEntryPane.show();
		this.positionScoresPane();
		this.fadeInEntry.restart(true, false);
		this.fadeInScores.restart(true, false);
	}

	submitClick(nom, loc) {
		this.submitSent = true;
		this.positionScoresPane();
		this.fadeInScores.restart(true, false);
		this.emit('submitclick', nom, loc);
	}

	isSubmitSent() {
		return this.submitSent;
	}

	storeYOff() {
		this.yOffs[this.displayInd] = this.highScoresTableLines.getFieldsY();
	}

	scrollUp() {
		this.highScoresTableLines.scrollUp();
		this.timerCount = SEQ_LOW;
	}

	scrollDown() {
		this.highScoresTableLines.scrollDown();
		this.timerCount = SEQ_LOW;
	}

	seqNext() {
		this.updateSeq(1);
		this.stopTimer();
	}

	seqPrev() {
		this.updateSeq(-1);
		this.stopTimer();
	}

	stopTimer() {
		if (this.myTimer !== null) {
			clearTimeout(this.myTimer);
			this.myTimer = null;
		}
	}

	myCounter() {
		this.timerCount += 1;
		if (this.timerCount >= SEQ_LIM && this.scoresReceived) {
			this.timerCount = 0;
			this.updateSeq(1);
		}
		this.myTimer = setTimeout(this.myCounter, 200);
	}

	resetCounter() {
		this.timerCount = 0;
	}

	init() {
		this.active = true;
		this.incDisplayInd = true;
		this.yOffs = [0, 0, 0];
		this.submitSent = false;

		if (!this.scoresReceived) {
			this.displaySeq = [0];//offline
			this.displayInd = 0;
		}

		this.highScoresArrows.addLists();
		this.highScoresSeqArrows.addLists();
		this.highScoresArrows.on('scrollup', this.scrollUp);
		this.highScoresArrows.on('scrolldown', this.scrollDown);
		this.highScoresSeqArrows.on('seqnext', this.seqNext);
		this.highScoresSeqArrows.on('seqprev', this.seqPrev);

		this.highScoresTable.init();
		this.highScoresTableLines.init();
		this.highScoresEntryPane.init();
		this.highScoresEntryPane.on('submitclick', this.submitClick);

		this.timerCount = SEQ_START;
		this.highScoresEntryPane.hide();//this.showScores(0) will typically show this

		this.positionScoresPane();
		this.showScores(0);
		this.myCounter();
	}

	deit() {
		this.active = false;
		this.showEntryPaneFlag = false;
		this.highScoresArrows.removeLists();
		this.highScoresSeqArrows.removeLists();
		this.highScoresArrows.off('scrollup');
		this.highScoresArrows.off('scrolldown');
		this.highScoresSeqArrows.off('seqnext');
		this.highScoresSeqArrows.off('seqprev');
		this.highScoresTable.deit();
		this.highScoresTableLines.deit();
		this.highScoresEntryPane.deit();
		this.highScoresEntryPane.hide();
		this.highScoresEntryPane.off('submitclick');
		this.stopTimer();
	}
}

class HighScoresLoader extends PIXI__default['default'].utils.EventEmitter {
	constructor(settings) {
		super();
		this.settings = settings;
		this.gotScores = this.gotScores.bind(this);
		this.myReq = null;
	}

	getScores(sendPlayerData, gameData) {
		if (this.myReq !== null) {
			this.myReq.removeEventListener('readystatechange', this.gotScores);
			this.myReq = null;
		}
		this.myReq = new XMLHttpRequest();
		this.myReq.addEventListener('readystatechange', this.gotScores);
		this.myReq.open('POST', this.settings.URL, true);
		this.myReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		let mylets = this.makePostlets(sendPlayerData, gameData);
		this.myReq.send(mylets);
	}

	gotScores() {
		if (this.myReq.readyState === 4 && this.myReq.status === 200) {
			let parsed = null;
			try {
				parsed = JSON.parse(this.myReq.responseText);
			} catch (e) {
				parsed = null;
				console.log('error - could not parse response ', e);
			}
			if (parsed !== null) this.emit('gotscores', parsed);
			this.myReq.removeEventListener('readystatechange', this.gotScores);
			this.myReq = null;
		}
	}

	makePostlets(sendPlayerData, gameData) {
		let sendOb = {};
		sendOb.meta = {};
		sendOb.meta.reqType = 'scores';
		sendOb.meta.srcType = 'online';
		sendOb.meta.insert = sendPlayerData;
		sendOb.meta.table = this.settings.SCORES_TABLE;
		sendOb.meta.gameType = this.settings.TABLE_TYPE;
		if (gameData.contentCode !== null)sendOb.meta.content = gameData.contentCode;
		if (sendPlayerData) {
			sendOb.scoreLine = {};
			sendOb.scoreLine.nom = gameData.playerName;
			sendOb.scoreLine.local = gameData.playerLocation;
			sendOb.scoreLine.score = gameData.score;
			sendOb.scoreLine.time = gameData.time;
			sendOb.scoreLine.moves = gameData.moves;
			if (gameData.contentCode !== null)sendOb.scoreLine.content = sendOb.meta.content;
		}
		return JSON.stringify(sendOb);
	}
}

class HighScores extends PIXI__default['default'].Container {
	constructor(displayVars, scores, settings, displaySettings) {
		super();
		this.submitClick = this.submitClick.bind(this);
		this.gotScores = this.gotScores.bind(this);
		this.scores = scores;
		this.settings = settings;
		this.gameData = {
			score: 0, time: 0, moves: 0, contentCode: null, contentTitle: '', playerName: 'You', playerLocation: 'Home', maxScore: 0
		};
		this.highScoresView = new HighScoresView(displayVars, scores, settings, displaySettings);
		this.highScoresLoader = new HighScoresLoader(settings);
		this.highScoresLoader.on('gotscores', this.gotScores);
		this.addChild(this.highScoresView);
	}

	displayChange(displayVars) {
		this.highScoresView.displayChange(displayVars);
	}

	updateInputs(displayVars) {
		this.highScoresView.updateInputs(displayVars);
	}

	getScores() {
		this.highScoresView.gettingScores();
		this.highScoresLoader.getScores(false, this.gameData);
	}

	gotScores(responseText) {
		this.processJson(responseText);
		let dSeq = this.getDisplaySeq();
		if (this.highScoresView.isSubmitSent()) this.ensurePlayerShowing(dSeq);
		this.highScoresView.setDisplaySeq(dSeq);
		this.highScoresView.gotScores();
	}

	setPlayerScores(score1, score2) {
		this.gameData[this.settings.SCORE_TYPE[0]] = score1;
		this.gameData[this.settings.SCORE_TYPE[1]] = score2;
		this.highScoresView.setScoresPane(this.settings.SCORE_TYPE[0], score1);
		this.addPlayerToOfflineScores();
	}

	setGameData(data) {
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			this.gameData[keys[i]] = data[keys[i]];
			if (keys[i] === 'contentTitle') this.highScoresView.setContentTitle(data[keys[i]]);
		}
	}

	getDisplaySeq() { //determines which sets of scores to display - all, monthly, weekly or 24hrs
		if (this.scores[2].length < 5) return [1];//just all
		if (this.scores[4].length > 4) return [1, 2, 4];//all, monthly, 24hrs
		if (this.scores[3].length > 4) return [1, 2, 3];//all, monthly, weekly
		return [1, 2];//all & monthly
	}

	submitClick(nom, loc) {
		this.gameData.playerName = nom;
		this.gameData.playerLocation = loc;
		this.highScoresLoader.getScores(true, this.gameData);
	}

	processJson(responseText) {
		let myJson = responseText.response;
		let userId = responseText.userInsert;
		let lim = 50;
		let times = [0, 0, 0, 0, 0];
		let pPos = [null, null, null, null, null];

		let now = new Date();
		now.setDate(now.getDate() - 1);
		times[4] = now.getTime();
		now.setDate(now.getDate() - 6);
		times[3] = now.getTime();
		now.setDate(now.getDate() - 23);
		times[2] = now.getTime();

		for (let j = 1; j < 5; j++) this.scores[j] = [];

		for (let i = 0; i < myJson.length; i++) {
			if (myJson[i].score > this.gameData.maxScore)myJson[i].score = this.gameData.maxScore;//remove cheaters
			let uMatch = userId === myJson[i].id;
			let leDate = new Date(myJson[i].dote);
			let uTime = leDate.getTime();
			for (let j = 1; j < 5; j++) {
				if (this.scores[j].length < lim && uTime > times[j]) {
					if (uMatch) pPos[j] = this.scores[j].length;
					this.scores[j].push(myJson[i]);
				}
			}
		}
		for (let i = 1; i < pPos.length; i++) this.highScoresView.setPlayerPosition(i, pPos[i]);
	}

	addPlayerToOfflineScores() {
		this.scores[0][7] = this.makePlayerLine(false);
		this.scores[0].sort(this.compare.bind(this));
		let pPos = this.scores[0].map((e) => e.nom).indexOf('You');
		this.highScoresView.setPlayerPosition(0, pPos);
	}

	ensurePlayerShowing(dSeq) {
		let sInd = dSeq[dSeq.length - 1];
		if (this.highScoresView.getPlayerPosition(sInd) === null) {
			this.scores[sInd][49] = this.makePlayerLine(true);
			this.highScoresView.setPlayerPosition(sInd, 49);
		}
	}

	makePlayerLine(fullYear) {
		let myDate = new Date();
		let line = {};
		line.dote = fullYear ? myDate : myDate.getFullYear();
		line.nom = this.gameData.playerName;
		line.local = this.gameData.playerLocation;
		//check this
		let sType = this.settings.SCORE_TYPE;
		line[sType[0]] = this.gameData[sType[0]];
		if (sType.length > 1) line[sType[1]] = this.gameData[sType[1]];
		return line;
	}

	compare(a, b) {
		let ret = [1, -1];//descending
		let sType = this.settings.SCORE_TYPE[0];
		if (sType === 'score')ret = [-1, 1];//ascending
		if (a[sType] > b[sType]) return ret[0];
		if (a[sType] < b[sType]) return ret[1];
		if (this.settings.SCORE_TYPE.length > 1) {
			ret = [1, -1];
			sType = this.settings.SCORE_TYPE[1];
			if (sType === 'score')ret = [-1, 1];
			if (a[sType] > b[sType]) return ret[0];
			if (a[sType] < b[sType])	return ret[1];
		}
		return 0;
	}

	init() {
		this.highScoresView.init();
		this.highScoresView.on('submitclick', this.submitClick);
	}

	deit() {
		this.highScoresView.deit();
		this.highScoresView.off('submitclick');
	}
}

module.exports = HighScores;
