var createLayout = require('layout-bmfont-text')
var createIndices = require('quad-indices')
var assign = require('object-assign')
var vertices = require('./lib/vertices')

module.exports = function getShaderData (opt) {
    if (typeof opt === 'string') {
        opt = { text: opt }
    }

    // use constructor defaults
    opt = assign({}, this._opt, opt)

    if (!opt.font) {
        throw new TypeError('must specify a { font } in options')
    }

    this.layout = createLayout(opt)

    // get vec2 texcoords
    var flipY = opt.flipY !== false

    // the desired BMFont data
    var font = opt.font

    // determine texture size from font file
    var texWidth = font.common.scaleW
    var texHeight = font.common.scaleH

    // get visible glyphs
    var glyphs = this.layout.glyphs.filter(function (glyph) {
        var bitmap = glyph.data
        return bitmap.width * bitmap.height > 0
    })

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs

    // get common vertex data
    var positions = vertices.positions(glyphs)
    var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    var indices = createIndices({
        clockwise: true,
        type: 'uint16',
        count: glyphs.length
    })

    // update vertex data
    return {
        indices: new THREE.BufferAttribute(indices, 1),
        positions: new THREE.BufferAttribute(positions, 3),
        uvs: new THREE.BufferAttribute(uvs, 2),
        layout: this.layout,
        visibleGlyphs: this.visibleGlyphs
    }
}

