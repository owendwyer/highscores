
(function(oG){
	function HighScoresArrows(){
		this.Container_constructor();
		this.startUpFun=this.startUp.bind(this);
		this.stopUpFun=this.stopUp.bind(this);
		this.startDownFun=this.startDown.bind(this);
		this.stopDownFun=this.stopDown.bind(this);
		this.scrollUpFun=this.scrollUp.bind(this);
		this.scrollDownFun=this.scrollDown.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoresArrows,createjs.Container);
	var tapScrollLen=8;

	p.setup=function(){
		this.upEvent=new createjs.Event('scrollup');
		this.downEvent=new createjs.Event('scrolldown');
		this.myUpBut=new createjs.Container();
		this.myDownBut=new createjs.Container();
		this.myUpBut.cursor='pointer';
		this.myDownBut.cursor='pointer';
		this.addChild(this.myUpBut,this.myDownBut);
	};

	p.initialSetup=function(){
		var myUpArrow=opdLib.drawArrow(32,oG.HSModel.arrowColor);
		var myDownArrow=opdLib.drawArrow(32,oG.HSModel.arrowColor);
		myUpArrow.rotation=-90;
		myDownArrow.rotation=90;

		var upRect=opdLib.makeRectangle(120,80,0,'#fff');
		upRect.alpha=0.01;
		var downRect=opdLib.makeRectangle(120,80,0,'#fff');
		downRect.alpha=0.01;

		this.myUpBut.addChild(myUpArrow,upRect);
		this.myDownBut.addChild(myDownArrow,downRect);
		this.myUpBut.mouseChildren=false;
		this.myDownBut.mouseChildren=false;

		if(oG.model.touchMode){
			upRect.visible=true;
			downRect.visible=true;
		}else{
			upRect.visible=false;
			downRect.visible=false;
		}
		this.setupDisplay();
	};

	p.setupDisplay=function(){
		var yAdj=oG.model.orientation===0?oG.HSModel.adjustYs[0]:oG.HSModel.adjustYs[1];
		if(oG.model.orientation===0){
			opdLib.posItem(this.myUpBut,735,180+yAdj);
			opdLib.posItem(this.myDownBut,735,290+yAdj);
		}else{
			opdLib.posItem(this.myUpBut,275,30+yAdj);
			opdLib.posItem(this.myDownBut,275,578+yAdj);
		}
	};

	p.startUp=function(){
		this.delta=0;
		createjs.Ticker.addEventListener('tick',this.scrollUpFun);
		this.myUpBut.addEventListener('mouseout',this.stopUpFun);
	};

	p.stopUp=function(){
		if(!oG.model.touchMode){
			createjs.Ticker.removeEventListener('tick',this.scrollUpFun);
			this.myUpBut.removeEventListener('mouseout',this.stopUpFun);
			if(this.delta===0)this.scrollUp();
		}else{
			for(var i=0;i<tapScrollLen;i++){this.scrollUp();}
		}
		this.delta=0;
	};

	p.startDown=function(){
		this.delta=0;
		createjs.Ticker.addEventListener('tick',this.scrollDownFun);
		this.myDownBut.addEventListener('mouseout',this.stopDownFun);
	};

	p.stopDown=function(){
		if(!oG.model.touchMode){
			createjs.Ticker.removeEventListener('tick',this.scrollDownFun);
			this.myDownBut.removeEventListener('mouseout',this.stopDownFun);
			if(this.delta===0)this.scrollDown();
		}else{
			for(var i=0;i<tapScrollLen;i++){this.scrollDown();}
		}
		this.delta=0;
	};

	p.scrollUp=function(){
		this.delta++;
		this.dispatchEvent(this.upEvent);
	};

	p.scrollDown=function(){
		this.delta++;
		this.dispatchEvent(this.downEvent);
	};

	p.addLists=function(){
		if(!oG.model.touchMode){
			this.myUpBut.addEventListener('mousedown',this.startUpFun);
			this.myDownBut.addEventListener('mousedown',this.startDownFun);
		}
		this.myUpBut.addEventListener('click',this.stopUpFun);
		this.myDownBut.addEventListener('click',this.stopDownFun);
	};

	p.removeLists=function(){
		if(!oG.model.touchMode){
			this.myUpBut.removeEventListener('mousedown',this.startUpFun);
			this.myDownBut.removeEventListener('mousedown',this.startDownFun);
		}
		this.myUpBut.removeEventListener('click',this.stopUpFun);
		this.myDownBut.removeEventListener('click',this.stopDownFun);
	};

	oG.Modules.HighScoresArrows=createjs.promote(HighScoresArrows,'Container');
}(opdGame));
