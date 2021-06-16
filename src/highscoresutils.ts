
import PIXI from 'pixi.js';
//this utils duplicates some functions in general/utils
//this is to keep the highscores stuff encapsulated and as indepdent from rest of code

function makeArrow(g:PIXI.Graphics, size:number, s:number, f:number) {
	g.clear();
	g.beginFill(f);
	g.lineStyle(1, s);
	g.arc(0, 0, size * 0.56, -1, 1);
	g.arc(-size, size, size * 0.40, 1, Math.PI);
	g.arc(-size, -size, size * 0.40, Math.PI, -1);
	g.closePath();
}

function makeRect(g:PIXI.Graphics, w:number, h:number, r:number, s:number, f:number) {
	g.clear();
	g.beginFill(f);
	g.lineStyle(1, s);
	g.drawRoundedRect(-w / 2, -h / 2, w, h, r);
}

function makeRectWithBorder(g:PIXI.Graphics, w:number, h:number, r:number, r2:number, m:number, c0:number, c1:number, c2:number, c3:number) {
	g.clear();
	g.lineStyle(1, c0);
	g.beginFill(c1);
	g.drawRoundedRect(-w / 2, -h / 2, w, h, r);
	w -= m;
	h -= m;
	g.lineStyle(1, c2);
	g.beginFill(c3);
	g.drawRoundedRect(-w / 2, -h / 2, w, h, r2);
}

function capitalizeFirst(inText:string) {
	return inText.charAt(0).toUpperCase() + inText.slice(1);
}

export { makeArrow, makeRect, capitalizeFirst, makeRectWithBorder };
