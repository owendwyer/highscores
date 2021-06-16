import PIXI from 'pixi.js';
import { HSSettings} from './highscorestypes';
import {GameData} from './highscores';

class HighScoresLoader extends PIXI.utils.EventEmitter {
	private settings:HSSettings;
	private myReq:XMLHttpRequest|null=null;
	constructor(settings:HSSettings) {
		super();
		this.settings = settings;
		this.gotScores = this.gotScores.bind(this);
	}

	getScores(sendPlayerData:boolean, gameData:GameData) {
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
		if (this.myReq?.readyState === 4 && this.myReq.status === 200) {
			try {
				let parsed = JSON.parse(this.myReq.responseText);
				this.emit('gotscores', parsed);
			} catch (e) {
				console.log('error - could not parse response ', e);
			}
			this.myReq.removeEventListener('readystatechange', this.gotScores);
			this.myReq = null;
		}
	}

	makePostlets(sendPlayerData:boolean, gameData:GameData) {
		let sendContent=gameData.contentCode !== null?gameData.contentCode:undefined;

		let sendScoreLine={};
		if (sendPlayerData) {
			sendScoreLine={
				nom : gameData.playerName,
				local : gameData.playerLocation,
				score : gameData.score,
				time : gameData.time,
				moves : gameData.moves,
				content : sendContent
			}
		}

		let sendOb = {
			meta:{
				reqType : 'scores',
				srcType :	'online',
				insert : sendPlayerData,
				table : this.settings.SCORES_TABLE,
				gameType : this.settings.TABLE_TYPE,
				content : sendContent
			},
			scoreLine : sendScoreLine
		};
		return JSON.stringify(sendOb);
	}
}

export default HighScoresLoader;
