// interactive 3d viewer for the works page.
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.querySelectorAll('.model-viewer').forEach(setup);

function setup(box) {
    const status = box.querySelector('.model-status');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    box.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101810);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334433, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(1, 2, 1.5);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // textures embedded in the fbx just work. for models whose textures are separate
    // files, add data-textures="folder/": 3ds max saves absolute paths from the original
    // computer, so every texture gets pointed at that folder instead
    const textureDir = box.dataset.textures;
    const manager = new THREE.LoadingManager();
    if (textureDir) manager.setURLModifier(function(url) {
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        const name = decodeURIComponent(url).split(/[\\/]/).pop();
        return /\.(jpe?g|png|tga|tiff?|bmp)$/i.test(name) ? textureDir + encodeURIComponent(name) : url;
    });

    new FBXLoader(manager).load(box.dataset.model, function(model) {
        scene.add(model);

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3()).length();
        const center = bounds.getCenter(new THREE.Vector3());
        cutaway = makeCutaway(model, bounds, center);

        // frame the camera around the whole model
        controls.target.copy(center);
        camera.position.copy(center).add(new THREE.Vector3(0.6, 0.45, 0.8).multiplyScalar(size * 0.7));
        camera.near = size / 1000;
        camera.far = size * 10;
        camera.updateProjectionMatrix();
        controls.update();

        if (status) status.remove();
    }, function(e) {
        if (status && e.total) status.textContent = 'loading model… ' + Math.round(e.loaded / e.total * 100) + '%';
    }, function(err) {
        console.error(err);
        if (status) status.textContent = 'couldn\'t load the model';
    });

    function resize() {
        const w = box.clientWidth;
        const h = Math.round(w * 9 / 16);
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    let cutaway = null;
    renderer.setAnimationLoop(function() {
        controls.update();
        if (cutaway) cutaway(camera.position);
        renderer.render(scene, camera);
    });
}

// dollhouse view for room scenes: hides whichever walls / floor / ceiling are
// between the camera and the inside of the room, plus anything mounted on them
// (doors, windows, clocks). returns a function to call every frame.
function makeCutaway(model, bounds, center) {
    const full = bounds.getSize(new THREE.Vector3());
    const axes = ['x', 'y', 'z'];
    const meshes = [];
    model.traverse(function(obj) {
        if (obj.isMesh) meshes.push({ obj: obj, box: new THREE.Box3().setFromObject(obj) });
    });

    // a shell piece spans most of the room in two directions and is thin in the third
    const shells = [];
    meshes.forEach(function(m) {
        const s = m.box.getSize(new THREE.Vector3());
        const big = axes.filter(function(a) { return s[a] >= full[a] * 0.7; });
        if (big.length !== 2) return;
        const thin = axes.find(function(a) { return big.indexOf(a) < 0; });
        const mid = (m.box.min[thin] + m.box.max[thin]) / 2;
        // skip pieces in the middle of the room, only the outer shell gets cut away
        if (Math.abs(mid - center[thin]) < full[thin] * 0.25) return;
        shells.push({ axis: thin, side: Math.sign(mid - center[thin]), objs: [m.obj], box: m.box });
        m.shell = true;
    });

    // small things sitting against a shell piece get hidden along with it
    meshes.forEach(function(m) {
        if (m.shell) return;
        shells.forEach(function(sh) {
            const a = sh.axis;
            const pad = 25;
            if (m.box.max[a] - m.box.min[a] < 40 &&
                m.box.min[a] >= sh.box.min[a] - pad && m.box.max[a] <= sh.box.max[a] + pad) {
                sh.objs.push(m.obj);
            }
        });
    });

    return function(cam) {
        shells.forEach(function(sh) {
            const a = sh.axis;
            const camSide = cam[a] - center[a];
            const edge = sh.side > 0 ? sh.box.min[a] : sh.box.max[a];
            const outside = Math.sign(camSide) === sh.side && Math.abs(cam[a] - center[a]) > Math.abs(edge - center[a]);
            sh.objs.forEach(function(o) { o.visible = !outside; });
        });
    };
}
