global.THREE = require('three')

var FontVariableGL = require('./FontVariableGL.js');

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(9999, 9999);
let scene, camera, renderer, text, cube, INTERSECTED;
let inc = 0;

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

var TransThin2Bold = [
    {
        json: "fnt/werk/3/1.json",
        texture: "fnt/werk/3/1.png",
    },
    {
        json: "fnt/werk/3/2.json",
        texture: "fnt/werk/3/2.png",
    },
    {
        json: "fnt/werk/3/3.json",
        texture: "fnt/werk/3/3.png",
    },
    {
        json: "fnt/werk/3/4.json",
        texture: "fnt/werk/3/4.png",
    },
    {
        json: "fnt/werk/3/5.json",
        texture: "fnt/werk/3/5.png",
    },
    {
        json: "fnt/werk/3/6.json",
        texture: "fnt/werk/3/6.png",
    },
]

var TransOther = [
    {
        json: "fnt/werk/2/1.json",
        texture: "fnt/werk/2/1.png",
    },
    {
        json: "fnt/werk/2/2.json",
        texture: "fnt/werk/2/2.png",
    },
    {
        json: "fnt/werk/2/3.json",
        texture: "fnt/werk/2/3.png",
    },
    {
        json: "fnt/werk/2/4.json",
        texture: "fnt/werk/2/4.png",
    }
]

var TransThin2Bold2 = [
    {
        json: "fnt/werk/3/1.json",
        texture: "fnt/werk/3/1.png",
    },
    {
        json: "fnt/werk/3/2.json",
        texture: "fnt/werk/3/2.png",
    },
    {
        json: "fnt/werk/3/3.json",
        texture: "fnt/werk/3/3.png",
    },
    {
        json: "fnt/werk/3/4.json",
        texture: "fnt/werk/3/4.png",
    },
    {
        json: "fnt/werk/3/5.json",
        texture: "fnt/werk/3/5.png",
    },
    {
        json: "fnt/werk/3/6.json",
        texture: "fnt/werk/3/6.png",
    },
]

var TransOther2 = [
    {
        json: "fnt/werk/2/1.json",
        texture: "fnt/werk/2/1.png",
    },
    {
        json: "fnt/werk/2/2.json",
        texture: "fnt/werk/2/2.png",
    },
    {
        json: "fnt/werk/2/3.json",
        texture: "fnt/werk/2/3.png",
    },
    {
        json: "fnt/werk/2/4.json",
        texture: "fnt/werk/2/4.png",
    }
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
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);
    
    //CREATE BOX MESH
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xf00000 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // //CREATE TEXT MESH
    // for (let j = 0; j < textArray.length; j++) { createGlyph(textArray[j], j); }

    function onMyTransitionLoaded(mesh) {
        scene.add(mesh);
    }
    textInstances.push(new FontVariableGL(
        "MON TEXT", 
        [
            {
                name: 'Thin2Bold',
                steps: TransThin2Bold,
                nbrStep: 6
            }, 
            {
                name: 'Other',
                steps: TransOther,
                nbrStep: 4
            }
        ],
    onMyTransitionLoaded) );

    textInstances.push(new FontVariableGL(
        "MON TEXT 2",
        [
            {
                name: 'Thin2Bold',
                steps: TransOther2,
                nbrStep: 4
            }
        ],
        onMyTransitionLoaded));
    
    renderer.setAnimationLoop(update.bind(this));

    window.addEventListener('mousemove', onMouseMove, false);
}

function update() {
    inc+= .008;
    textInstances.forEach((textInstance)=>{
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
