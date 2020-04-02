var createTextMSDF = require('..')
var MSDFShader = require('../shaders/msdf')
var collector = require('../dataCollector.js')


module.exports = class FontVariableGL {
    constructor(text, arrayTansition, mouseEnterFn, mouseLeaveFn, mouseClickFn, letterSpacing = 0) {
        this.text = text;
        this.progress = 0;
        this.color = 0;
        this.hovered = false;

        this.geometry = null;
        this.material = null;
        this.arrayTansition = arrayTansition;

        this.mouseEnterFn = mouseEnterFn;
        this.mouseLeaveFn = mouseLeaveFn;
        this.mouseClickFn = mouseClickFn;
        
        for (let index = 0; index < this.arrayTansition.length; index++) {
            this.arrayTansition[index] = new TextTransition(this.text, this.arrayTansition[index], letterSpacing);
        }

        this.currentTransition = this.arrayTansition[0];

        this._onClick = this.onClick.bind(this);
        document.addEventListener('click', this._onClick)
        
        this.createMesh();

    }

    mouseEnter(){
        if ( !this.hovered ){
            this.hovered = true;
            this.mouseEnterFn();
        }
    }

    onClick() {
        if (this.hovered) {
            if (!!this.mouseClickFn) {
                this.mouseClickFn();
            }
        }
    }

    mouseLeave() {
        if (this.hovered) {
            this.hovered = false;
            this.mouseLeaveFn();
        }
    }

    render() {
        let globalProgress = this.progress * (this.currentTransition.nbrStep - 1);
        let modulo = globalProgress % 1;
        let nbr = Math.floor(globalProgress);

        if (nbr == this.currentTransition.nbrStep-1) {
            modulo = 0.999999;
            nbr = this.currentTransition.nbrStep-2;
        }
        this.mesh.material.uniforms.progress.value = modulo;

        if ((nbr + 1) >= this.currentTransition.nbrStep) return;
    
        this.mesh.material.uniforms.tMapTo.value = this.currentTransition.arrayFontSteps[nbr+1].texture;
        this.mesh.material.uniforms.tMapFrom.value = this.currentTransition.arrayFontSteps[nbr].texture;
        this.mesh.geometry.setAttribute('uvTo', this.currentTransition.arrayFontSteps[nbr+1].uvs);
        this.mesh.geometry.setAttribute('uv', this.currentTransition.arrayFontSteps[nbr].uvs);
        this.mesh.geometry.setAttribute('positionTo', this.currentTransition.arrayFontSteps[nbr+1].positions);
        this.mesh.geometry.setAttribute('position', this.currentTransition.arrayFontSteps[nbr].positions);
    }

    setProgress(progress){
        if( this.progress !== progress){
            this.progress = progress;
            this.render();
        }
    }

    setColor(color) {
        if (this.color !== color) {
            this.color = color;
            this.mesh.material.uniforms.color.value = this.color;
        }
    }

    createMesh() {
        this.geometry = createTextMSDF({
            indices: this.currentTransition.arrayFontSteps[0].indices,
            positionFrom: this.currentTransition.arrayFontSteps[0].positions,
            positionTo: this.currentTransition.arrayFontSteps[1].positions,
            layout: this.currentTransition.arrayFontSteps[0].layout,
            uvFrom: this.currentTransition.arrayFontSteps[0].uvs,
            uvTo: this.currentTransition.arrayFontSteps[1].uvs,
            visibleGlyphs: this.currentTransition.arrayFontSteps[0].visibleGlyphs
        })
        
        this.material = new THREE.RawShaderMaterial(MSDFShader({
            tMapFrom: this.currentTransition.arrayFontSteps[0].texture,
            tMapTo: this.currentTransition.arrayFontSteps[1].texture,
            side: THREE.DoubleSide,
            transparent: true,
            progress: 0,
            color: 1,
        }))

        // var hauteurLigne = geom.layout
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}

class TextTransition {
    constructor(text, transition, letterSpacing) {
        // Transition
        this.arrayFontSteps = [];
        this.nbrStep = transition.array.length;
        

        for (let index = 0; index < transition.array.length; index++) {
            this.arrayFontSteps[index] = collector({
                text: text,
                font: transition.array[index].json,
                align: 'left',
                flipY: transition.array[index].texture.flipY,
                letterSpacing: letterSpacing
            });
            this.arrayFontSteps[index].texture = transition.array[index].texture;
        }
    }
}