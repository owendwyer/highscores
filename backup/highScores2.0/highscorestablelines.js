
(function(oG){//checked
	function HighScoresTableLines(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(HighScoresTableLines,createjs.Container);
	var monthText=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var LINE_HEIGHT=38;
	var pHighWid=495;
	var hPaneRnd=8;

	p.setup=function(){
		this.mouseEnabled=false;
		this.playerName='';
		this.playerLoc='';
		this.fieldsMade=false;
		this.rows=8;
		this.backPaneColor='#fff';
		this.backPaneAlpha=0.3;
		this.backPaneBorderColor='#000';
		this.backPaneBorderWidth=0;
		this.pHlightColor='#fff';
		this.pHlightBordColor='#999';
		this.pHlightBordWid=1;

		this.playerHighlight=new createjs.Shape();
		this.playerHighlight.visible=false;
		this.playerHighlight.alpha=0.4;
	};

	p.initialSetup=function(){
		var fontSizes=oG.model.orientation===0?oG.HSModel.fontSizes:oG.HSModel.fontSizesPort;
		var titlesFont='bold '+fontSizes[1]+'px '+oG.HSModel.fonts[1];
		var fieldsFont='bold '+fontSizes[2]+'px '+oG.HSModel.fonts[2];
		var tColor=oG.HSModel.fontColors[1];
		var fColor=oG.HSModel.fontColors[2];
		this.titlesContainer=new createjs.Container();
		this.fieldsContainer=new createjs.Container();
		this.fieldsMask=new createjs.Shape();
		this.fieldsContainer.mask=this.fieldsMask;
		this.fieldsContainer.addChild(this.playerHighlight);

		this.playerHighlight.graphics.clear().beginStroke(oG.HSModel.highlightColors[0]);
		this.playerHighlight.graphics.beginFill(oG.HSModel.highlightColors[1]);
		this.playerHighlight.graphics.drawRoundRect(-20,-24,pHighWid,LINE_HEIGHT-3,hPaneRnd);
		this.playerHighlight.alpha=oG.HSModel.highlightAlpha;

		this.xInds=xInds[oG.model.highScoreTableType];
		this.titleLabels=titleLabels[oG.model.highScoreTableType];
		this.columns=this.titleLabels.length;
		this.tFields=[];
		this.tFieldsText=[];
		this.titles=[];
		for(var i=0;i<this.columns;i++){
			this.titles[i]=new createjs.Text(this.titleLabels[i],titlesFont,tColor);
			this.titlesContainer.addChild(this.titles[i]);
			this.titles[i].x=this.xInds[i];
			opdLib.centerText(this.titles[i]);

			this.tFields[i]=new createjs.Text('',fieldsFont,fColor);
			this.fieldsContainer.addChild(this.tFields[i]);
			this.tFields[i].maxWidth=120;
			this.tFields[i].lineHeight=LINE_HEIGHT;
			this.tFields[i].x=this.xInds[i];
			this.tFieldsText[i]='';
			opdLib.centerText(this.tFields[i]);
		}
		this.addChild(this.titlesContainer,this.fieldsContainer);
		this.setupDisplay();
	};

	p.updateFontSizes=function(){
		var fontSizes=oG.model.orientation===0?oG.HSModel.fontSizes:oG.HSModel.fontSizesPort;
		var titlesFont='bold '+fontSizes[1]+'px '+oG.HSModel.fonts[1];
		var fieldsFont='bold '+fontSizes[2]+'px '+oG.HSModel.fonts[2];
		for(var i=0;i<this.columns;i++){
			this.titles[i].font=titlesFont;
			this.tFields[i].font=fieldsFont;
		}
	};

	p.setupDisplay=function(){
		this.fieldsMask.graphics.clear().drawRect(-248,-28,514,306);
		this.baseY=0;
		this.fieldsX=-226;
		opdLib.posItem(this.titlesContainer,this.fieldsX,-42);
		opdLib.posItem(this.fieldsContainer,this.fieldsX,this.baseY);
		this.setMinY();
	};

	p.getFieldsY=function(){
		return this.fieldsContainer.y-this.baseY;
	};

	p.showPlayerHighlight=function(pPos){
		this.playerHighlight.visible=true;
		this.playerHighlight.y=LINE_HEIGHT*pPos;
		var off=pPos;
		if(off<=4)off=0;
		if(off>4)off-=4;
		this.fieldsContainer.y=this.baseY-LINE_HEIGHT*off;
		if(this.fieldsContainer.y>=this.baseY)this.fieldsContainer.y=this.baseY;
		if(this.fieldsContainer.y<=this.minY)this.fieldsContainer.y=this.minY;
	};

	p.showLastYPosition=function(yOff){
		this.playerHighlight.visible=false;
		this.fieldsContainer.y=this.baseY+yOff;
	};

	p.showScores=function(sJson,dir,curSet){
		this.displayScores(sJson,curSet);
		this.setMinY();
		this.fieldsContainer.x=this.fieldsX+(20*dir);
		this.fieldsContainer.alpha=0;
		createjs.Tween.get(this.fieldsContainer,{override:true}).to({x:this.fieldsX,alpha:1},400);
	};

	p.displayScores=function(sJson,curSet){
		var i=0;
		for(i=0;i<this.tFields.length;i++)this.tFieldsText[i]='';
		this.rowsCount=sJson.length;
		for(i=0;i<this.rowsCount;i++){
			var dateLine='';
			if(curSet!=='offline'){
				var myDate=new Date(sJson[i].dote);
				var myMon=monthText[myDate.getMonth()];
				var myDay=myDate.getDate();
				dateLine=myDay+'-'+myMon;
				if(curSet==='scores')dateLine=myDate.getFullYear();
			}else{
				dateLine=sJson[i].dote;
			}
			this.addLineFun(i+1,sJson[i],dateLine);
		}
		for(i=0;i<this.tFields.length;i++)this.tFields[i].text=this.tFieldsText[i];
	};

	p.setMinY=function(){
		if(this.rowsCount<=this.rows){
			this.minY=this.baseY;
		}else{
			this.minY=this.baseY-((this.rowsCount-8)*LINE_HEIGHT);
		}
	};

	p.scrollUp=function(){
		this.fieldsContainer.y+=LINE_HEIGHT;
		if(this.fieldsContainer.y>=this.baseY){
			this.fieldsContainer.y=this.baseY;
		}
	};

	p.scrollDown=function(){
		this.fieldsContainer.y-=LINE_HEIGHT;
		if(this.fieldsContainer.y<=this.minY){
			this.fieldsContainer.y=this.minY;
		}
	};

	p.init=function(){
		this.rowsCount=0;
		opdLib.posItem(this.fieldsContainer,this.fieldsX,this.baseY);
	};

	p.deit=function(){
	};

	p.addLineFun=function(ind,scoreEntry,dateLine){
		var lineEntries=lineEntriesArr[oG.model.highScoreTableType];
		this.tFieldsText[0]+=ind+'\r\n';
		for(var i=1;i<lineEntries.length;i++){
			if(lineEntries[i]==='date')this.tFieldsText[i]+=dateLine+'\r\n';
			else this.tFieldsText[i]+=scoreEntry[lineEntries[i]]+'\r\n';
		}
	};

	var lineEntriesArr={};
	lineEntriesArr.score=['','nom','score','date','local'];
	lineEntriesArr.movesTime=['','nom','moves','time','date','local'];
	lineEntriesArr.scoreMoves=['','nom','score','moves','date','local'];
	lineEntriesArr.scoreTime=['','nom','score','time','date','local'];
	lineEntriesArr.timeRound=['','nom','time','score','date','local'];
	lineEntriesArr.time=['','nom','time','date','local'];

	var lineEntriesArrPhp={};
	lineEntriesArrPhp.score=['','Nom','Score','date','Local'];
	lineEntriesArrPhp.movesTime=['','Nom','Muves','Tome','date','Local'];
	lineEntriesArrPhp.scoreMoves=['','Nom','Score','Muves','date','Local'];
	lineEntriesArrPhp.scoreTime=['','Nom','Score','Tome','date','Local'];
	lineEntriesArrPhp.timeRound=['','Nom','Tome','Score','date','Local'];
	lineEntriesArrPhp.time=['','Nom','Tome','date','Local'];

	var titleLabels={};
	var xInds={};
	titleLabels.time=['','Name','Time','Date','Location'];
	xInds.time=[6,94,214,305,410];
	titleLabels.timeRound=['','Name','Time','Round','Date','Location'];
	xInds.timeRound=[2,77,175,245,315,410];
	titleLabels.movesTime=['','Name','Moves','Time','Date','Location'];
	xInds.movesTime=[2,77,175,245,315,410];
	titleLabels.scoreMoves=['','Name','Score','Moves','Date','Location'];
	xInds.scoreMoves=[2,77,175,245,315,410];
	titleLabels.scoreTime=['','Name','Score','Time','Date','Location'];
	xInds.scoreTime=[2,77,175,245,315,410];
	titleLabels.score=['','Name','Score','Date','Location'];
	xInds.score=[6,94,214,298,410];

	oG.Modules.HighScoresTableLines=createjs.promote(HighScoresTableLines,'Container');
}(opdGame));
