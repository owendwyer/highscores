import PIXI from 'pixi.js';
import gsap from 'gsap';
import HighScoresTable from './highscorestable';
import HighScoresTableLines from './highscorestablelines';
import HighScoresArrows from './highscoresarrows';
import HighScoresSeqArrows from './highscoresseqarrows';
import HighScoresScoresPane from './highscoresscorespane';
import HighScoresEntryPane from './highscoresentrypane';

const SEQ_LIM = 30;//bounds for set sequence timer
const SEQ_START = 12;
const SEQ_LOW = -10;

class HighScoresView extends PIXI.Container {
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
		this.fadeInEntry = gsap.to(this.highScoresEntryPane, { delay: 0.2, duration: 0.5, alpha: 1 });
		this.fadeInScores = gsap.to(this.highScoresScoresPane, { delay: 0.2, duration: 0.5, alpha: 1 });

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

export default HighScoresView;
