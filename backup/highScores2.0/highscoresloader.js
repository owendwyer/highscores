
(function(oG){//checked
	function HighScoresLoader(){
		this.EventDispatcher_constructor();
		this.gotScoresFun=this.gotScores.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoresLoader,createjs.EventDispatcher);

	p.setup=function(){
		this.myReq=new XMLHttpRequest();
		this.score=0;
		this.time=0;
		this.moves=0;
	};

	p.setScores=function(){
		this[oG.HSModel.scoreType[0]]=oG.HSModel.playerScore1;
		if(oG.HSModel.scoreType.length>1){
			this[oG.HSModel.scoreType[1]]=oG.HSModel.playerScore2;
		}
	};

	p.getScores=function(sendPlayerData){
		this.myReq=new XMLHttpRequest();
		this.myReq.addEventListener('readystatechange',this.gotScoresFun);
		this.myReq.open('POST',oG.model.getScoresUrl,true);
		this.myReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		var myVars=this.makePostVars(sendPlayerData);
		this.myReq.send(myVars);
	};

	p.gotScores=function(){
		if(this.myReq.readyState===4&&this.myReq.status===200){
			try{
				var jsonArr=this.processJson(JSON.parse(this.myReq.responseText));
				var myEvent=new createjs.Event('gotScores');
				myEvent.leScores=jsonArr;
				this.dispatchEvent(myEvent);
			}catch(e){
				console.log('error - could not parse response ',e);
			}
			this.myReq.removeEventListener('readystatechange',this.gotScoresFun);
		}
	};

	p.processJson=function(leJson){
		var myJson;
		var userId=null;
		myJson=leJson.response;
		userId=leJson.userInsert;
		var lim=50;
		var scoresMainLoc=[];
		var scoresMonthlyLoc=[];
		var scoresWeeklyLoc=[];
		var scoresTodayLoc=[];

		var now=new Date();
		//var nowYear=now.getYear();
		now.setDate(now.getDate()-1);
		var nowDay=now.getTime();
		now.setDate(now.getDate()-6);
		var nowWeek=now.getTime();
		now.setDate(now.getDate()-23);
		var nowMonth=now.getTime();

		var pPossLoc=[null,null,null,null];
		for(var i=0;i<myJson.length;i++){
			var uMatch=false;
			if(userId===myJson[i].id)uMatch=true;
			var leDate=new Date(myJson[i].dote);
			if(scoresMainLoc.length<lim){
				if(uMatch)pPossLoc[0]=scoresMainLoc.length;
				scoresMainLoc.push(myJson[i]);
			}
			if(scoresMonthlyLoc.length<lim&&leDate.getTime()>nowMonth){
				if(uMatch)pPossLoc[1]=scoresMonthlyLoc.length;
				scoresMonthlyLoc.push(myJson[i]);
			}
			if(scoresWeeklyLoc.length<lim&&leDate.getTime()>nowWeek){
				if(uMatch)pPossLoc[2]=scoresWeeklyLoc.length;
				scoresWeeklyLoc.push(myJson[i]);
			}
			if(scoresTodayLoc.length<lim&&leDate.getTime()>nowDay){
				if(uMatch)pPossLoc[3]=scoresTodayLoc.length;
				scoresTodayLoc.push(myJson[i]);
			}
		}
		var out={
			scores:scoresMainLoc,
			scoresMonthly:scoresMonthlyLoc,
			scoresWeekly:scoresWeeklyLoc,
			scoresToday:scoresTodayLoc,
			pPoss:pPossLoc
		};
		return out;
	};

	p.makePostVars=function(sendPlayerData){
		var sendOb={};
		sendOb.meta={};
		sendOb.meta.reqType='scores';
		sendOb.meta.srcType='online';
		sendOb.meta.insert=sendPlayerData;
		sendOb.meta.table=oG.model.scoresTable;
		sendOb.meta.gameType=oG.model.highScoreTableType;
		if(oG.model.contentCode!==undefined)sendOb.meta.content=oG.model.contentCode;
		if(sendPlayerData){
			sendOb.scoreLine={};
			sendOb.scoreLine.nom=oG.HSModel.playerName;
			sendOb.scoreLine.local=oG.HSModel.playerLocation;
			sendOb.scoreLine.score=this.score;
			sendOb.scoreLine.time=this.time;
			sendOb.scoreLine.moves=this.moves;
			if(oG.model.contentCode!==undefined)sendOb.scoreLine.content=sendOb.meta.content;
		}
		return JSON.stringify(sendOb);
	};

	oG.Modules.HighScoresLoader=createjs.promote(HighScoresLoader,'EventDispatcher');
}(opdGame));
