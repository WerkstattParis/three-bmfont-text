var assign = require('object-assign');

module.exports = function createMSDFShader(opt) {
    opt = opt || {};
    var color = typeof opt.color === 'number' ? opt.color : 1;
    var progress = typeof opt.progress === 'number' ? opt.progress : 1;
    var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
    var precision = opt.precision || 'highp';
    var tMapFrom = opt.tMapFrom;
    var tMapTo = opt.tMapTo;

    // remove to satisfy r73
    delete opt.map
    delete opt.precision
    delete opt.color
    delete opt.tMapTo
    delete opt.tMapFrom
    delete opt.progress

    return assign({
        uniforms: {
            color: { type: 'f', value: color },
            progress: { type: 'f', value: progress },
            tMapFrom: { type: 't', value: tMapFrom || new THREE.Texture() },
            tMapTo: { type: 't', value: tMapTo || new THREE.Texture() },
        },

        vertexShader: `
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float progress;

        attribute vec2 uv;
        attribute vec2 uvTo;
        
        attribute vec3 position;
        attribute vec3 positionTo;

        varying vec2 vUvFrom;
        varying vec2 vUvTo;

        void main() {

            vUvFrom = uv;
            vUvTo = uvTo;
                
            vec3 endPostion = mix(position, positionTo, progress );
                
            gl_Position = projectionMatrix * modelViewMatrix * vec4(endPostion.xy, 0., 1.);
        }`,

        fragmentShader: `
        #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives: enable
        #endif

        precision ${precision} float;

        varying vec2 vUvFrom;
        varying vec2 vUvTo;

        uniform float progress;
        uniform sampler2D tMapFrom;
        uniform sampler2D tMapTo;
        uniform float color;

        float fill(float sd) {
            float aaf = fwidth(sd);
            return smoothstep(aaf, -aaf, sd);
        }

        float median(vec3 rgb) {
            return max(min(rgb.r, rgb.g), min(max(rgb.r, rgb.g), rgb.b));
        }

        float aastep(float value) {
            // #ifdef GL_OES_standard_derivatives
            float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
            // #else
            //     float afwidth = (1.0 / 500.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));
            // #endif
            return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
        }
        
        void main() {
            // MSDF
            float msdfSampleFrom = median(texture2D(tMapFrom, vUvFrom).rgb); //
            float msdfSampleTo = median(texture2D(tMapTo, vUvTo).rgb);
            float msdfSample = mix(msdfSampleFrom, msdfSampleTo, progress);
            float alpha = aastep(msdfSample);
            // float alpha = fill(0.5 - msdfSample);

            gl_FragColor = vec4(vec3(color), alpha);
        }`


    }, opt);
};
