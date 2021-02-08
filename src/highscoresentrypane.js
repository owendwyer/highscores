import PIXI from 'pixi.js';
import HighScoresEntryInputs from './highscoresentryinputs';

class HighScoresEntryPane extends PIXI.Container {
	constructor(displayVars, dStngs) {
		super();
		this.visible = false;

		this.submitClick = this.submitClick.bind(this);
		this.enterClick = this.enterClick.bind(this);
		this.cancelClick = this.cancelClick.bind(this);

		this.back = new PIXI.Graphics();
		this.back.alpha = dStngs.scoresPaneAlpha;
		this.backShade = new PIXI.Graphics();
		this.submitBut = new PIXI.Container();
		this.submitButBack = new PIXI.Graphics();
		this.cancelBut = new PIXI.Container();
		this.cancelButBack = new PIXI.Graphics();
		this.enterBut = new PIXI.Container();
		this.enterButBack = new PIXI.Graphics();
		this.inputFields = new HighScoresEntryInputs(displayVars, dStngs);

		this.enterText = new PIXI.Text('Enter', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });
		this.enterText.anchor.set(0.5);
		this.enterBut.cursor = 'pointer';
		this.enterBut.addChild(this.enterButBack, this.enterText);

		this.nameLabel = new PIXI.Text('Name', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[3], fontWeight: 'bold' });
		this.localLabel = new PIXI.Text('Location', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[3], fontWeight: 'bold' });
		this.submitText = new PIXI.Text('Enter', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });
		this.cancelText = new PIXI.Text('Cancel', { fontFamily: dStngs.fonts[2], fill: dStngs.fontColors[4], fontWeight: 'bold' });

		this.submitText.anchor.set(0.5);
		this.cancelText.anchor.set(0.5);
		this.nameLabel.anchor.set(0.5);
		this.localLabel.anchor.set(0.5);

		this.submitBut.cursor = 'pointer';
		this.submitBut.addChild(this.submitButBack, this.submitText);
		this.cancelBut.cursor = 'pointer';
		this.cancelBut.addChild(this.cancelButBack, this.cancelText);

		this.addChild(this.enterBut, this.backShade, this.back, this.submitBut, this.cancelBut);
		this.addChild(this.nameLabel, this.localLabel, this.inputFields);

		this.setupDisplay(displayVars, dStngs);
	}

	setupDisplay(displayVars, dStngs) {
		this.orient = displayVars.orient;
		if (displayVars.orient === 0) {
			this.submitBut.position.set(0, 110);
			this.nameLabel.position.set(0, -48);
			this.localLabel.position.set(0, 18);
		} else {
			this.submitBut.position.set(-0, 85);
			this.nameLabel.position.set(-0, -180);
			this.localLabel.position.set(0, -65);
			this.cancelBut.position.set(0, 165);
			this.enterBut.position.set(115, 250);
		}
		this.setupBack(displayVars, dStngs);
		this.setupButs(displayVars, dStngs);
		this.setupFonts(displayVars, dStngs);
	}

	displayChange(displayVars, dStngs) {
		this.setupDisplay(displayVars, dStngs);
		this.inputFields.displayChange(displayVars, dStngs);
		if (this.visible) this.show();
	}

	updateInputs(displayVars) {
		this.inputFields.updateInputs(displayVars);
	}

	setInputOffsets(entryPaneX, entryPaneY) {
		this.inputFields.setInputOffsets(entryPaneX, entryPaneY);
	}

	setupBack(displayVars, dStngs) {
		let w = displayVars.orient === 0 ? 116 : 340;
		let h = displayVars.orient === 0 ? 160 : 470;
		let r = displayVars.orient === 0 ? 22 : 36;
		this.back.clear();
		if (dStngs.scoresPaneMargin > 0) {
			this.back.beginFill(dStngs.backPaneColors[1]);
			this.back.lineStyle(1, dStngs.backPaneColors[0]);
			this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
			w -= dStngs.scoresPaneMargin;
			h -= dStngs.scoresPaneMargin;
			r -= Math.floor(dStngs.scoresPaneMargin / 3);
		}
		this.back.lineStyle(1, dStngs.backPaneColors[2]);
		this.back.beginFill(dStngs.backPaneColors[3]);
		this.back.drawRoundedRect(-w / 2, -h / 2, w, h, r);
	}

	setupButs(displayVars, dStngs) {
		let w = displayVars.orient === 0 ? 112 : 260;
		let h = displayVars.orient === 0 ? 44 : 72;
		let r = displayVars.orient === 0 ? 16 : 20;
		this.submitButBack.clear();
		this.submitButBack.beginFill(0xffff88);
		if (dStngs.submitBorder > 0) this.submitButBack.lineStyle(1, 0xaaaaaa);
		this.submitButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		this.cancelButBack.clear();
		this.cancelButBack.beginFill(0xcccccc);
		this.cancelButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		w = 210;
		h = 75;
		this.enterButBack.clear();
		this.enterButBack.beginFill(0xffff88);
		if (dStngs.submitBorder > 0) this.enterButBack.lineStyle(1, 0xaaaaaa);
		this.enterButBack.drawRoundedRect(-w / 2, -h / 2, w, h, r);
		w = dStngs.entryShadeWidth;
		this.backShade.clear();
		this.backShade.beginFill(0x000000);
		this.backShade.drawRect(-w / 2, -400, w, 800);
		this.backShade.alpha = 0.6;
	}

	setupFonts(displayVars, dStngs) {
		let fontSizes = displayVars.orient === 0 ? dStngs.fontSizes : dStngs.fontSizesPort;
		this.enterText.style.fontSize = fontSizes[4];
		this.nameLabel.style.fontSize = fontSizes[3];
		this.localLabel.style.fontSize = fontSizes[3];
		this.submitText.style.fontSize = fontSizes[4];
		this.cancelText.style.fontSize = fontSizes[4];
		this.enterText.resolution = displayVars.textRes;
		this.nameLabel.resolution = displayVars.textRes;
		this.localLabel.resolution = displayVars.textRes;
		this.submitText.resolution = displayVars.textRes;
		this.cancelText.resolution = displayVars.textRes;
	}

	submitClick() {
		let inputs = this.inputFields.getInputs();
		if (inputs.nom.length > 0 && inputs.loc.length > 0) {
			this.hide();//this is important to prevent double clicks
			this.emit('submitclick', inputs.nom, inputs.loc);
		}
	}

	cancelClick() {
		this.toggleEntryPane(false);
	}

	enterClick() {
		this.toggleEntryPane(true);
	}

	show() {
		this.visible = true;
		if (this.orient === 0) {
			this.showLand();
		} else {
			this.showPort();
		}
		//stuff here
		//remember, this is typically called b4 init
	}

	hide() {
		this.visible = false;
		this.inputFields.hideFields();
	}

	showLand() {
		this.back.visible = true;
		this.submitBut.visible = true;
		this.nameLabel.visible = true;
		this.localLabel.visible = true;
		this.backShade.visible = false;
		this.enterBut.visible = false;
		this.cancelBut.visible = false;
		this.inputFields.showFields(true);
	}

	showPort() {
		this.enterBut.visible = true;
		this.back.visible = false;
		this.nameLabel.visible = false;
		this.localLabel.visible = false;
		this.submitBut.visible = false;
		this.cancelBut.visible = false;
		this.backShade.visible = false;
		this.inputFields.hideFields();
	}

	toggleEntryPane(showBool) {
		let myBool = showBool;
		this.back.visible = myBool;
		this.cancelBut.visible = myBool;
		this.submitBut.visible = myBool;
		this.nameLabel.visible = myBool;
		this.localLabel.visible = myBool;
		this.backShade.visible = myBool;
		if (showBool) {
			this.inputFields.showFields(false);
		} else {
			this.inputFields.hideFields();
		}
	}

	init() {
		document.addEventListener('keyup', this.keyPress);
		this.submitBut.on('pointerup', this.submitClick);
		this.cancelBut.on('pointerup', this.cancelClick);
		this.enterBut.on('pointerup', this.enterClick);
		this.backShade.on('pointerup', this.cancelClick);

		this.submitBut.interactive = true;
		this.cancelBut.interactive = true;
		this.enterBut.interactive = true;
		this.submitBut.buttonMode = true;

		this.inputFields.init();
	}

	deit() {
		this.submitBut.off('pointerup');
		this.cancelBut.off('pointerup');
		this.enterBut.off('pointerup');
		this.backShade.off('pointerup');

		this.submitBut.interactive = false;
		this.cancelBut.interactive = false;
		this.enterBut.interactive = false;
		this.submitBut.buttonMode = false;

		this.inputFields.deit();
	}
}

export default HighScoresEntryPane;
