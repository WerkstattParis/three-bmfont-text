var createTextMSDF = require('..')
var MSDFShader = require('../shaders/msdf')
var collector = require('../dataCollector.js')


module.exports = class FontVariableGL {
    constructor(text, arrayTansition) {
        this.text = text;
        this.progress = 0;

        this.geometry = null;
        this.material = null;
        
        
        arrayTansition.forEach((transition, index) => {
            arrayTansition[index] = new TextTransition(this.text, transition);
        })
        this.currentTransition = arrayTansition[0];

        this.createMesh();
    }


    render() {
        let globalProgress = this.progress * (this.currentTransition.nbrStep - 1);
        let modulo = globalProgress % 1;
        let nbr = Math.floor(globalProgress);

        if (nbr == this.currentTransition.nbrStep) {
            modulo = 0.999999;
            nbr = this.currentTransition.nbrStep;
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
            negate: true,
            color: 0xfffffff,
        }))

        // var hauteurLigne = geom.layout
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.y = Math.random()*400;
        this.mesh.scale.multiplyScalar(1);

        // this.mesh.mouseEnterFn = mouseEnterFn;
        // this.mesh.mouseLeaveFn = mouseLeaveFn;
    }
}

class TextTransition {
    constructor( text, transition) {
        // Transition
        this.arrayFontSteps = [];
        this.nbrStep = transition.array.length;
        

        for (let index = 0; index < transition.array.length; index++) {
            this.arrayFontSteps[index] = collector({
                text: text,
                font: transition.array[index].json,
                align: 'left',
                flipY: transition.array[index].texture.flipY
            });
            this.arrayFontSteps[index].texture = transition.array[index].texture;
        }
    }
}