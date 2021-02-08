import PIXI from 'pixi.js';
import HighScoresView from './highscoresview';
import HighScoresLoader from './highscoresloader';

class HighScores extends PIXI.Container {
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

export default HighScores;
