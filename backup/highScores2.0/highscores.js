
(function(oG){
	function HighScores(){
		this.Container_constructor();
		this.gotScoresFun=this.gotScores.bind(this);
		this.submitClickFun=this.submitClick.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScores,createjs.Container);

	p.setup=function(){
		this.gotScoresEvent=new createjs.Event('gotscores');
		this.highScoresView=new oG.Modules.HighScoreView();
		this.highScoresLoader=new oG.Modules.HighScoresLoader();
		this.highScoresLoader.addEventListener('gotScores',this.gotScoresFun);
		//this.highScoresLoader.removeEventListener('gotScores',this.gotScoresFun);
		this.addChild(this.highScoresView);
	};

	p.initialSetup=function(){
		this.highScoresView.initialSetup();
	};

	p.orientationChange=function(){
		this.highScoresView.orientationChange();
	};

	p.gotScores=function(e){
		oG.HSModel.scoresReceived=true;
		for(var i=1;i<oG.HSModel.seqList.length;i++){
			oG.HSModel.scores[oG.HSModel.seqList[i]]=this.removeCheaters(e.leScores[oG.HSModel.seqList[i]]);
		}
		for(var j=0;j<4;j++){
			oG.HSModel.playerPositions[j+1]=e.leScores.pPoss[j];
		}
		oG.HSModel.displaySeq=this.getDisplaySeq();
		oG.HSModel.displayInd=oG.HSModel.displaySeq.length-1;
		if(oG.HSModel.submitSent){
			this.ensurePlayerShowing();
			this.highScoresView.resetCounter();
			if(this.highScoresView.active)this.highScoresView.showScores(0);
		}else{
			this.highScoresView.dontChangeIndFlag=true;
		}
		this.dispatchEvent(this.gotScoresEvent);
	};

	p.getDisplaySeq=function(){
		if(oG.HSModel.scores.scoresMonthly.length<5)return oG.HSModel.seqOrders[1];//all
		if(oG.HSModel.scores.scoresToday.length>4)return oG.HSModel.seqOrders[4];//today
		if(oG.HSModel.scores.scoresWeekly.length>4)return oG.HSModel.seqOrders[3];//weekly
		return oG.HSModel.seqOrders[2];//monthly
	};

	p.ensurePlayerShowing=function(){
		var sInd=oG.HSModel.displaySeq[oG.HSModel.displaySeq.length-1];
		var seq=oG.HSModel.seqList[sInd];
		if(oG.HSModel.playerPositions[sInd]===null){
			oG.HSModel.scores[seq][49]=this.getPlayerLine(true,true);
			oG.HSModel.playerPositions[sInd]=49;
		}
	};

	p.removeCheaters=function(inArr){
		var lim=oG.HSModel.maxScore;
		if(lim>0){
			for(var i=0;i<inArr.length;i++){
				var scr=inArr[i].score;
				if(scr>lim)inArr[i].score=lim;
			}
		}
		return inArr;
	};

	p.setScoresPane=function(score1,score2){
		oG.HSModel.playerScore1=score1;
		oG.HSModel.playerScore2=score2;
		oG.HSModel.scoreType=oG.HSModel.scoreTypes[oG.model.highScoreTableType];
		this.highScoresView.setScoresPane();
		this.highScoresLoader.setScores();
		this.setupOfflineScores();
	};

	p.submitClick=function(e){
		oG.HSModel.submitSent=true;
		this.highScoresView.submitClicked();//before loader
		oG.HSModel.playerName=e.nom;
		oG.HSModel.playerLocation=e.loc;
		this.highScoresLoader.getScores(true);
	};

	p.setOffLineScores=function(type,scrs){
		for(var i=0;i<7;i++){
			oG.HSModel.scores.offline[i][type]=scrs[i];
		}
	};

	p.setupOfflineScores=function(){
		oG.HSModel.scores.offline[7]=this.getPlayerLine(false,false);
		oG.HSModel.scores.offline.sort(compare);
		var pPos=oG.HSModel.scores.offline.map(function(e){return e.nom;}).indexOf('You');
		oG.HSModel.playerPositions=[pPos,null,null,null,null];
	};

	p.getPlayerLine=function(usePlayer,fullYear){
		var myDate=new Date();
		var line={};
		if(fullYear){
			line.dote=myDate;
		}else{
			line.dote=myDate.getFullYear();
		}
		if(usePlayer){
			line.nom=oG.HSModel.playerName;
			line.local=oG.HSModel.playerLocation;
		}else{
			line.nom='You';
			line.local='Home';
		}
		line[oG.HSModel.scoreType[0]]=oG.HSModel.playerScore1;
		if(oG.HSModel.scoreType.length>1){
			line[oG.HSModel.scoreType[1]]=oG.HSModel.playerScore2;
		}
		return line;
	};

	function compare(a,b){
		var ret=[1,-1];//descending
		var sType=oG.HSModel.scoreType[0];
		if(sType==='score')ret=[-1,1];//ascending
		if(a[sType]>b[sType]){
			return ret[0];
		}
		if(a[sType]<b[sType]){
			return ret[1];
		}
		if(oG.HSModel.scoreType.length>1){
			ret=[1,-1];
			sType=oG.HSModel.scoreType[1];
			if(sType==='score')ret=[-1,1];
			if(a[sType]>b[sType]){
				return ret[0];
			}
			if(a[sType]<b[sType]){
				return ret[1];
			}
		}
		return 0;
	}

	p.getRemoteScores=function(){
		oG.HSModel.scoresReceived=false;
		oG.HSModel.submitSent=false;
		this.highScoresLoader.getScores(false);
	};

	p.init=function(){
		oG.HSModel.submitSent=false;
		if(!oG.model.loadScoresEarly)this.getRemoteScores();
		this.highScoresView.init();
		this.highScoresView.highScoresEntryPane.addEventListener('submitclick',this.submitClickFun);
	};

	p.deit=function(){
		this.highScoresView.deit();
		this.highScoresView.highScoresEntryPane.removeEventListener('submitclick',this.submitClickFun);
	};

	oG.Modules.HighScores=createjs.promote(HighScores,'Container');
}(opdGame));
