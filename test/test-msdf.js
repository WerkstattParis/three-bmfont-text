global.THREE = require('three')

let FontVariableGL = require('./FontVariableGL.js');
let FontTransitions = require('./FontTransitions.js');

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(9999, 9999);
let scene, camera, renderer;
let inc = 0;
let nbrTransitionLoaded = 0;

let textInstances = [];
const textArray = [
    `DIRECTORS`,
    `ABOUT`,
    `NEWS`,
    `ALLAN`,
    `RAQUIN`,
    `THREE BM FONT`,
    `VARIABLE FONT`,
    `THREEJS`
]

start();

function start() {
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2, -1000, 1000);
    camera.position.z = 100;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        scene: scene,
        antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);


    FontTransitions.setRendererPreload(renderer);
    FontTransitions.addFontTransition('thin2bold',
        [
            { json: "fnt/werk/4/1.json", texture: "fnt/werk/4/1.png" },
            { json: "fnt/werk/4/2.json", texture: "fnt/werk/4/2.png" },
            { json: "fnt/werk/4/3.json", texture: "fnt/werk/4/3.png" },
            // { json: "fnt/werk/4/4.json", texture: "fnt/werk/4/4.png" },
            // { json: "fnt/werk/4/5.json", texture: "fnt/werk/4/5.png" },
            // { json: "fnt/werk/4/6.json", texture: "fnt/werk/4/6.png" }
        ],
        onTransitionLoaded
    );
    FontTransitions.addFontTransition('thin2bold2',
        [
            // { json: "fnt/werk/4/1.json", texture: "fnt/werk/4/1.png" },
            // { json: "fnt/werk/4/2.json", texture: "fnt/werk/4/2.png" },
            // { json: "fnt/werk/4/3.json", texture: "fnt/werk/4/3.png" },
            { json: "fnt/werk/4/4.json", texture: "fnt/werk/4/4.png" },
            { json: "fnt/werk/4/5.json", texture: "fnt/werk/4/5.png" },
            { json: "fnt/werk/4/6.json", texture: "fnt/werk/4/6.png" }
        ],
        onTransitionLoaded
    );

    window.addEventListener('mousemove', onMouseMove, false);
}
function onTransitionLoaded(){
    nbrTransitionLoaded++;
    if( nbrTransitionLoaded < 2) return;

    textArray.forEach((text, index)=>{
        let instance = new FontVariableGL(
            text,
            [FontTransitions.getFontTransition('thin2bold'), FontTransitions.getFontTransition('thin2bold2')],
            function () { console.log('mouseEnter') },
            function () { console.log('mouseLeave') },
        );
        instance.mesh.position.x = -window.innerWidth / 2;
        instance.mesh.position.y = (-window.innerHeight / 2) + (100 * (index + 1));
        instance.mesh.scale.multiplyScalar(1);
        scene.add(instance.mesh);
        textInstances.push( instance );
    })

    renderer.setAnimationLoop(update.bind(this));
}

function update() {
    inc+= .15;
    textInstances.forEach((textInstance, index)=>{
        textInstance.setProgress((Math.sin(inc + (index / 1)) + 1) / 2 );
        // if (textInstancesetP> 0.5 ) { textInstance.currentTransition = textInstance.arrayTansition[1]; }
    })
    
    //RAYCASTER
    raycaster.setFromCamera(mouse, camera);
    for (let index = 0; index < textInstances.length; index++) {
        if( raycaster.intersectObject(textInstances[index].mesh).length > 0 ){
            textInstances[index].mouseEnter()
        }else{
            textInstances[index].mouseLeave()
        }
    }

    renderer.render(scene, camera);
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}
