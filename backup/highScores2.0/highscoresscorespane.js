
(function(oG){//checked
	function HighScoresScoresPane(){
		this.Container_constructor();
		this.setup();
	}
	var p=createjs.extend(HighScoresScoresPane,createjs.Container);

	p.setup=function(){
	};

	p.initialSetup=function(){
		this.back=new createjs.Shape();
		this.back.alpha=oG.HSModel.scoresPaneAlpha;
		var myFont='bold '+oG.HSModel.fontSizes[3]+'px '+oG.HSModel.fonts[2];
		this.scoreDisp=new createjs.Text('0',myFont,oG.HSModel.fontColors[3]);
		this.scoreLabel=new createjs.Text(this.scoreLabelText1,myFont,oG.HSModel.fontColors[3]);
		opdLib.centerText(this.scoreLabel);
		opdLib.centerText(this.scoreDisp);
		this.addChild(this.back,this.scoreLabel,this.scoreDisp);
		this.setupDisplay();
	};

	p.setupDisplay=function(){
		this.back.graphics.clear();
		var backWidth=116;
		var backHeight=80;
		var fSize=oG.HSModel.fontSizes[3];
		if(oG.model.orientation===0){
			opdLib.posItem(this.scoreLabel,0,-5);
			opdLib.posItem(this.scoreDisp,0,20);
		}else{
			backWidth=210;
			fSize=oG.HSModel.fontSizesPort[3];
			opdLib.posItem(this.scoreLabel,-40,9);
			opdLib.posItem(this.scoreDisp,44,9);
		}
		var myFont='bold '+fSize+'px '+oG.HSModel.fonts[2];
		this.scoreDisp.font=myFont;
		this.scoreLabel.font=myFont;

		var w=backWidth;
		var h=backHeight;
		var r=20;
		if(oG.HSModel.scoresPaneMargin>0){
			this.back.graphics.clear().beginStroke(oG.HSModel.backPaneColors[0]).beginFill(oG.HSModel.backPaneColors[1]);
			this.back.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
			w-=oG.HSModel.scoresPaneMargin;
			h-=oG.HSModel.scoresPaneMargin;
			r-=Math.floor(oG.HSModel.scoresPaneMargin/3);
		}
		this.back.graphics.beginStroke(oG.HSModel.backPaneColors[2]).beginFill(oG.HSModel.backPaneColors[3]);
		this.back.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
	};

	p.setScores=function(){
		this.scoreLabel.text=opdLib.capitalizeFirst(oG.HSModel.scoreType[0]);
		this.scoreDisp.text=oG.HSModel.playerScore1;
	};

	oG.Modules.HighScoresScoresPane=createjs.promote(HighScoresScoresPane,'Container');
}(opdGame));
