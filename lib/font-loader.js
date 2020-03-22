// THEN WHEN TEXTURE ARE LOADED, RETREIVE THEIR RESPECTIVE DATA (corresponding to text).
var loadFont = require('load-bmfont')
var collector = require('../dataCollector.js')


// module.exports = function (fontArray,textArray,cb) {
module.exports = function (text, font, image, cb) {
    var loaded = 0;
    var obj = {};

    var checkAllLoaded = function () {
        loaded++;
        if (loaded >= 2 ) {
            obj.data = collector({
                text: text,
                font: obj.font,
                align: 'left',
                flipY: obj.texture.flipY,
            });
            cb(obj);
        }           
    }

    //LOAD TEXTURE
    new THREE.TextureLoader().load(image, function (texture) {
        obj.texture = texture;
        checkAllLoaded();
    });

    //LOAD FONT
    loadFont(font, function (err, font) {
        if (err) {
            throw err
        } else {
            obj.font = font;
            checkAllLoaded();
        }
    });
}