import PIXI from 'pixi.js';
import gsap from 'gsap';
import HighScoresTable from './highscorestable';
import HighScoresTableLines from './highscorestablelines';
import HighScoresArrows from './highscoresarrows';
import HighScoresSeqArrows from './highscoresseqarrows';
import HighScoresScoresPane from './highscoresscorespane';
import HighScoresEntryPane from './highscoresentrypane';
import {DisplayVars, HSSettings, HSDisplaySettings, HSObject} from './highscorestypes';

class HighScoresView extends PIXI.Container {

	private SEQ_LIM = 30;//bounds for set sequence timer
	private SEQ_START = 12;
	private SEQ_LOW = -10;

	private orient:number;
	private scores:HSObject;
	private dSettings:HSDisplaySettings;
	private active:boolean=false;
	private scoresReceived:boolean=false;
	private submitSent:boolean=false;
	private displayInd:number=0;
	private playerPositions:number[];
	private displaySeq:number[]=[0];
	private incDisplayInd:boolean=true;
	private showEntryPaneFlag:boolean=false;
	private myTimer:number|null=null;
	private yOffs:number[]=[];
	private timerCount:number=0;

	private fadeInEntry:GSAPTween;
	private fadeInScores:GSAPTween;

	private highScoresTable:HighScoresTable;
	private highScoresTableLines:HighScoresTableLines;
	private highScoresScoresPane:HighScoresScoresPane;
	private highScoresArrows:HighScoresArrows;
	private highScoresSeqArrows:HighScoresSeqArrows;
	private highScoresEntryPane:HighScoresEntryPane;

	constructor(dVars:DisplayVars, scores:HSObject, settings:HSSettings, dSettings:HSDisplaySettings) {
		super();
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
		this.seqNext = this.seqNext.bind(this);
		this.seqPrev = this.seqPrev.bind(this);
		this.myCounter = this.myCounter.bind(this);
		this.submitClick = this.submitClick.bind(this);

		this.orient = dVars.orient;
		this.scores = scores;
		this.dSettings = dSettings;

		this.playerPositions = [-1, -1, -1, -1, -1];

		this.highScoresTable = new HighScoresTable(dVars, dSettings);
		this.highScoresTableLines = new HighScoresTableLines(dVars, settings, dSettings);
		this.highScoresScoresPane = new HighScoresScoresPane(dVars, dSettings);
		this.highScoresArrows = new HighScoresArrows(dVars, dSettings);
		this.highScoresSeqArrows = new HighScoresSeqArrows(dSettings);
		this.highScoresEntryPane = new HighScoresEntryPane(dVars, dSettings);

		this.highScoresEntryPane.alpha = 0;
		this.highScoresScoresPane.alpha = 0;
		this.fadeInEntry = gsap.to(this.highScoresEntryPane, { delay: 0.2, duration: 0.5, alpha: 1 });
		this.fadeInScores = gsap.to(this.highScoresScoresPane, { delay: 0.2, duration: 0.5, alpha: 1 });

		this.addChild(this.highScoresTable, this.highScoresTableLines, this.highScoresArrows);
		this.addChild(this.highScoresSeqArrows, this.highScoresScoresPane);
		this.addChild(this.highScoresEntryPane);

		this.setupDisplay(dVars);
	}

	setupDisplay(dVars:DisplayVars) {
		let xPos = dVars.orient === 0 ? 400 : 275;
		// let yPos = dVars.orient === 0 ? 228 : 304;
		// let yPos = dVars.orient === 0 ? 190 : 304;
		let yPos = dVars.orient === 0 ? 210 : 274;
		yPos += this.dSettings.adjustYs[dVars.orient];
		this.highScoresTable.position.set(xPos, yPos);
		this.highScoresTableLines.position.set(xPos, yPos - 59);
		this.highScoresSeqArrows.position.set(xPos, yPos - 140);
		let entryPaneX = dVars.orient === 0 ? 68 : 275;
		let entryPaneY = dVars.orient === 0 ? yPos + 25 : 400;
		this.highScoresEntryPane.position.set(entryPaneX, entryPaneY);
		this.highScoresEntryPane.setInputOffsets(entryPaneX, entryPaneY);
		this.positionScoresPane();
	}

	displayChange(dVars:DisplayVars) {
		this.orient = dVars.orient;
		this.setupDisplay(dVars);
		this.highScoresTable.setupDisplay(dVars, this.dSettings);
		this.highScoresTableLines.setupDisplay(dVars, this.dSettings);
		this.highScoresArrows.setupDisplay(dVars, this.dSettings);
		this.highScoresScoresPane.setupDisplay(dVars, this.dSettings);
		this.highScoresEntryPane.displayChange(dVars, this.dSettings);
	}

	updateInputs(dVars:DisplayVars) {
		this.highScoresEntryPane.updateInputs(dVars);
	}

	positionScoresPane() {
		if (this.orient === 0) {
			this.highScoresScoresPane.x = 68;
			this.highScoresScoresPane.y = this.highScoresTable.y;
			if (this.highScoresEntryPane.visible) this.highScoresScoresPane.y -= 105;
		} else {
			this.highScoresScoresPane.x = this.highScoresEntryPane.visible ? 163 : 275;
			// this.highScoresScoresPane.y = 650;
			this.highScoresScoresPane.y = 507;
		}
	}

	setContentTitle(title:string) { this.highScoresTable.setContentTitle(title); }

	setPlayerPosition(ind:number, pos:number) {	this.playerPositions[ind] = pos; }

	getPlayerPosition(ind:number) { return this.playerPositions[ind]; }

	setScoresPane(label:string, score:number) {
		this.highScoresScoresPane.setScores(label, score);
	}

	gettingScores() {
		this.scoresReceived = false;
		this.submitSent = false;
	}

	setDisplaySeq(displaySeq:number[]) {
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

	updateSeq(add:number) {
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

	showScores(dir:number) {
		let curSet = this.displaySeq[this.displayInd];
		this.highScoresTableLines.showScores(this.scores[curSet], dir, curSet);
		let pPos = this.playerPositions[this.displaySeq[this.displayInd]];
		if (pPos !== -1) { //always return y position to place where player score shows
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

	submitClick(nom:string, loc:string) {
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
		this.timerCount = this.SEQ_LOW;
	}

	scrollDown() {
		this.highScoresTableLines.scrollDown();
		this.timerCount = this.SEQ_LOW;
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
		if (this.timerCount >= this.SEQ_LIM && this.scoresReceived) {
			this.timerCount = 0;
			this.updateSeq(1);
		}
		this.myTimer = window.setTimeout(this.myCounter, 200);
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

		this.timerCount = this.SEQ_START;
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
