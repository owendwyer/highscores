
(function(oG){
	function HighScoreView(){
		this.Container_constructor();
		this.scrollUpFun=this.scrollUp.bind(this);
		this.scrollDownFun=this.scrollDown.bind(this);
		this.seqNextFun=this.seqNext.bind(this);
		this.seqPrevFun=this.seqPrev.bind(this);
		this.myCounterFun=this.myCounter.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoreView,createjs.Container);
	var seqLim=30;
	var seqStart=12;
	var seqLow=-10;

	p.setup=function(){
		this.active=false;
		this.fadeEntryFlag=true;
		this.myTimer=null;
		this.yOffs=[];
		this.dontChangeIndFlag=false;
		this.highScoresTable=new oG.Modules.HighScoresTable();
		this.highScoresTableLines=new oG.Modules.HighScoresTableLines();
		this.highScoresArrows=new oG.Modules.HighScoresArrows();
		this.highScoresSeqArrows=new oG.Modules.HighScoresSeqArrows();
		this.highScoresScoresPane=new oG.Modules.HighScoresScoresPane();
		this.highScoresEntryPane=new oG.Modules.HighScoresEntryPane();

		this.highScoresTable.mouseEnabled=false;
		this.highScoresTableLines.mouseEnabled=false;
		this.highScoresScoresPane.mouseEnabled=false;

		this.addChild(this.highScoresTable,this.highScoresTableLines,this.highScoresArrows);
		this.addChild(this.highScoresSeqArrows,this.highScoresScoresPane);
		this.addChild(this.highScoresEntryPane);
	};

	p.initialSetup=function(){
		this.highScoresTable.initialSetup();
		this.highScoresTableLines.initialSetup();
		this.highScoresArrows.initialSetup();
		this.highScoresSeqArrows.initialSetup();
		this.highScoresScoresPane.initialSetup();
		this.highScoresEntryPane.initialSetup();
		this.setupDisplay();
	};

	p.setupDisplay=function(){
		var xPos=oG.model.orientation===0?400:275;
		var yPos=oG.model.orientation===0?228:304;
		yPos+=oG.model.orientation===0?oG.HSModel.adjustYs[0]:oG.HSModel.adjustYs[1];
		opdLib.posItem(this.highScoresTable,xPos,yPos);
		opdLib.posItem(this.highScoresTableLines,xPos,yPos-77);
		opdLib.posItem(this.highScoresSeqArrows,xPos,yPos-178);
		if(oG.model.orientation===0){
			opdLib.posItem(this.highScoresEntryPane,68,yPos+25);
		}else{
			opdLib.posItem(this.highScoresEntryPane,275,400);
		}
		this.positionScoresPane();
	};

	p.positionScoresPane=function(){
		if(oG.model.orientation===0){
			this.highScoresScoresPane.x=68;
			this.highScoresScoresPane.y=this.highScoresTable.y;
			if(this.highScoresEntryPane.visible)this.highScoresScoresPane.y-=105;
		}else{
			this.highScoresScoresPane.x=this.highScoresEntryPane.visible?163:275;
			this.highScoresScoresPane.y=650;
		}
	};

	p.orientationChange=function(){
		this.setupDisplay();
		this.highScoresScoresPane.setupDisplay();
		this.highScoresArrows.setupDisplay();
		this.highScoresEntryPane.setupDisplay();
		this.highScoresEntryPane.updateFontSizes();
		this.highScoresTableLines.updateFontSizes();
	};

	p.setScoresPane=function(){
		this.highScoresScoresPane.setScores();
	};

	p.showScores=function(dir){
		var curSet=oG.HSModel.seqList[oG.HSModel.displaySeq[oG.HSModel.displayInd]];
		this.highScoresTableLines.showScores(oG.HSModel.scores[curSet],dir,curSet);
		var pPos=oG.HSModel.playerPositions[oG.HSModel.displaySeq[oG.HSModel.displayInd]];
		if(pPos!==null){//always return y position to place where player score shows
			this.highScoresTableLines.showPlayerHighlight(pPos);
		}else{
			this.highScoresTableLines.showLastYPosition(this.yOffs[oG.HSModel.displayInd]);
		}
		this.highScoresTable.updateTitle(curSet);
		this.highScoresSeqArrows.visible=oG.HSModel.displaySeq.length!==1;
		if(curSet!=='offline'&&this.fadeEntryFlag){
		//if(true){
			this.fadeEntryFlag=false;
			this.highScoresEntryPane.visible=true;
			this.highScoresEntryPane.showFields();
			this.positionScoresPane();
			opdLib.fadeIn(this.highScoresEntryPane,500,0);
			opdLib.fadeIn(this.highScoresScoresPane,500,0);
		}
	};

	p.submitClicked=function(){
		this.hideSubmit();
	};

	p.storeYOff=function(){
		this.yOffs[oG.HSModel.displayInd]=this.highScoresTableLines.getFieldsY();
	};

	p.scrollUp=function(){
		this.highScoresTableLines.scrollUp();
		this.timerCount=seqLow;
	};

	p.scrollDown=function(){
		this.highScoresTableLines.scrollDown();
		this.timerCount=seqLow;
	};

	p.seqNext=function(){
		this.updateSeq(1);
		clearTimeout(this.myTimer);
	};

	p.seqPrev=function(){
		this.updateSeq(-1);
		clearTimeout(this.myTimer);
	};

	p.hideSubmit=function(){
		this.highScoresEntryPane.visible=false;
		opdLib.fadeIn(this.highScoresScoresPane,300,0);
		this.positionScoresPane();
	};

	p.myCounter=function(){
		this.timerCount++;
		if(this.timerCount>=seqLim&&oG.HSModel.scoresReceived){
			this.timerCount=0;
			this.updateSeq(1);
		}
		this.myTimer=setTimeout(this.myCounterFun,200);
	};

	p.updateSeq=function(add){
		this.storeYOff();
		var tmp=-1;
		if(!this.dontChangeIndFlag){
			tmp=oG.HSModel.displayInd;
			oG.HSModel.displayInd+=add;
		}
		this.dontChangeIndFlag=false;
		if(oG.HSModel.displayInd<0)oG.HSModel.displayInd=oG.HSModel.displaySeq.length-1;
		if(oG.HSModel.displayInd===oG.HSModel.displaySeq.length)oG.HSModel.displayInd=0;
		if(oG.HSModel.displayInd!==tmp)this.showScores(add);
	};

	p.resetCounter=function(){
		this.timerCount=0;
	};

	p.init=function(){
		this.active=true;
		this.dontChangeIndFlag=false;
		this.yOffs=[0,0,0];
		this.highScoresArrows.addLists();
		this.highScoresSeqArrows.addLists();
		this.highScoresArrows.addEventListener('scrollup',this.scrollUpFun);
		this.highScoresArrows.addEventListener('scrolldown',this.scrollDownFun);
		this.highScoresSeqArrows.addEventListener('seqnext',this.seqNextFun);
		this.highScoresSeqArrows.addEventListener('seqprev',this.seqPrevFun);

		this.highScoresTable.init();
		this.highScoresTableLines.init();
		this.highScoresEntryPane.init();

		this.timerCount=seqStart;
		if(!oG.HSModel.scoresReceived){
			oG.HSModel.displaySeq=oG.HSModel.seqOrders[0];//offline
			oG.HSModel.displayInd=0;
		}

		this.highScoresEntryPane.visible=false;
		this.positionScoresPane();
		this.fadeEntryFlag=true;
		this.showScores(0);
		this.myCounter();
	};

	p.deit=function(){
		this.active=false;
		this.highScoresArrows.removeLists();
		this.highScoresSeqArrows.removeLists();
		this.highScoresArrows.removeEventListener('scrollup',this.scrollUpFun);
		this.highScoresArrows.removeEventListener('scrolldown',this.scrollDownFun);
		this.highScoresSeqArrows.removeEventListener('seqnext',this.seqNextFun);
		this.highScoresSeqArrows.removeEventListener('seqprev',this.seqPrevFun);

		this.highScoresTable.deit();
		this.highScoresTableLines.deit();
		this.highScoresEntryPane.deit();

		clearTimeout(this.myTimer);
	};

	oG.Modules.HighScoreView=createjs.promote(HighScoreView,'Container');
}(opdGame));
