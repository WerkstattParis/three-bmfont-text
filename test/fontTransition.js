var createTextMSDF = require('../')
var MSDFShader = require('../shaders/msdf')
var fontLoader = require('../lib/font-loader.js')

module.exports = class FontTransition {
    constructor(text, arrayFontStep, cb) {
        this.loaded = 0;
        this.cb = cb;
        this.text = text;
        this.arrayFontStep = arrayFontStep;
        this.progress = 0;
        this.nbrFontStep = this.arrayFontStep.length;

        this.geometry = null;
        this.material = null;

        arrayFontStep.forEach((fontStep, index) => {
            fontLoader(this.text, fontStep.json, fontStep.texture, function (obj) {
                this.onFontLoaded(obj, index);
            }.bind(this));
        })
    }

    onFontLoaded(obj, index) {
        this.arrayFontStep[index] = obj;

        this.loaded++;
        if (this.loaded >= this.nbrFontStep) this.createMesh();
    }

    updateProgress(value) {
        this.progress = value;
    };

    render() {
        let globalProgress = this.progress * (this.nbrFontStep.length - 1);
        let nbr = Math.floor(globalProgress % 1);

        if (nbr == this.nbrFontStep.length) {
            modulo = 0.999999;
            nbr = this.nbrFontStep.length;
        }

        this.mesh.material.uniforms.localProgress.value = modulo;

        if ((nbr + 1) >= this.nbrFontStep.length) return;

        this.mesh.material.uniforms.tMapTo.value = textArray[index].data[nbr + 1].texture;
        this.mesh.material.uniforms.tMapFrom.value = textArray[index].data[nbr].texture;
        this.mesh.geometry.setAttribute('uvTo', textArray[index].data[nbr + 1].uvs);
        this.mesh.geometry.setAttribute('uv', textArray[index].data[nbr].uvs);
        this.mesh.geometry.setAttribute('positionTo', textArray[index].data[nbr + 1].positions);
        this.mesh.geometry.setAttribute('position', textArray[index].data[nbr].positions);
    }

    createMesh() {
        this.geometry = createTextMSDF({
            indices: this.arrayFontStep[0].data.indices,
            positionFrom: this.arrayFontStep[0].data.positions,
            positionTo: this.arrayFontStep[1].data.positions,
            layout: this.arrayFontStep[0].data.layout,
            uvFrom: this.arrayFontStep[0].data.uvs,
            uvTo: this.arrayFontStep[1].data.uvs,
            visibleGlyphs: this.arrayFontStep[0].data.visibleGlyphs
        })

        this.material = new THREE.RawShaderMaterial(MSDFShader({
            tMapFrom: this.arrayFontStep[0].texture,
            tMapTo: this.arrayFontStep[1].texture,
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