import PIXI from 'pixi.js';
import { capitalizeFirst } from './highscoresutils';
import {DisplayVars,HSDisplaySettings} from './highscorestypes';

class HighScoresScoresPane extends PIXI.Container {
	private back:PIXI.Graphics;
	private scoreDisp:PIXI.Text;
	private scoreLabel:PIXI.Text;
	constructor(dVars:DisplayVars, dSettings:HSDisplaySettings) {
		super();
		this.back = new PIXI.Graphics();
		this.back.alpha = dSettings.scoresPaneAlpha;
		this.scoreDisp = new PIXI.Text('0', {
			fontFamily: dSettings.fonts[2],
			fill: dSettings.fontColors[3],
			fontWeight: 'bold'
		});

		this.scoreLabel = new PIXI.Text('label', {
			fontFamily: dSettings.fonts[2],
			fill: dSettings.fontColors[3],
			fontWeight: 'bold'
		});

		this.scoreLabel.anchor.set(0.5);
		this.scoreDisp.anchor.set(0.5);
		this.addChild(this.back, this.scoreLabel, this.scoreDisp);
		this.setupDisplay(dVars, dSettings);
	}

	setupDisplay(dVars:DisplayVars, dSettings:HSDisplaySettings) {
		this.back.clear();
		let backWidth = 116;
		let backHeight = 80;
		if (dVars.orient === 0) {
			this.scoreLabel.position.set(0, -10);
			this.scoreDisp.position.set(0, 15);
			this.scoreLabel.style.fontSize = dSettings.fontSizes[3];
			this.scoreDisp.style.fontSize = dSettings.fontSizes[3];
		} else {
			backWidth = 210;
			this.scoreLabel.position.set(-40, 0);
			this.scoreDisp.position.set(44, 0);
			this.scoreLabel.style.fontSize = dSettings.fontSizesPort[3];
			this.scoreDisp.style.fontSize = dSettings.fontSizesPort[3];
		}

		let w = backWidth;
		let h = backHeight;
		let r = 20;
		if (dSettings.scoresPaneMargin > 0) {
			this.back.lineStyle(1, dSettings.backPaneColors[0]);
			this.back.beginFill(dSettings.backPaneColors[1]);
			this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
			w -= dSettings.scoresPaneMargin;
			h -= dSettings.scoresPaneMargin;
			r -= Math.floor(dSettings.scoresPaneMargin / 3);
		}
		this.back.beginFill(dSettings.backPaneColors[3]);
		this.back.lineStyle(1, dSettings.backPaneColors[2]);
		this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);

		this.scoreLabel.resolution = dVars.textRes;
		this.scoreDisp.resolution = dVars.textRes;
	}

	setScores(label:string, score:number) {
		this.scoreLabel.text = capitalizeFirst(label);
		this.scoreDisp.text = score.toString();
	}
}

export default HighScoresScoresPane;
