var loadFont = require('load-bmfont');

var instanceOurRenderer;

class FontTransitions {
    constructor() {
        //Activate THREE cache for texture load
        THREE.Cache.enabled = true;
        this.fontList = {};
    }

    setRendererPreload(renderer){
        //This is used to pre-render texture
        instanceOurRenderer = renderer
    }

    addFontTransition(name, array, cb){
        this.fontList[name] = {};
        this.fontList[name] = new FontTransition(array, cb);
    }

    getFontTransition(name){
        if ( !!this.fontList[name] ){;
            return this.fontList[name];
        }else{
            console.warn(`${name} is not haven't been add`);
        }
    }
}

class FontTransition {
    constructor(array, cb) {
        this.array = array;
        this.loaded = 0;
        this.toLoad = this.array.length;
        this.cb = cb;

        this.load();
    }

    load(){
        for (let index = 0; index < this.array.length; index++) {
            this.array[index] = new Font(this.array[index], this.onFontLoaded.bind(this))   
        }
    }

    onFontLoaded(){
        this.loaded++
        if (this.loaded >= this.toLoad){
            this.cb();
        }
    }
}

class Font {
    constructor(obj, cb) {
        this.json = obj.json;
        this.texture = obj.texture;
        this.cb = cb;

        this.loaded = 0;
        this.toLoad = 2;

        this.loadFontJson(this.json);
        this.loadImage(this.texture);
    }

    loadImage(image) {
        new THREE.TextureLoader().load(image, this.onImageLoaded.bind(this) );
    }

    loadFontJson(font) {
        loadFont(font, this.onFontLoaded.bind(this));
    }

    onImageLoaded(texture) {
        instanceOurRenderer.initTexture(texture);
        this.texture = texture;
        this.checkIfLoaded();
    }

    onFontLoaded(err, font) {
        if (err) {
            throw err
        } else {
            this.json = font;
            this.checkIfLoaded();
        }
    }

    checkIfLoaded() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            this.cb();
        }
    }
}

const fontTransitionInstance = new FontTransitions();
Object.freeze(fontTransitionInstance);

module.exports = fontTransitionInstance; 