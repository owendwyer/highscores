import PIXI from 'pixi.js';
import gsap from 'gsap';

const SWEARS_LIST = ['fuck', 'shit', 'dick', 'suck', 'cock', 'twat', 'gun', 'shoot', 'kill',
	'fock', 'bitch', 'penis', 'arse', 'nigger', 'vagina', 'cunt'];
const CANVAS_ID = 'myCanvas';//this is defined in display.js

class HighScoresEntryInputs extends PIXI.Container {
	constructor(displayVars, dStngs) {
		super();
		this.myScale = displayVars.scale;
		this.visible = false;
		this.entryMaxLength = dStngs.entryMaxLength;
		this.bStyles = ['1px solid #bbbbbb', '1px solid #ffdd00'];
		this.offsetX = 0;
		this.offsetY = 0;

		this.cleanInputs = this.cleanInputs.bind(this);

		this.fieldTween1 = null;
		this.fieldTween2 = null;

		this.nDiv = document.createElement('input');
		this.nDiv.id = 'inputName';
		this.setInputStyle(this.nDiv, dStngs.fonts[2], dStngs.fontColors[5]);
		document.getElementById('containerDiv').appendChild(this.nDiv);
		this.lDiv = document.createElement('input');
		this.lDiv.id = 'inputLocal';
		this.setInputStyle(this.lDiv, dStngs.fonts[2], dStngs.fontColors[5]);
		document.getElementById('containerDiv').appendChild(this.lDiv);

		this.setupDisplay(displayVars, dStngs);
	}

	setupDisplay(displayVars, dStngs) {
		if (displayVars.orient === 0) {
			this.nameElemX = 0;
			this.nameElemY = -22;
			this.localElemX = 0;
			this.localElemY = 45;
			this.fieldWidth = 84;
			this.fieldHeight = 18;
			this.fontSizes = dStngs.fontSizes;
		} else {
			this.nameElemX = -1;
			this.nameElemY = -130;
			this.localElemX = -1;
			this.localElemY = -15;
			this.fieldWidth = 230;
			this.fieldHeight = 44;
			this.fontSizes = dStngs.fontSizesPort;
		}
	}

	displayChange(displayVars, dStngs) {
		this.setupDisplay(displayVars, dStngs);
	}

	updateInputs(displayVars) {
		this.myScale = displayVars.scale;
		if (this.visible) this.updateInputElements();
	}

	setInputOffsets(entryPaneX, entryPaneY) {
		this.offsetX = entryPaneX;
		this.offsetY = entryPaneY;
	}

	updateInputElements() {
		let wid = Math.round(this.fieldWidth * this.myScale);
		let hei = Math.round(this.fieldHeight * this.myScale);

		let newFontSize = Math.round(this.fontSizes[4] * this.myScale);
		newFontSize = Math.floor(newFontSize);
		this.nDiv.style.fontSize = newFontSize + 'px';
		this.lDiv.style.fontSize = newFontSize + 'px';
		this.nDiv.style.height = hei + 'px';
		this.lDiv.style.height = hei + 'px';
		this.nDiv.style.width = wid + 'px';
		this.lDiv.style.width = wid + 'px';

		let newPadding = Math.round(4 * this.myScale);
		this.nDiv.style.padding = newPadding + 'px 0px';
		this.lDiv.style.padding = newPadding + 'px 0px';

		let myCan = document.getElementById(CANVAS_ID);
		let myX = myCan.offsetLeft;
		let myY = myCan.offsetTop;

		let xPosName = Math.round(myX + (this.offsetX + this.nameElemX) * this.myScale - wid / 2);
		let yPosName = Math.round(myY + (this.offsetY + this.nameElemY) * this.myScale - hei / 2);
		let xPosLocal = Math.round(myX + (this.offsetX + this.localElemX) * this.myScale - wid / 2);
		let yPosLocal = Math.round(myY + (this.offsetY + this.localElemY) * this.myScale - hei / 2);

		this.nDiv.style.left = xPosName + 'px';
		this.nDiv.style.top = yPosName + 'px';
		this.lDiv.style.left = xPosLocal + 'px';
		this.lDiv.style.top = yPosLocal + 'px';
	}

	showFields(fadeIn) {
		this.visible = true;
		this.updateInputElements();
		document.querySelector('input').autofocus = true;
		this.nDiv.style.display = 'block';
		this.lDiv.style.display = 'block';
		if (fadeIn) {
			this.lDiv.style.opacity = 0;
			this.nDiv.style.opacity = 0;
			this.fieldTween1 = gsap.to(this.lDiv, { delay: 0.3, duration: 0.4, opacity: 1 });
			this.fieldTween2 = gsap.to(this.nDiv, { delay: 0.3, duration: 0.4, opacity: 1 });
		}
	}

	hideFields() {
		this.visible = false;
		this.nDiv.style.display = 'none';
		this.lDiv.style.display = 'none';
	}

	cleanInputs() {
		let max = this.entryMaxLength;
		let nom = this.nDiv.value;
		if (nom.length > max)nom = nom.slice(0, max);
		nom = nom.replace(/[^a-zA-Z ]/g, '');
		this.nDiv.value = nom;
		let loc = this.lDiv.value;
		if (loc.length > max)loc = loc.slice(0, max);
		loc = loc.replace(/[^a-zA-Z ]/g, '');
		this.lDiv.value = loc;
		if (nom.length > 0) this.nDiv.style.border = this.bStyles[0];
		if (loc.length > 0) this.lDiv.style.border = this.bStyles[0];
	}

	getInputs() {
		this.cleanInputs();
		let nom = this.nDiv.value;
		let loc = this.lDiv.value;
		nom = this.checkText(nom);
		loc = this.checkText(loc);
		this.nDiv.value = nom;
		this.lDiv.value = loc;
		if (loc.length === 0) this.lDiv.style.border = this.bStyles[1];
		if (nom.length === 0) this.nDiv.style.border = this.bStyles[1];
		return { nom, loc };
	}

	setInputStyle(div, fnt, fntCol) {
		div.setAttribute('type', 'text');
		div.setAttribute('maxlength', this.entryMaxLength);
		div.style.position = 'absolute';
		div.style.left = 0;
		div.style.top = 0;
		div.style.display = 'none';
		div.style.textAlign = 'center';
		div.style.fontFamily = fnt;
		div.style.color = fntCol;
		div.style.textDecoration = 'none';
		div.style.border = this.bStyles[0];
		div.style.borderRadius = '0.5em';
		div.style.outline = 'none';
		div.style.margin = '0px';
		div.style.padding = '4px 0px';
		div.style.zIndex = '4';
	}

	checkText(leText) {
		let outText = leText.slice(0, this.entryMaxLength);
		outText = outText.replace(/[^a-z]/gi, '');
		outText = outText.toLowerCase();
		for (let i = 0; i < SWEARS_LIST.length; i++) {
			let re = new RegExp(SWEARS_LIST[i], 'g');
			outText = outText.replace(re, '');
		}
		outText = outText.charAt(0).toUpperCase() + outText.slice(1);
		return outText;
	}

	init() {
		document.addEventListener('keyup', this.cleanInputs);
	}

	deit() {
		document.removeEventListener('keyup', this.cleanInputs);
	}
}

export default HighScoresEntryInputs;
