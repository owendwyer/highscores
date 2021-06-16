
(function(oG){//checked
	function HighScoresEntryPane(){
		this.Container_constructor();
		this.submitClickFun=this.submitClick.bind(this);
		this.enterClickFun=this.enterClick.bind(this);
		this.cancelClickFun=this.cancelClick.bind(this);
		this.showFieldsFun=this.showFields.bind(this);
		this.keyPressFun=this.keyPress.bind(this);
		this.emptyFun=this.empty.bind(this);
		this.showFields2Fun=this.showFields2.bind(this);
		this.setup();
	}
	var p=createjs.extend(HighScoresEntryPane,createjs.Container);
	var bStyles=['1px solid #bbb','1px solid #fd0'];

	p.setup=function(){
		this.curRat=-1;
		this.fieldsTimer=null;
	};

	p.initialSetup=function(){
		this.fontSizes=oG.model.orientation===0?oG.HSModel.fontSizes:oG.HSModel.fontSizesPort;
		this.myFont='bold '+this.fontSizes[4]+'px '+oG.HSModel.fonts[2];
		var subFont='bold '+this.fontSizes[5]+'px '+oG.HSModel.fonts[2];
		this.myCan=document.getElementById('myCanvas');

		this.back=new createjs.Shape();
		this.back.alpha=oG.HSModel.scoresPaneAlpha;
		this.backShade=new createjs.Shape();
		this.submitBut=new createjs.Container();
		this.submitButBack=new createjs.Shape();
		this.cancelBut=new createjs.Container();
		this.cancelButBack=new createjs.Shape();
		this.enterBut=new createjs.Container();
		this.enterButBack=new createjs.Shape();

		this.enterText=new createjs.Text('Enter',subFont,oG.HSModel.fontColors[4]);
		opdLib.centerText(this.enterText);
		this.enterBut.cursor='pointer';
		this.enterBut.addChild(this.enterButBack,this.enterText);

		this.nameLabel=new createjs.Text('Name',this.myFont,oG.HSModel.fontColors[3]);
		this.localLabel=new createjs.Text('Location',this.myFont,oG.HSModel.fontColors[3]);
		this.submitText=new createjs.Text('Enter',subFont,oG.HSModel.fontColors[4]);
		this.cancelText=new createjs.Text('Cancel',subFont,oG.HSModel.fontColors[4]);
		opdLib.centerText(this.submitText);
		opdLib.centerText(this.cancelText);
		opdLib.centerText(this.nameLabel);
		opdLib.centerText(this.localLabel);

		this.submitBut.cursor='pointer';
		this.submitBut.addChild(this.submitButBack,this.submitText);
		this.cancelBut.cursor='pointer';
		this.cancelBut.addChild(this.cancelButBack,this.cancelText);

		this.addChild(this.enterBut,this.backShade,this.back,this.submitBut,this.cancelBut,this.nameLabel,this.localLabel);

		this.nDiv=document.createElement('input');
		this.nDiv.id='inputName';
		this.setInputStyle(this.nDiv);
		document.getElementById('containerDiv').appendChild(this.nDiv);
		this.lDiv=document.createElement('input');
		this.lDiv.id='inputLocal';
		this.setInputStyle(this.lDiv);
		document.getElementById('containerDiv').appendChild(this.lDiv);

		this.nObj=new createjs.DOMElement('inputName');
		this.lObj=new createjs.DOMElement('inputLocal');
		this.nCont=new createjs.Container();
		this.lCont=new createjs.Container();
		this.nCont.addChild(this.nObj);
		this.lCont.addChild(this.lObj);
		this.addChild(this.nCont);
		this.addChild(this.lCont);

		this.setupDisplay();
	};

//////////////////////
//simply all these with arrays
	p.setupDisplay=function(){
		var backHeight=160;
		var backWidth=116;
		var backRnd=22;
		var subWidth=112;
		var subHeight=44;
		var subRound=16;
		if(oG.model.orientation===0){
			opdLib.posItem(this.submitBut,0,110);
			opdLib.posItem(this.nameLabel,0,-42);
			opdLib.posItem(this.localLabel,0,20);
			this.nameElemX=0;
			this.nameElemY=-22;
			this.localElemX=0;
			this.localElemY=40;
			this.fieldWidth=80;
			this.fieldHeight=18;
		}else{
			backHeight=470;
			backWidth=340;
			backRnd=36;
			subWidth=260;
			subHeight=72;
			subRound=20;
			opdLib.posItem(this.submitBut,-0,85);
			opdLib.posItem(this.cancelBut,0,165);
			opdLib.posItem(this.nameLabel,-0,-170);
			opdLib.posItem(this.localLabel,0,-55);
			this.nameElemX=-1;
			this.nameElemY=-130;
			this.localElemX=-1;
			this.localElemY=-15;
			this.fieldWidth=230;
			this.fieldHeight=44;
			opdLib.posItem(this.enterBut,115,250);
		}
		var subY=oG.HSModel.submitTextY[oG.model.orientation];
		this.enterText.y=subY;
		this.cancelText.y=subY;
		this.submitText.y=subY;
		var w=backWidth;
		var h=backHeight;
		var r=backRnd;
		if(oG.HSModel.scoresPaneMargin>0){
			this.back.graphics.clear().beginStroke(oG.HSModel.backPaneColors[0]).beginFill(oG.HSModel.backPaneColors[1]);
			this.back.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
			w-=oG.HSModel.scoresPaneMargin;
			h-=oG.HSModel.scoresPaneMargin;
			r-=Math.floor(oG.HSModel.scoresPaneMargin/3);
		}
		this.back.graphics.beginStroke(oG.HSModel.backPaneColors[2]).beginFill(oG.HSModel.backPaneColors[3]);
		this.back.graphics.drawRoundRect(-w/2,-h/2,w,h,r);

		w=subWidth;
		h=subHeight;
		r=subRound;
		this.submitButBack.graphics.clear().beginFill('#ff8');
		if(oG.HSModel.submitBorder>0)this.submitButBack.graphics.beginStroke('#aaa');
		this.submitButBack.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
		this.cancelButBack.graphics.clear().beginFill('#ccc').drawRoundRect(-w/2,-h/2,w,h,r);
		w=210;
		h=75;
		this.enterButBack.graphics.clear().beginFill('#ff8');
		if(oG.HSModel.submitBorder>0)this.enterButBack.graphics.beginStroke('#aaa');
		this.enterButBack.graphics.drawRoundRect(-w/2,-h/2,w,h,r);
		w=oG.HSModel.entryShadeWidth;
		this.backShade.graphics.clear().beginFill('#000').drawRoundRect(-w/2,-400,w,800,18);
		this.backShade.alpha=0.6;
	};

	p.updateFontSizes=function(){
		this.fontSizes=oG.model.orientation===0?oG.HSModel.fontSizes:oG.HSModel.fontSizesPort;
		this.myFont='bold '+this.fontSizes[4]+'px '+oG.HSModel.fonts[2];
		var subFont='bold '+this.fontSizes[5]+'px '+oG.HSModel.fonts[2];
		this.nameLabel.font=this.myFont;
		this.localLabel.font=this.myFont;
		this.submitText.font=subFont;
		this.enterText.font=subFont;
		this.cancelText.font=subFont;
	};

	p.showFields=function(){
		this.fieldsTimer=setTimeout(this.showFields2Fun,100);
	};

	p.showFields2=function(){
		document.querySelector('input').autofocus=true;
		this.nDiv.style.display='block';
		this.lDiv.style.display='block';
	};

	p.updateInputs=function(){
		var rat=oG.model.canvasRatio;
		if(rat!==this.curRat){
			this.curRat=rat;
			var wid=Math.round(this.fieldWidth*rat);
			var hei=Math.round(this.fieldHeight*rat);
			var paneX=this.x*rat-this.x;
			var paneY=this.y*rat-this.y;
			var xOff=Math.round(this.myCan.offsetLeft-wid/2+paneX);
			var yOff=Math.round(this.myCan.offsetTop-hei/2+paneY);
			var newFontSize=Math.round(this.fontSizes[4]*rat);
			newFontSize=Math.floor(newFontSize);
			this.nDiv.style.fontSize=newFontSize+'px';
			this.lDiv.style.fontSize=newFontSize+'px';
			this.nDiv.style.height=hei+'px';
			this.lDiv.style.height=hei+'px';
			this.nDiv.style.width=wid+'px';
			this.lDiv.style.width=wid+'px';
			this.nCont.x=Math.round(xOff+(this.nameElemX*rat));
			this.nCont.y=Math.round(yOff+(this.nameElemY*rat));
			this.lCont.x=Math.round(xOff+(this.localElemX*rat));
			this.lCont.y=Math.round(yOff+(this.localElemY*rat));
		}
	};

	p.endSubmit=function(){
		this.visible=false;
		this.nDiv.style.display='none';
		this.lDiv.style.display='none';
	};

	p.cleanInputs=function(){
		var max=oG.HSModel.entryMaxLength;
		var nom=this.nObj.htmlElement.value;
		if(nom.length>max)nom=nom.slice(0,max);
		nom=nom.replace(/[^a-zA-Z ]/g, '');
		this.nObj.htmlElement.value=nom;
		var loc=this.lObj.htmlElement.value;
		if(loc.length>max)loc=loc.slice(0,max);
		loc=loc.replace(/[^a-zA-Z ]/g, '');
		this.lObj.htmlElement.value=loc;
		if(nom.length>0)this.nDiv.style.border=bStyles[0];
		if(loc.length>0)this.lDiv.style.border=bStyles[0];
	};

	p.keyPress=function(){this.cleanInputs();};

	p.submitClick=function(){
		this.cleanInputs();
		var nom=this.nObj.htmlElement.value;
		var loc=this.lObj.htmlElement.value;
		nom=this.checkText(nom);
		loc=this.checkText(loc);
		this.nObj.htmlElement.value=nom;
		this.lObj.htmlElement.value=loc;
		if(nom.length>0&&loc.length>0){
			this.endSubmit();//this is important to prevent double clicks
			var submitEvent=new createjs.Event('submitclick');
			submitEvent.nom=nom;
			submitEvent.loc=loc;
			this.dispatchEvent(submitEvent);
			this.visible=false;
		}else{
			if(loc.length===0)this.lDiv.style.border=bStyles[1];
			if(nom.length===0)this.nDiv.style.border=bStyles[1];
		}
	};

	p.cancelClick=function(){
		this.toggleEntryPane(false);
	};

	p.enterClick=function(){
		this.toggleEntryPane(true);
	};

	p.setInputStyle=function(div){
		div.setAttribute('type','text');
		div.setAttribute('maxlength',oG.HSModel.entryMaxLength);
		div.style.position='absolute';
		div.style.left=0;
		div.style.top=0;
		div.style.display='none';
		div.style.textAlign='center';
		div.style.fontFamily=this.myFont.split('px ')[1];
		div.style.color=oG.HSModel.fontColors[3];
		div.style.textDecoration='none';
		div.style.border=bStyles[0];
		div.style.borderRadius='0.5em';
		div.style.outline.display='none';
		div.style.outline='none';
		div.style.margin='0px';
		div.style.padding='4px 0px';
		div.style.zIndex='4';
	};

	var swearsList=["fuck","shit","dick","suck","cock","twat","gun","shoot","kill",
		"fock","bitch","penis","arse","nigger","vagina","cunt"];

	p.checkText=function(leText){
		var outText=leText.slice(0,oG.HSModel.entryMaxLength);
		outText=outText.replace(/[^a-z]/gi,'');
		outText=outText.toLowerCase();
		for(var i=0;i<swearsList.length;i++){
			var re=new RegExp(swearsList[i],'g');
			outText=outText.replace(re,'');
		}
		outText=outText.charAt(0).toUpperCase()+outText.slice(1);
		return outText;
	};

	p.toggleEntryPane=function(showBool){
		if(oG.model.orientation===0)showBool=true;
		this.back.visible=showBool;
		this.cancelBut.visible=showBool;
		this.submitBut.visible=showBool;
		this.nameLabel.visible=showBool;
		this.localLabel.visible=showBool;
		this.nCont.visible=showBool;
		this.lCont.visible=showBool;
		this.backShade.visible=showBool;
		if(oG.model.orientation===0){
			this.enterBut.visible=false;
			this.backShade.visible=false;
			this.cancelBut.visible=false;
		}else{
			this.enterBut.visible=true;
		}
	};

	p.empty=function(){};

	p.init=function(){
		document.addEventListener('keyup',this.keyPressFun);
		this.submitBut.addEventListener('click',this.submitClickFun);
		this.cancelBut.addEventListener('click',this.cancelClickFun);
		this.enterBut.addEventListener('click',this.enterClickFun);
		this.backShade.addEventListener('click',this.cancelClickFun);
		this.back.addEventListener('click',this.emptyFun);
		this.updateInputs();
		this.toggleEntryPane(false);
	};

	p.deit=function(){
		clearTimeout(this.fieldsTimer);
		this.endSubmit();
		this.submitBut.removeEventListener('click',this.submitClickFun);
		this.cancelBut.removeEventListener('click',this.cancelClickFun);
		this.enterBut.removeEventListener('click',this.enterClickFun);
		this.backShade.removeEventListener('click',this.cancelClickFun);
		this.back.removeEventListener('click',this.emptyFun);
		document.removeEventListener('keyup',this.keyPressFun);
	};

	oG.Modules.HighScoresEntryPane=createjs.promote(HighScoresEntryPane,'Container');
}(opdGame));
