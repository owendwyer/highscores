
(function(oG){
	oG.HSModel={
		playerScore1:0,
		playerScore2:0,
		playerName:'',
		playerLocation:'',
		submitSent:false,
		scoresReceived:false,
		scoreType:['score'],
		scoreTypes:{
			score:['score'],
			time:['time'],
			timeRound:['time','score'],
			movesTime:['moves','time'],
			scoreMoves:['score','moves'],
			scoreTime:['score','time']
		},
		seqList:['offline','scores','scoresMonthly','scoresWeekly','scoresToday'],
		seqOrders:[
			[0],//just offline
			[1],//just all
			[1,2],//all & monthly
			[1,2,3],// all, monthly, weekly
			[1,2,4]// all, monthly, today
		],
		playerPositions:[null,null,null,null,null],
		displaySeq:[],
		displayInd:0,
		maxScore:0,
		adjustYs:[0,0],
		fonts:['Arial','Arial','Arial'],
		fontColors:['#333','#444','#444','#444','#555'],
		fontSizes:[36,24,18,16,16],
		fontSizesPort:[36,24,18,16,16],
		seqArrowsWidth:300,
		backPaneColors:['#aaa','#ccc','#aaa','#fff'],
		backPaneMargin:0,
		backPaneAlpha:0.4,
		scoresPaneMargin:4,
		scoresPaneAlpha:1,
		highlightColors:['#999','#ff9'],
		highlightAlpha:0.4,
		submitTextY:6,
		submitBorder:0,
		entryMaxLength:11,
		entryShadeWidth:550,
		arrowColor:'#ff8',
		scores:{
			offline:[
				{nom:'Newton',local:'England',score:1000,dote:'1687'},
				{nom:'Austen',local:'England',score:900,dote:'1811'},
				{nom:'Dickens',local:'England',score:800,dote:'1861'},
				{nom:'Bronte',local:'England',score:100,dote:'1847'},
				{nom:'Blake',local:'England',score:600,dote:'1804'},
				{nom:'Orwell',local:'England',score:400,dote:'1984'},
				{nom:'Locke',local:'England',score:200,dote:'1689'}
			]
		}
	};
}(opdGame));
