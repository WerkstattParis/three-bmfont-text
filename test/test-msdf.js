global.THREE = require('three')
var createTextMSDF = require('../')
var MSDFShader = require('../shaders/msdf')
var fontLoader = require('../lib/font-loader.js')

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(9999, 9999);
let scene, camera, renderer, text, cube, INTERSECTED;

var textInstances = [];
var mesTexts = [];
var textArray = [
    { text: `IIIIIIIIIIIIII` },
    { text: `BCDEFGHIJKLMNOPQRS` },
    // {text: `CDEFGHIJKLMNOPQ`},
    // {text: `DEFGHIJKLMNOPQR`},
    // {text: `EFGHIJKLMNOPQRS`},
    // {text: `FGHIJKLMNOPQRST`},
    // {text: `GHIJKLMNOPAPQRS`},
    // {text: `EFGHIJKLMNOPQRS`},
    // {text: `EFZFEFEFZFEFEFZF`},
    // {text: `SFDFDSVSFDFDSVSF`},
    // {text: `ZFZEFZFZEFZFZEFZ`},
    // {text: `NFGFBNFGFBNFGFBN`},
    // {text: `VSDVSDVVSDVSDVVS`},
    // {text: `CQSCQSCCQSCQSCCQ`},
    // {text: `XCVVXCVXCVVXCVXC`},
    // {text: `EZFZEFZEZFZEFZEZ`},
    // {text: `NYTNTNYTNTNYTNTN`},
    // {text: `OILOIOILOIOILOIO`},
    // {text: `NJYYGNNJYYGNNJYY`},
    // {text: `NGBFTGDRNGBFTGDR`},
    // {text: `FRDFDRFRDFDRFRDF`},
    // {text: `SEDSQESEDSQESEDS`},
    // {text: `SDVSDVSDVSDVSDVS`},
    // {text: `CGBFDGBCGBFDGBCG`},
    // {text: `CSDCCSDCCSDCCSDC`},
    // {text: `ABEAZECABEAZECAB`},
    // {text: `ABSDFCABSDFCABSD`},
    // {text: `VXCVVXCVVXCVVXCV`},
    // {text: `HFJTYJHFJTYJHFJT`},
    // {text: `KUYJYTKUYJYTKUYJ`},
    // {text: `BVNNGHBVNNGHBVNN`},
    // {text: `KHYKUIKHYKUIKHYK`},
    // {text: `YTIIUYTIIUYTIIUY`},
    // {text: `ILUIOLILUIOLILUI`},
    // {text: `OLOMPOLOMPOLOMPO`},
    // {text: `JUDGRDFJUDGRDFJU`},
    // {text: `SEFRGSEFRGSEFRGS`},
    // {text: `VFXVFGNVFXVFGNVF`},
    // {text: `VXFVDCVXFVDCVXFV`},
    // {text: `SDFFGBSDFFGBSDFF`},
    // {text: `DFVDRDDFVDRDDFVD`},
    // {text: `XDVSXDVSXDVSXDVS`},
    // {text: `ABCABCABCABCOIDI` },
    // {text: `KAPDKAPDKAPDKAPD` },
    // {text: `POAJKZPOAJKZPOAJ` },
    // {text: `LKZQSALKZQSALKZQ` },
    // {text: `DFEZFDFEZFDFEZFD` },
    // {text: `TRHTRTRHTRTRHTRT` },
    // {text: `CXVXCVCXVXCVCXVX` },
    // {text: `QSCQSCQSCQSCQSCQ` },
    // {text: `EAZEAZEAZEAZEAZE` },
    // {text: `EFFEFFEFFEFFZDQZ` },
    // {text: `CXVXCVCXVXCVCXVX` },
    // {text: `RTHRTGRTHRTGRTHR` },
    // {text: `EFZFEFEFZFEFEFZF` },
    // {text: `SFDFDSVSFDFDSVSF` },
    // {text: `ZFZEFZFZEFZFZEFZ` },
    // {text: `NFGFBNFGFBNFGFBN` },
    // {text: `VSDVSDVVSDVSDVVS` },
    // {text: `CQSCQSCCQSCQSCCQ` },
    // {text: `XCVVXCVXCVVXCVXC` },
    // {text: `EZFZEFZEZFZEFZEZ` },
    // {text: `NYTNTNYTNTNYTNTN` },
    // {text: `OILOIOILOIOILOIO` },
    // {text: `NJYYGNNJYYGNNJYY` },
    // {text: `NGBFTGDRNGBFTGDR` },
    // {text: `FRDFDRFRDFDRFRDF` },
    // {text: `SEDSQESEDSQESEDS` },
    // {text: `SDVSDVSDVSDVSDVS` },
    // {text: `CGBFDGBCGBFDGBCG` },
    // {text: `CSDCCSDCCSDCCSDC` },
    // {text: `ABEAZECABEAZECAB` }
]

var fontArray = [
    {
        font: 'fnt/werk/3/1.json',
        image: 'fnt/werk/3/1.png'
    },
    {
        font: 'fnt/werk/3/2.json',
        image: 'fnt/werk/3/2.png'
    },
    {
        font: 'fnt/werk/3/3.json',
        image: 'fnt/werk/3/3.png'
    },
    {
        font: 'fnt/werk/3/4.json',
        image: 'fnt/werk/3/4.png'
    },
    {
        font: 'fnt/werk/3/5.json',
        image: 'fnt/werk/3/5.png'
    },
    {
        font: 'fnt/werk/3/6.json',
        image: 'fnt/werk/3/6.png'
    },
];

fontLoader(fontArray, textArray, start);

function start(font, texture) {
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / -2, window.innerHeight / 2, -1000, 1000);

    var canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        scene: scene,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);

    
    for (let j = 0; j < textArray.length; j++) { createGlyph(textArray[j], j); }
    
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xf00000 });
    cube = new THREE.Mesh(geometry, material);
    
    camera.position.z = 100;
    scene.add(cube);
    
    renderer.setAnimationLoop(update.bind(this));

    window.addEventListener('mousemove', onMouseMove, false);
}

function mouseEnterFn(){
    console.log('Mouse entered');
}
function mouseLeaveFn() {
    console.log('Mouse leaved');
}



function update() {
    //MY SHIT
    textInstances.forEach((element, index) => {
        element.material.realProg = element.material.realProg + 0.07;

        let progress = (((Math.sin(element.material.realProg) + 1) / 2) * (fontArray.length - 1));

        let modulo = progress % 1;
        let nbr = Math.floor(progress);


        if (nbr == fontArray.length) {
            modulo = 0.999999;
            nbr = fontArray.length;
        }

        element.material.uniforms.progress.value = modulo;

        if ((nbr + 1) >= fontArray.length) return;

        element.material.uniforms.tMapTo.value = textArray[index].data[nbr + 1].texture;
        element.material.uniforms.tMapFrom.value = textArray[index].data[nbr].texture;
        element.geometry.setAttribute('uvTo', textArray[index].data[nbr + 1].uvs);
        element.geometry.setAttribute('uv', textArray[index].data[nbr].uvs);
        element.geometry.setAttribute('positionTo', textArray[index].data[nbr + 1].positions);
        element.geometry.setAttribute('position', textArray[index].data[nbr].positions);
    });
    

    //RAYCASTER
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(textInstances);

    for (let i = 0; i < intersects.length; i++) {
        // console.log(intersects[i].object.mouseEnterFn());
    }

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) {
                console.log("Enter in the first INTERSECTED");
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.mouseEnterFn()

        }

    } else {
        if (INTERSECTED) INTERSECTED.mouseLeaveFn()
        INTERSECTED = null;
    }

    renderer.render(scene, camera);
};

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function createGlyph(element, index) {
    var geom = createTextMSDF({
        indices: element.data[0].indices,
        positionFrom: element.data[1].positions,
        positionTo: element.data[0].positions,
        layout: element.data[0].layout,
        uvFrom: element.data[1].uvs,
        uvTo: element.data[0].uvs,
        visibleGlyphs: element.data[0].visibleGlyphs
    })

    let raw = new THREE.RawShaderMaterial(MSDFShader({
        tMapFrom: element.data[1].texture,
        tMapTo: element.data[0].texture,
        side: THREE.DoubleSide,
        transparent: true,
        progress: 0,
        negate: true,
        color: 0xfffffff,
    }))

    raw.realProg = 0;
    mesTexts.push(raw);

    // var hauteurLigne = geom.layout
    var text = new THREE.Mesh(geom, raw)
    text.position.y = Math.random() * 400;
    text.scale.multiplyScalar(1);
    
    text.mouseEnterFn = mouseEnterFn;
    text.mouseLeaveFn = mouseLeaveFn;
    
    textInstances.push(text);
    scene.add(text);

}


function mouseEnterFn() {
    console.log('Mouse entered');
}
function mouseLeaveFn() {
    console.log('Mouse leaved');
}
