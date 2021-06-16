
//this should match the type in display.ts - it is added here so that highscores doesnt rely on anything else
export interface DisplayVars{
	scale:number;
	orient: number;
	textRes: number;
}

export interface HSSettings{
	URL: string,
	SCORE_TYPE: string[],
	TABLE_TYPE: string,
	SCORES_TABLE: string,
	OFFLINE_TYPE: string
};

export interface HSDisplaySettings{
	adjustYs: number[],
	fonts: string[],
	fontColors: number[],
	fontSizes: number[],
	fontSizesPort: number[],
	seqArrowsWidth: number,
	backPaneColors: number[],
	backPaneMargin: number,
	backPaneAlpha: number,
	scoresPaneMargin: number,
	scoresPaneAlpha: number,
	highlightColors: number[],
	highlightAlpha: number,
	submitBorder: number,
	entryMaxLength: number,
	entryShadeWidth: number,
	arrowColor: number,
	arrowStroke: number,
	titleLabels: string[],
	xPositions: number[],
};

export interface HSScoresLine{
	nom: string,
	local: string,
	id:number,
	score: number,
	time:number,
	moves:number,
	dote: string
}

export interface HSObject{
	[key:number]:HSScoresLine[]
}
