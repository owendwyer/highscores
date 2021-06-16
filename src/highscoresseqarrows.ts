import PIXI from 'pixi.js';
import { makeRect } from './highscoresutils';
import { HSDisplaySettings} from './highscorestypes';

class HighScoresSeqArrows extends PIXI.Container {
	private rArrow:PIXI.Container;
	private lArrow:PIXI.Container;
	constructor(dSettings:HSDisplaySettings) {
		super();

		this.carouselClick = this.carouselClick.bind(this);

		this.rArrow = new PIXI.Container();
		this.lArrow = new PIXI.Container();

		let rRect = new PIXI.Graphics();
		let lRect = new PIXI.Graphics();
		makeRect(rRect, 120, 80, 0, 0xffffff, 0xffffff);
		makeRect(lRect, 120, 80, 0, 0xffffff, 0xffffff);
		rRect.alpha = 0.01;
		lRect.alpha = 0.01;

		this.rArrow.addChild(rRect);
		this.lArrow.addChild(lRect);

		let rArr = this.drawArrow(12, dSettings.arrowColor);
		let lArr = this.drawArrow(12, dSettings.arrowColor);
		lArr.rotation = Math.PI;

		this.rArrow.addChild(rArr);
		this.lArrow.addChild(lArr);

		this.rArrow.x = dSettings.seqArrowsWidth / 2;
		this.lArrow.x = -dSettings.seqArrowsWidth / 2;

		this.addChild(this.rArrow, this.lArrow);
	}

	hideArrows() {
		this.rArrow.visible = false;
		this.lArrow.visible = false;
	}

	showArrows() {
		this.rArrow.visible = true;
		this.lArrow.visible = true;
	}

	carouselClick(e:PIXI.InteractionEvent) {
		if (e.currentTarget === this.rArrow) {
			this.emit('seqnext');
		} else {
			this.emit('seqprev');
		}
	}

	addLists() {
		this.rArrow.on('pointertap', this.carouselClick);
		this.lArrow.on('pointertap', this.carouselClick);
		this.rArrow.buttonMode = true;
		this.lArrow.buttonMode = true;
		this.rArrow.interactive = true;
		this.lArrow.interactive = true;
	}

	removeLists() {
		this.rArrow.off('pointertap');
		this.lArrow.off('pointertap');
		this.rArrow.buttonMode = false;
		this.lArrow.buttonMode = false;
		this.rArrow.interactive = false;
		this.lArrow.interactive = false;
	}

	drawArrow(size:number, color:number) {
		let outShape = new PIXI.Graphics();
		outShape.beginFill(color);
		outShape.lineStyle(1, 0x999999);
		outShape.arc(0, 0, size * 0.56, -1, 1);
		outShape.arc(-size, size, size * 0.40, 1, Math.PI);
		outShape.arc(-size, -size, size * 0.40, Math.PI, -1);
		outShape.closePath();
		return outShape;
	}
}

export default HighScoresSeqArrows;
