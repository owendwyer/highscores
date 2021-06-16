
(function(oG){
	function HighScoresSeqArrows(){
		this.Container_constructor();
		this.carouselClickFun=this.carouselClick.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoresSeqArrows,createjs.Container);

	p.setup=function(){
		this.nextEvent=new createjs.Event('seqnext');
		this.prevEvent=new createjs.Event('seqprev');
		this.rArrow=new createjs.Container();
		this.lArrow=new createjs.Container();

		var rRect=opdLib.makeRectangle(120,80,0,'#fff');
		rRect.alpha=0.01;
		var lRect=opdLib.makeRectangle(120,80,0,'#fff');
		lRect.alpha=0.01;

		this.rArrow.addChild(rRect);
		this.lArrow.addChild(lRect);

		this.addChild(this.rArrow,this.lArrow);
	};

	p.initialSetup=function(){
		var rArr=this.drawArrow(12,'#ddd');
		var lArr=this.drawArrow(12,'#ddd');
		lArr.rotation=180;
		this.rArrow.mouseChildren=false;
		this.lArrow.mouseChildren=false;
		this.rArrow.cursor='pointer';
		this.lArrow.cursor='pointer';
		this.rArrow.dir='next';
		this.lArrow.dir='prev';

		this.rArrow.addChild(rArr);
		this.lArrow.addChild(lArr);

		this.rArrow.x=oG.HSModel.seqArrowsWidth/2;
		this.lArrow.x=-oG.HSModel.seqArrowsWidth/2;
	};

	p.hideArrows=function(){
		this.rArrow.visible=false;
		this.lArrow.visible=false;
	};

	p.showArrows=function(){
		this.rArrow.visible=true;
		this.lArrow.visible=true;
	};

	p.carouselClick=function(e){
		if(e.currentTarget.dir==='next'){
			this.dispatchEvent(this.nextEvent);
		}else{
			this.dispatchEvent(this.prevEvent);
		}
	};

	p.addLists=function(){
		this.rArrow.addEventListener('click',this.carouselClickFun);
		this.lArrow.addEventListener('click',this.carouselClickFun);
	};

	p.removeLists=function(){
		this.rArrow.removeEventListener('click',this.carouselClickFun);
		this.lArrow.removeEventListener('click',this.carouselClickFun);
	};

	p.drawArrow=function(size,color){
		var outShape=new createjs.Shape();
		outShape.graphics.beginFill(color);
		outShape.graphics.beginStroke('#888');
		outShape.graphics.arc(0,0,size*0.56,-1,1);
		outShape.graphics.arc(-size,size,size*0.40,1,Math.PI);
		outShape.graphics.arc(-size,-size,size*0.40,Math.PI,-1);
		outShape.graphics.closePath();
		return outShape;
	};

	oG.Modules.HighScoresSeqArrows=createjs.promote(HighScoresSeqArrows,'Container');
}(opdGame));
