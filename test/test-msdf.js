global.THREE = require('three')
var createText = require('../')
var MSDFShader = require('../shaders/msdf')

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(9999, 9999);
let scene, camera, renderer, text, cube;


require('./load')({
    font: 'fnt/Roboto-msdf.json',
    image: 'fnt/Roboto-msdf.png'
}, start)

function start(font, texture) {
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2, -1000, 1000);

    var canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        scene: scene,
        antialias: true
    });

    renderer.setAnimationLoop(update.bind(this));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);



    createGlyph()

    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xf00000 });
    cube = new THREE.Mesh(geometry, material);

    camera.position.z = 100;
    scene.add(cube);

    window.addEventListener('mousemove', onMouseMove, false);

    function createGlyph() {
        var geom = createText({
            font: font,
            text: `SAMPLE TEXT`,
            // lineHeight: 100
        })

        var material = new THREE.RawShaderMaterial(MSDFShader({
            map: texture,
            color: 0xfffffff,
            side: THREE.DoubleSide,
            transparent: true,
            negate: true
        }))

        text = new THREE.Mesh(geom, material)


        scene.add(text)
    }
}



function update() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    
    for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.wireframe = true;
    }

    renderer.render(scene, camera);
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}