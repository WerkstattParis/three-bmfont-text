var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry(opt) {
    return new TextGeometry(opt)
}

function TextGeometry(opt) {
    Base.call(this)

    if (typeof opt === 'string') {
        opt = { text: opt }
    }

    // use these as default values for any subsequent
    // calls to update()
    this._opt = assign({}, opt)

    // also do an initial setup...
    if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.onMouseOver = function (opt) {
    if (!this.isHovered) {
        this.isHovered = true;
        this.mouseEnterFn();
    }
}
TextGeometry.prototype.onMouseLeave = function (opt) {
    if (this.isHovered) {
        this.isHovered = false;
        this.mouseLeaveFn();
    }
}


TextGeometry.prototype.update = function (opt) {
    if (typeof opt === 'string') {
        opt = { text: opt }
    }

    // use constructor defaults
    opt = assign({}, this._opt, opt)
    this.layout = opt.layout;
    this.visibleGlyphs = opt.visibleGlyphs;
    // update vertex data
    this.setIndex(opt.indices);
    this.setAttribute('uv', opt.uvTo);
    this.setAttribute('uvTo', opt.uvFrom);
    this.setAttribute('position', opt.positionTo);
    this.setAttribute('positionTo', opt.positionFrom);

    this.deleteAttribute('page')
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}
