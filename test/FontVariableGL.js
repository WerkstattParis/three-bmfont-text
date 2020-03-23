var createTextMSDF = require('..')
var MSDFShader = require('../shaders/msdf')
var fontLoader = require('../lib/font-loader.js')

module.exports = class FontVariableGL {
    constructor(text, arrayTansition, cb) {
        this.loaded = 0;
        this.cb = cb;
        this.text = text;
        this.arrayTransition = arrayTansition;
        this.progress = 0;
        this.nbrTransition = this.arrayTransition.length;

        this.geometry = null;
        this.material = null;
        this.currentTransition = this.arrayTransition[0];

        this.arrayTransition.forEach((transition, index) => {
            this.arrayTransition[index] = new FontTransition(this.text, transition, this.onTransitionLoaded.bind(this))
        })
    }

    onTransitionLoaded(){
        this.loaded++;
        if (this.loaded >= this.nbrTransition) {
            this.loaded = 0;
            this.arrayTransition;
            this.createMesh();
        }
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
        

        this.mesh.material.uniforms.tMapTo.value = this.currentTransition.steps[nbr+1].texture;
        this.mesh.material.uniforms.tMapFrom.value = this.currentTransition.steps[nbr].texture;
        this.mesh.geometry.setAttribute('uvTo', this.currentTransition.steps[nbr+1].data.uvs);
        this.mesh.geometry.setAttribute('uv', this.currentTransition.steps[nbr].data.uvs);
        this.mesh.geometry.setAttribute('positionTo', this.currentTransition.steps[nbr+1].data.positions);
        this.mesh.geometry.setAttribute('position', this.currentTransition.steps[nbr].data.positions);
    }

    createMesh() {
        this.geometry = createTextMSDF({
            indices: this.currentTransition.steps[0].data.indices,
            positionFrom: this.currentTransition.steps[0].data.positions,
            positionTo: this.currentTransition.steps[1].data.positions,
            layout: this.currentTransition.steps[0].data.layout,
            uvFrom: this.currentTransition.steps[0].data.uvs,
            uvTo: this.currentTransition.steps[1].data.uvs,
            visibleGlyphs: this.currentTransition.steps[0].data.visibleGlyphs
        })
        
        this.material = new THREE.RawShaderMaterial(MSDFShader({
            tMapFrom: this.currentTransition.steps[0].texture,
            tMapTo: this.currentTransition.steps[1].texture,
            side: THREE.DoubleSide,
            transparent: true,
            progress: 0,
            negate: true,
            color: 0xfffffff,
        }))

        // var hauteurLigne = geom.layout
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.y = Math.random() * 400;
        this.mesh.scale.multiplyScalar(1);

        // this.mesh.mouseEnterFn = mouseEnterFn;
        // this.mesh.mouseLeaveFn = mouseLeaveFn;

        this.cb(this.mesh);
    }
}

class FontTransition {
    constructor(text, json, cb) {
        this.name = json.name;
        this.arrayFontSteps = json.steps;
        this.nbrStep = this.arrayFontSteps.length;
        this.loaded = 0;
        this.cb = cb;

        //Laod every font step
        this.arrayFontSteps.forEach((fontStep, index) => {
            fontLoader(text, fontStep.json, fontStep.texture, function (obj) {
                this.onFontLoaded(obj, index);
            }.bind(this));
        })
    }

    onFontLoaded(obj, index) {
        this.arrayFontSteps[index] = obj;
        this.loaded++;
        
        //When all steps of font are ready 
        if (this.loaded >= this.nbrStep) this.cb();
    }
}