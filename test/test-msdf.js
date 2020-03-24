global.THREE = require('three')

THREE.Cache.enabled = true;

var FontVariableGL = require('./FontVariableGL.js');
var FontTransitions = require('./FontTransitions.js');

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(9999, 9999);
let scene, camera, renderer, text, cube, INTERSECTED;
let inc = 0;

var textInstances = [];
var textArray = [
    `ABCDEFGHIJKLMNOPQR` ,
    `BCDEFGHIJKLMNOPQRS` ,
    // `CDEFGHIJKLMNOPQ` ,
    // `DEFGHIJKLMNOPQR` ,
    // `EFGHIJKLMNOPQRS` ,
    // `FGHIJKLMNOPQRST` ,
    // `GHIJKLMNOPAPQRS` ,
    // `EFGHIJKLMNOPQRS` ,
    // `EFZFEFEFZFEFEFZF` ,
    // `SFDFDSVSFDFDSVSF` ,
    // `ZFZEFZFZEFZFZEFZ` ,
    // `NFGFBNFGFBNFGFBN` ,
    // `VSDVSDVVSDVSDVVS` ,
    // `CQSCQSCCQSCQSCCQ` ,
    // `XCVVXCVXCVVXCVXC` ,
    // `EZFZEFZEZFZEFZEZ` ,
    // `NYTNTNYTNTNYTNTN` ,
    // `OILOIOILOIOILOIO` ,
    // `NJYYGNNJYYGNNJYY` ,
    // `NGBFTGDRNGBFTGDR` ,
    // `FRDFDRFRDFDRFRDF` ,
    // `SEDSQESEDSQESEDS` ,
    // `SDVSDVSDVSDVSDVS` ,
    // `CGBFDGBCGBFDGBCG` ,
    // `CSDCCSDCCSDCCSDC` ,
    // `ABEAZECABEAZECAB` ,
    // `ABSDFCABSDFCABSD` ,
    // `VXCVVXCVVXCVVXCV` ,
    // `HFJTYJHFJTYJHFJT` ,
    // `KUYJYTKUYJYTKUYJ` ,
    // `BVNNGHBVNNGHBVNN` ,
    // `KHYKUIKHYKUIKHYK` ,
    // `YTIIUYTIIUYTIIUY` ,
    // `ILUIOLILUIOLILUI` ,
    // `OLOMPOLOMPOLOMPO` ,
    // `JUDGRDFJUDGRDFJU` ,
    // `SEFRGSEFRGSEFRGS` ,
    // `VFXVFGNVFXVFGNVF` ,
    // `VXFVDCVXFVDCVXFV` ,
    // `SDFFGBSDFFGBSDFF` ,
    // `DFVDRDDFVDRDDFVD`,
    // `XDVSXDVSXDVSXDVS`,
    // `ABCABCABCABCOIDI` ,
    // `KAPDKAPDKAPDKAPD` ,
    // `POAJKZPOAJKZPOAJ` ,
    // `LKZQSALKZQSALKZQ` ,
    // `DFEZFDFEZFDFEZFD` ,
    // `TRHTRTRHTRTRHTRT` ,
    // `CXVXCVCXVXCVCXVX` ,
    // `QSCQSCQSCQSCQSCQ` ,
    // `EAZEAZEAZEAZEAZE` ,
    // `EFFEFFEFFEFFZDQZ` ,
    // `CXVXCVCXVXCVCXVX` ,
    // `RTHRTGRTHRTGRTHR` ,
    // `EFZFEFEFZFEFEFZF` ,
    // `SFDFDSVSFDFDSVSF` ,
    // `ZFZEFZFZEFZFZEFZ` ,
    // `NFGFBNFGFBNFGFBN` ,
    // `VSDVSDVVSDVSDVVS` ,
    // `CQSCQSCCQSCQSCCQ` ,
    // `XCVVXCVXCVVXCVXC` ,
    // `EZFZEFZEZFZEFZEZ` ,
    // `NYTNTNYTNTNYTNTN` ,
    // `OILOIOILOIOILOIO` ,
    // `NJYYGNNJYYGNNJYY` ,
    // `NGBFTGDRNGBFTGDR` ,
    // `FRDFDRFRDFDRFRDF` ,
    // `SEDSQESEDSQESEDS` ,
    // `SDVSDVSDVSDVSDVS` ,
    // `CGBFDGBCGBFDGBCG` ,
    // `CSDCCSDCCSDCCSDC`
]

start();

function start(font, texture) {
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2, -1000, 1000);
    camera.position.z = 100;

    var canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        scene: scene,
        antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);
    
    //CREATE BOX MESH
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xf00000 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    FontTransitions.setRendererPreload(renderer);
    FontTransitions.addFontTransition('thin2bold',
        [
            { json: "fnt/werk/3/1.json", texture: "fnt/werk/3/1.png" },
            { json: "fnt/werk/3/2.json", texture: "fnt/werk/3/2.png" },
            { json: "fnt/werk/3/3.json", texture: "fnt/werk/3/3.png" },
            { json: "fnt/werk/3/4.json", texture: "fnt/werk/3/4.png" },
            { json: "fnt/werk/3/5.json", texture: "fnt/werk/3/5.png" },
            { json: "fnt/werk/3/6.json", texture: "fnt/werk/3/6.png" }
        ],
        createTextsMesh
    );

    renderer.setAnimationLoop(update.bind(this));

    window.addEventListener('mousemove', onMouseMove, false);
}

function createTextsMesh(){
    textArray.forEach((text)=>{
        textInstances.push(new FontVariableGL(
            text,
            [FontTransitions.getFontTransition('thin2bold')],
        ));
    })

    textInstances.forEach((instance)=>{
        scene.add(instance.mesh);
    })
}

function update() {
    inc+= .005;
    textInstances.forEach((textInstance)=>{
        // if (inc > 5.5) {
        //     textInstance.currentTransition = textInstance.arrayTransition[0];
        // }
        textInstance.progress = (Math.sin(inc) + 1) / 2;
        if (!!textInstance.mesh) {
            textInstance.render();
        }
    })
    
    //RAYCASTER
    // raycaster.setFromCamera(mouse, camera);
    // var intersects = raycaster.intersectObjects(textInstances);

    // for (let i = 0; i < intersects.length; i++) {
    //     // console.log(intersects[i].object.mouseEnterFn());
    // }

    // if (intersects.length > 0) {

    //     if (INTERSECTED != intersects[0].object) {

    //         if (INTERSECTED) {
    //             console.log("Enter in the first INTERSECTED");
    //         }
    //         INTERSECTED = intersects[0].object;
    //         INTERSECTED.mouseEnterFn()

    //     }

    // } else {
    //     if (INTERSECTED) INTERSECTED.mouseLeaveFn()
    //     INTERSECTED = null;
    // }

    renderer.render(scene, camera);
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function mouseEnterFn() {
    console.log('Mouse entered');
}
function mouseLeaveFn() {
    console.log('Mouse leaved');
}
