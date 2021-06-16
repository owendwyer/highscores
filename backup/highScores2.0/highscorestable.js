
(function(oG){
	function HighScoresTable(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(HighScoresTable,createjs.Container);
	var paneWid=534;
	var paneHei=444;
	var paneRnd=48;

	p.setup=function(){
	};

	p.initialSetup=function(){
		this.backPane=new createjs.Shape();
		var fontSizes=oG.model.orientation===0?oG.HSModel.fontSizes:oG.HSModel.fontSizesPort;
		var titleFont='bold '+fontSizes[0]+'px '+oG.HSModel.fonts[0];
		this.titleText=new createjs.Text('asdf',titleFont,oG.HSModel.fontColors[0]);
		opdLib.centerText(this.titleText);
		opdLib.posItem(this.titleText,0,-168);

		this.addChild(this.backPane,this.titleText);

		this.drawBackPane();
	};

	p.drawBackPane=function(){
		var w=paneWid;
		var h=paneHei;
		var r=paneRnd;
		if(oG.HSModel.backPaneMargin>0){
			this.backPane.graphics.clear().beginStroke(oG.HSModel.backPaneColors[0]).beginFill(oG.HSModel.backPaneColors[1]);
			this.backPane.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
			w-=oG.HSModel.backPaneMargin;
			h-=oG.HSModel.backPaneMargin;
			r-=Math.floor(oG.HSModel.backPaneMargin/3);
		}
		this.backPane.graphics.beginStroke(oG.HSModel.backPaneColors[2]).beginFill(oG.HSModel.backPaneColors[3]);
		this.backPane.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
		this.backPane.alpha=oG.HSModel.backPaneAlpha;
	};

	p.updateTitle=function(curSet){
		var curText='All';
		if(curSet==='scoresToday')curText='24 hours';
		if(curSet==='scoresWeekly')curText='7 days';
		if(curSet==='scoresMonthly')curText='30 days';
		if(oG.model.contentTitle!==undefined){
			this.titleText.text=oG.model.contentTitle+' - '+curText;
		}else{
			this.titleText.text=curText;
		}
		if(curSet==='offline')this.titleText.text='Offline';
		opdLib.fadeIn(this.titleText,200,0);
	};

	p.init=function(){
	};

	p.deit=function(){
	};

	oG.Modules.HighScoresTable=createjs.promote(HighScoresTable,'Container');
}(opdGame));
