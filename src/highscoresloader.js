import PIXI from 'pixi.js';

class HighScoresLoader extends PIXI.utils.EventEmitter {
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

export default HighScoresLoader;
