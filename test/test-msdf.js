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
    `DIRECTORS`,
    `ABOUT`,
    `NEWS`,
    `DIRECTORS`,
    `ABOUT`,
    `NEWS`,
    `DIRECTORS`,
    `ABOUT`,
    `NEWS`,
    `DIRECTORS`,
    `ABOUT`,
    `NEWS`,
]

const transitions = [
    `Bold_to_Light`,
    `BoldWide_to_LightCondensed`,
    `LightWide_to_ThinCondensed`,
    `Wide_to_Condensed`,
    `BoldNormal_to_ThinCondensed`,
    `Bold_to_Thin`,
    `BoldNormal_to_BoldCondensed`,
    `ThinCondensed_to_BoldCondensed`,
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
        [{
                json: "fnt/werk/4/1.json",
                texture: "fnt/werk/4/1.png"
            },
            {
                json: "fnt/werk/4/2.json",
                texture: "fnt/werk/4/2.png"
            },
            {
                json: "fnt/werk/4/3.json",
                texture: "fnt/werk/4/3.png"
            },
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
            {
                json: "fnt/werk/4/4.json",
                texture: "fnt/werk/4/4.png"
            },
            {
                json: "fnt/werk/4/5.json",
                texture: "fnt/werk/4/5.png"
            },
            {
                json: "fnt/werk/4/6.json",
                texture: "fnt/werk/4/6.png"
            }
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('Bold_to_Light',
        [{
                json: `fnt/transitions/Bold_to_Light/300.json`,
                texture: `fnt/transitions/Bold_to_Light/300.png`
            },
            {
                json: `fnt/transitions/Bold_to_Light/500.json`,
                texture: `fnt/transitions/Bold_to_Light/500.png`
            },
            {
                json: `fnt/transitions/Bold_to_Light/700.json`,
                texture: `fnt/transitions/Bold_to_Light/700.png`
            },
            {
                json: `fnt/transitions/Bold_to_Light/900.json`,
                texture: `fnt/transitions/Bold_to_Light/900.png`
            },
        ],
        onTransitionLoaded
    );


    FontTransitions.addFontTransition('BoldWide_to_LightCondensed',
        [{
                json: "fnt/transitions/BoldWide_to_LightCondensed/100_900.json",
                texture: "fnt/transitions/BoldWide_to_LightCondensed/100_900.png"
            },
            {
                json: "fnt/transitions/BoldWide_to_LightCondensed/75_700.json",
                texture: "fnt/transitions/BoldWide_to_LightCondensed/75_700.png"
            },
            {
                json: "fnt/transitions/BoldWide_to_LightCondensed/50_500.json",
                texture: "fnt/transitions/BoldWide_to_LightCondensed/50_500.png"
            },
            {
                json: "fnt/transitions/BoldWide_to_LightCondensed/25_300.json",
                texture: "fnt/transitions/BoldWide_to_LightCondensed/25_300.png"
            },
            {
                json: "fnt/transitions/BoldWide_to_LightCondensed/0_100.json",
                texture: "fnt/transitions/BoldWide_to_LightCondensed/0_100.png"
            },
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('LightWide_to_ThinCondensed',
        [{
                json: "fnt/transitions/LightWide_to_ThinCondensed/300_40.json",
                texture: "fnt/transitions/LightWide_to_ThinCondensed/300_40.png"
            },
            {
                json: "fnt/transitions/LightWide_to_ThinCondensed/220_20.json",
                texture: "fnt/transitions/LightWide_to_ThinCondensed/220_20.png"
            },
            {
                json: "fnt/transitions/LightWide_to_ThinCondensed/150_1.json",
                texture: "fnt/transitions/LightWide_to_ThinCondensed/150_1.png"
            },
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('Wide_to_Condensed',
        [{
                json: "fnt/transitions/Wide_to_Condensed/900_100.json",
                texture: "fnt/transitions/Wide_to_Condensed/900_100.png"
            },
            {
                json: "fnt/transitions/Wide_to_Condensed/900_60.json",
                texture: "fnt/transitions/Wide_to_Condensed/900_60.png"
            },
            {
                json: "fnt/transitions/Wide_to_Condensed/900_30.json",
                texture: "fnt/transitions/Wide_to_Condensed/900_30.png"
            },
            {
                json: "fnt/transitions/Wide_to_Condensed/900_1.json",
                texture: "fnt/transitions/Wide_to_Condensed/900_1.png"
            },
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('BoldNormal_to_ThinCondensed',
        [{
                json: "fnt/transitions/BoldNormal_to_ThinCondensed/40_900.json",
                texture: "fnt/transitions/BoldNormal_to_ThinCondensed/40_900.png"
            },
            {
                json: "fnt/transitions/BoldNormal_to_ThinCondensed/30_600.json",
                texture: "fnt/transitions/BoldNormal_to_ThinCondensed/30_600.png"
            },
            {
                json: "fnt/transitions/BoldNormal_to_ThinCondensed/10_300.json",
                texture: "fnt/transitions/BoldNormal_to_ThinCondensed/10_300.png"
            },
            {
                json: "fnt/transitions/BoldNormal_to_ThinCondensed/1_100.json",
                texture: "fnt/transitions/BoldNormal_to_ThinCondensed/1_100.png"
            },
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('Bold_to_Thin',
        [{
                json: "fnt/transitions/Bold_to_Thin/900_60.json",
                texture: "fnt/transitions/Bold_to_Thin/900_60.png"
            },
            {
                json: "fnt/transitions/Bold_to_Thin/600_60.json",
                texture: "fnt/transitions/Bold_to_Thin/600_60.png"
            },
            {
                json: "fnt/transitions/Bold_to_Thin/300_60.json",
                texture: "fnt/transitions/Bold_to_Thin/300_60.png"
            },
            {
                json: "fnt/transitions/Bold_to_Thin/1_60.json",
                texture: "fnt/transitions/Bold_to_Thin/1_60.png"
            },
        ],
        onTransitionLoaded
    );



    FontTransitions.addFontTransition('BoldNormal_to_BoldCondensed',
        [{
                json: "fnt/transitions/BoldNormal_to_BoldCondensed/900_60.json",
                texture: "fnt/transitions/BoldNormal_to_BoldCondensed/900_60.png"
            },
            {
                json: "fnt/transitions/BoldNormal_to_BoldCondensed/900_30.json",
                texture: "fnt/transitions/BoldNormal_to_BoldCondensed/900_30.png"
            },
            {
                json: "fnt/transitions/BoldNormal_to_BoldCondensed/900_1.json",
                texture: "fnt/transitions/BoldNormal_to_BoldCondensed/900_1.png"
            },
        ],
        onTransitionLoaded
    );

    FontTransitions.addFontTransition('ThinCondensed_to_BoldCondensed',
        [{
                json: "fnt/transitions/ThinCondensed_to_BoldCondensed/900_1.json",
                texture: "fnt/transitions/ThinCondensed_to_BoldCondensed/900_1.png"
            },
            {
                json: "fnt/transitions/ThinCondensed_to_BoldCondensed/600_1.json",
                texture: "fnt/transitions/ThinCondensed_to_BoldCondensed/600_1.png"
            },
            {
                json: "fnt/transitions/ThinCondensed_to_BoldCondensed/300_1.json",
                texture: "fnt/transitions/ThinCondensed_to_BoldCondensed/300_1.png"
            },
            {
                json: "fnt/transitions/ThinCondensed_to_BoldCondensed/100_1.json",
                texture: "fnt/transitions/ThinCondensed_to_BoldCondensed/100_1.png"
            },
        ],
        onTransitionLoaded
    );


    window.addEventListener('mousemove', onMouseMove, false);
}

function onTransitionLoaded() {
    nbrTransitionLoaded++;
    if (nbrTransitionLoaded < 10) return;
    /*
    textArray.forEach((text, index) => {
        let instance = new FontVariableGL(
            text,
            [FontTransitions.getFontTransition('ThinCondensed_to_BoldCondensed')],
            function () {
                console.log('mouseEnter')
            },
            function () {
                console.log('mouseLeave')
            },
        );
        instance.mesh.position.x = -window.innerWidth / 2;
        instance.mesh.position.y = (-window.innerHeight / 2) + (100 * (index + 1));
        instance.mesh.scale.multiplyScalar(1);
        scene.add(instance.mesh);
        textInstances.push(instance);
    })
    */


    transitions.forEach((transition, mainIndex) => {
        textArray.forEach((text, index) => {
            console.log(transition, mainIndex);

            let instance = new FontVariableGL(
                text,
                [FontTransitions.getFontTransition(transition)],
                function () {
                    console.log('mouseEnter')
                },
                function () {
                    console.log('mouseLeave')
                },
            );
            //instance.mesh.position.x = -window.innerWidth / 2;
            //instance.mesh.position.y = (-window.innerHeight / 2) + (20 * (index + 1)) + 300 * mainIndex;
            instance.mesh.position.x = -window.innerWidth / 2 + Math.random() * 1000;
            instance.mesh.position.y = (-window.innerHeight / 2) + Math.random() * 1000;
            instance.mesh.scale.multiplyScalar(0.5);
            scene.add(instance.mesh);
            textInstances.push(instance);
        })
    })


    renderer.setAnimationLoop(update.bind(this));
}

function update() {
    inc += .15;
    textInstances.forEach((textInstance, index) => {
        textInstance.setProgress((Math.sin(inc + (index / 1)) + 1) / 2);
        // if (textInstancesetP> 0.5 ) { textInstance.currentTransition = textInstance.arrayTansition[1]; }
    })

    //RAYCASTER
    raycaster.setFromCamera(mouse, camera);
    for (let index = 0; index < textInstances.length; index++) {
        if (raycaster.intersectObject(textInstances[index].mesh).length > 0) {
            textInstances[index].mouseEnter()
        } else {
            textInstances[index].mouseLeave()
        }
    }

    renderer.render(scene, camera);
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}