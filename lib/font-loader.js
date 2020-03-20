// THEN WHEN TEXTURE ARE LOADED, RETREIVE THEIR RESPECTIVE DATA (corresponding to text).
var loadFont = require('load-bmfont')
var collector = require('../dataCollector.js')


module.exports = function (fontArray,textArray,cb) {
    var textureLoaded = 0;

    var onTextureLoaded = function () {
        textureLoaded++;

        if (textureLoaded >= (fontArray.length * 2)) {
            textArray.forEach((text) => {
                fontArray.forEach((font, index) => {
                    if (!text.data) text.data = [];

                    //Collector function to retreive data
                    text.data[index] = collector({
                        text: text.text,
                        font: font.font,
                        align: 'left',
                        flipY: font.texture.flipY,
                    });
                    text.data[index]['texture'] = font.texture;
                });
            });
            cb(textArray);
        }
    }

    fontArray.forEach((fontImage) => {
        fontImage.texture = new THREE.TextureLoader().load(fontImage.image, onTextureLoaded);
        loadFont(fontImage.font, function (err, font) {
            if (err) {
                throw err
            } else {
                fontImage.font = font;
                onTextureLoaded();
            }
        })
    });

}