import PIXI from 'pixi.js';
import HighScoresView from './highscoresview';
import HighScoresLoader from './highscoresloader';
import {DisplayVars, HSSettings, HSDisplaySettings, HSScoresLine, HSObject} from './highscorestypes';

export interface GameData{
	score: number,
	time: number,
	moves: number,
	contentCode: number|null,
	contentTitle: string,
	playerName: string,
	playerLocation: string,
	maxScore: number
}

interface responseType{
	response:HSScoresLine[],
	userInsert:number
}

const OFFLINE_LEN:number=6;

class HighScores extends PIXI.Container {
	private scores:HSObject;
	private settings:HSSettings;
	private gameData:GameData;
	private highScoresView:HighScoresView;
	private highScoresLoader:HighScoresLoader;

	constructor(dVars:DisplayVars, scores:HSObject, settings:HSSettings, dSettings:HSDisplaySettings) {
		super();
		this.submitClick = this.submitClick.bind(this);
		this.gotScores = this.gotScores.bind(this);
		this.scores = scores;
		this.settings = settings;
		this.gameData = {
			score: 0, time: 0, moves: 0, contentCode: null, contentTitle: '', playerName: 'You', playerLocation: 'Home', maxScore: 0
		};
		this.highScoresView = new HighScoresView(dVars, scores, settings, dSettings);
		this.highScoresLoader = new HighScoresLoader(settings);
		this.highScoresLoader.on('gotscores', this.gotScores);
		this.addChild(this.highScoresView);
	}

	displayChange(dVars:DisplayVars) {
		this.highScoresView.displayChange(dVars);
	}

	updateInputs(dVars:DisplayVars) {
		this.highScoresView.updateInputs(dVars);
	}

	getScores() {
		this.highScoresView.gettingScores();
		this.highScoresLoader.getScores(false, this.gameData);
	}

	gotScores(responseText:responseType) {
		this.processJson(responseText);
		let dSeq = this.getDisplaySeq();
		if (this.highScoresView.isSubmitSent()) this.ensurePlayerShowing(dSeq);
		this.highScoresView.setDisplaySeq(dSeq);
		this.highScoresView.gotScores();
	}

	setPlayerScores(score1:number, score2:number) {
		if(this.settings.SCORE_TYPE[0]==='score')this.gameData.score=score1;
		if(this.settings.SCORE_TYPE[0]==='time')this.gameData.time=score1;
		if(this.settings.SCORE_TYPE[0]==='moves')this.gameData.moves=score1;
		if(this.settings.SCORE_TYPE.length>1){
			if(this.settings.SCORE_TYPE[1]==='score')this.gameData.score=score2;
			if(this.settings.SCORE_TYPE[1]==='time')this.gameData.time=score2;
			if(this.settings.SCORE_TYPE[1]==='moves')this.gameData.moves=score2;
		}
		this.highScoresView.setScoresPane(this.settings.SCORE_TYPE[0], score1);
		this.addPlayerToOfflineScores();
	}

	setGameData(contentCode:number, contentTitle:string, maxScore:number) {
		this.gameData.contentCode=contentCode;
		this.gameData.contentTitle=contentTitle;
		this.gameData.maxScore=maxScore;
		this.highScoresView.setContentTitle(contentTitle);
	}

	getDisplaySeq() { //determines which sets of scores to display - all, monthly, weekly or 24hrs
		if (this.scores[2].length < 5) return [1];//just all
		if (this.scores[4].length > 4) return [1, 2, 4];//all, monthly, 24hrs
		if (this.scores[3].length > 4) return [1, 2, 3];//all, monthly, weekly
		return [1, 2];//all & monthly
	}

	submitClick(nom:string, loc:string) {
		this.gameData.playerName = nom;
		this.gameData.playerLocation = loc;
		this.highScoresLoader.getScores(true, this.gameData);
	}

	processJson(responseText:responseType) {
		let myJson = responseText.response;
		let userId = responseText.userInsert;
		let lim = 50;
		let times = [0, 0, 0, 0, 0];
		let pPos = [-1, -1, -1, -1, -1];

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
		this.scores[0][OFFLINE_LEN-1] = this.makePlayerLine(false);
		this.scores[0].sort(this.compare.bind(this));
		let pPos = this.scores[0].map((e) => e.nom).indexOf('You');
		this.highScoresView.setPlayerPosition(0, pPos);
	}

	ensurePlayerShowing(dSeq:number[]) {
		let sInd = dSeq[dSeq.length - 1];
		if (this.highScoresView.getPlayerPosition(sInd) === -1) {
			this.scores[sInd][49] = this.makePlayerLine(true);
			this.highScoresView.setPlayerPosition(sInd, 49);
		}
	}

	makePlayerLine(fullYear:boolean) {
		let myDate = new Date();
		let playerDate = fullYear ? myDate : myDate.getFullYear();
		let line:HSScoresLine = {
			dote : playerDate.toString(),
			nom : this.gameData.playerName,
			local : this.gameData.playerLocation,
			id:7,
			score : this.gameData.score,
			time : this.gameData.time,
			moves : this.gameData.moves
		};
		return line;
	}

	compare(a:HSScoresLine, b:HSScoresLine) {
		//this is only used when adding player score
		let sType = this.settings.SCORE_TYPE[0];
		if(sType==='score'){
			if(a.score>b.score)return -1;
			if(a.score<b.score)return 1;
		}
		if(sType==='time'){
			if(a.time>b.time)return 1;
			if(a.time<b.time)return -1;
		}
		if(sType==='moves'){
			if(a.moves>b.moves)return 1;
			if(a.moves<b.moves)return -1;
		}
		if (this.settings.SCORE_TYPE.length > 1) {
			sType = this.settings.SCORE_TYPE[1];
			if(sType==='score'){
				if(a.score>b.score)return -1;
				if(a.score<b.score)return 1;
			}
			if(sType==='time'){
				if(a.time>b.time)return 1;
				if(a.time<b.time)return -1;
			}
			if(sType==='moves'){
				if(a.moves>b.moves)return 1;
				if(a.moves<b.moves)return -1;
			}
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
