import * as THREE from './vendor/three.module.min.js';

const canvas = document.querySelector('.factory-canvas');
const hero = canvas.closest('.hero');
const control = hero.querySelector('.motion-control');
const assembly = hero.querySelector('.hero-assembly');
const show = hero.querySelector('.factory-show');
const showTitle = show.querySelector('.show-title');
const showDetail = show.querySelector('.show-detail');
const showIndex = show.querySelector('.show-index');
const showStage = show.querySelector('.show-stage');
const showProgress = show.querySelector('.show-track span');
const showLabels = [
  ['Dijital Fabrika','Üretim hattı açılıyor','#8af0b5'],
  ['Mobil Uygulama','iOS · Android · Saha uygulamaları','#9ae8ff'],
  ['ERP Danışmanlığı','İhtiyaç analizi · Seçim · Geçiş planı','#ffd391'],
  ['Google Reklamları','Arama · Kampanya · Dönüşüm','#8af0b5'],
  ['Kurumsal Web Sitesi','Tasarım · Geliştirme · Teknik SEO','#edbcff'],
  ['Oyun Geliştirme','Oyun tasarımı · Prototip · Geliştirme','#ffb7c8'],
  ['Sosyal Medya','İçerik · Hesap yönetimi · Raporlama','#b7e4ff'],
  ['Yapay Zekâ Otomasyonu','Belge · E-posta · Tekrar eden işler','#adf8ce']
];
let highlighted = -1;
let status = '';

function updateShow(index, clock, opening, progress) {
  if (index !== highlighted) {
    highlighted = index;
    const [title,detail,color] = showLabels[index];
    show.dataset.active = String(index);
    show.style.setProperty('--show-accent',color);
    showTitle.textContent = title;
    showDetail.textContent = detail;
    showIndex.textContent = String(index).padStart(2,'0')+' / '+String(showLabels.length-1).padStart(2,'0');
  }
  const stage = opening < .9 ? 'SİSTEM AÇILIYOR'
    : clock < .67 ? 'PARÇA ALINIYOR'
      : clock < 2.77 ? 'MONTAJ YAPILIYOR'
        : clock < 4.12 ? 'MONTAJ TAMAMLANDI' : 'HAT İLERLİYOR';
  if (stage !== status) {
    status = stage;
    showStage.textContent = stage;
  }
  showProgress.style.transform = `scaleX(${progress})`;
  const entrance = opening < .9 ? 1 : THREE.MathUtils.smoothstep(clock,0,.40);
  show.style.setProperty('--show-entry',entrance);
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function startFactory() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x190e31, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  const material = (color, roughness = .38, metalness = .3) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const shell = material(0x3b285e);
  const edge = material(0x746198);
  const belt = material(0x27213c, .76);
  const steel = material(0x9992bc);
  const dark = material(0x231835, .68);
  const mint = material(0x8cf0b8);
  const amber = material(0xffb461);
  const lamp = new THREE.MeshStandardMaterial({ color: 0x9affc9, emissive: 0x55df9e, emissiveIntensity: 1.1 });
  const warning = new THREE.MeshStandardMaterial({ color: 0xf975a0, emissive: 0xa12853, emissiveIntensity: .72 });
  const floor = material(0x201433, .68);

  function place(mesh, parent, x, y, z) {
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function box(parent, width, height, depth, surface, x = 0, y = 0, z = 0) {
    return place(new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), surface), parent, x, y, z);
  }
  function tube(parent, radius, length, surface, x, y, z) {
    return place(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 14), surface), parent, x, y, z);
  }
  function group(parent, x, y, z) {
    return place(new THREE.Group(), parent, x, y, z);
  }
  function light(color, intensity, x, y, z) {
    const source = new THREE.DirectionalLight(color, intensity);
    source.position.set(x, y, z);
    scene.add(source);
  }

  scene.add(new THREE.HemisphereLight(0xcdb8ff, 0x302046, 2.25));
  light(0xc8b1ff, 3.3, -4, 9, 8);
  light(0x69efbb, 4.2, 8, 4, -4);
  light(0xe786bc, 1.3, -10, 2, -6);
  const deck = group(scene, 0, 0, 0);
  box(scene, 64, .15, 55, floor, 0, -.47, 0);
  const grid = new THREE.GridHelper(54, 32, 0x443060, 0x302044);
  grid.position.y = -.38;
  scene.add(grid);

  const crates = [
    [-11,-6,3.2,3.7,3.1],[-7,-7.5,3.5,4.2,3.1],[-3.2,-7,3.3,2.8,3.7],
    [1.1,-8.2,4,4.4,3.2],[6.4,-7,3.4,3,3.1],[10.3,-6,3,3.8,3.5],
    [-10,4,2.4,1.4,2.1],[10.5,3.4,2.1,1.25,2.4]
  ];
  for (const [x,z,w,h,d] of crates) {
    box(scene,w,h,d,shell,x,h/2-.24,z);
    box(scene,w+.08,.1,d+.08,edge,x,h-.21,z);
    box(scene,w*.54,.08,.04,mint,x,h*.67,z+d/2+.03);
    box(scene,w*.30,.08,.04,dark,x,h*.52,z+d/2+.03);
  }

  box(deck,18.9,.32,6.1,edge,0,.05,0);
  box(deck,18.45,.55,5.8,shell,0,.42,0);
  for (let i = 0; i < 11; i++) {
    box(deck,1.25,.29,.07,dark,(i-5)*1.57,.42,2.93);
    box(deck,.28,.045,.08,i % 3 === 0 ? lamp : edge,(i-5)*1.57,.42,2.98);
  }
  const machinery = group(deck,0,0,0);
  for (const x of [-7.8,-3.9,0,3.9,7.8]) {
    for (const z of [-1.13,1.13]) {
      box(machinery,.2,1,.21,steel,x,1.05,z);
      box(machinery,.55,.09,.48,dark,x,.62,z);
    }
  }
  box(machinery,17.6,.38,2.28,dark,0,1.45,0);
  box(machinery,17.5,.15,1.97,belt,0,1.67,0);
  for (const z of [-1.13,1.13]) {
    box(machinery,18,.18,.16,edge,0,1.69,z);
    box(machinery,17.85,.035,.07,mint,0,1.8,z);
  }
  const rollers = Array.from({length: 56}, (_, index) => {
    const roller = tube(machinery,.052,1.92,index % 6 === 0 ? edge : steel,-8.65+index*.31,1.76,0);
    roller.rotation.x = Math.PI / 2;
    return roller;
  });

  function makeArm(x, z) {
    const root = group(machinery,x,.72,z);
    tube(root,.63,.22,dark,0,.13,0);
    tube(root,.53,.13,mint,0,.28,0);
    const turret = group(root,0,.35,0);
    tube(turret,.43,.46,shell,0,.21,0);
    const shoulder = group(turret,0,.47,0);
    const shoulderPin = tube(shoulder,.31,.68,edge,0,0,0);
    shoulderPin.rotation.z = Math.PI / 2;
    box(shoulder,.34,1.52,.37,steel,0,.73,0);
    box(shoulder,.23,1.1,.09,shell,0,.73,.20);
    const elbow = group(shoulder,0,1.48,0);
    const elbowPin = tube(elbow,.26,.52,shell,0,0,0);
    elbowPin.rotation.z = Math.PI / 2;
    box(elbow,.3,1.29,.34,edge,0,.63,0);
    box(elbow,.14,.95,.065,mint,0,.62,.18);
    const wrist = group(elbow,0,1.3,0);
    tube(wrist,.19,.25,dark,0,.07,0);
    tube(wrist,.17,.07,amber,0,.19,0);
    const jaws = [-1,1].map(sign => {
      const jaw = group(wrist,sign*.17,.19,0);
      box(jaw,.08,.23,.17,steel,0,.10,0);
      box(jaw,.15,.07,.17,amber,-sign*.045,.23,0);
      return jaw;
    });
    return { turret, shoulder, elbow, wrist, jaws, x, z };
  }
  const stationPitch = 4.34;
  const beltStart = -2 * stationPitch;
  const palletHeight = 1.90;
  const partHeight = .23;
  const partSurfaces = [mint, amber, steel, lamp];

  function makePart(parent, index) {
    const part = group(parent,0,0,0);
    box(part,.43,partHeight,.38,partSurfaces[index]);
    if (index === 0 || index === 3) {
      tube(part,.078,.06,dark,0,.10,0);
    } else {
      box(part,.20,.045,.05,dark,0,.095,0);
    }
    return part;
  }

  const stations = partSurfaces.map((_,index) => {
    const x = beltStart + (index + .5)*stationPitch;
    const arm = makeArm(x+.32,-1.82);
    const feed = new THREE.Vector3(x+1.26,2.23,-1.36);
    const offset = index%2 ? .32 : -.32;
    const depth = index < 2 ? -.34 : .17;
    const mount = new THREE.Vector3(x+offset,palletHeight+.51+partHeight/2,depth);
    const stand = group(machinery,feed.x,.71,feed.z);
    box(stand,.77,1.30,.61,dark,0,.65,0);
    box(stand,.86,.13,.70,edge,0,1.34,0);
    box(stand,.14,.035,.65,steel,-.35,1.42,0);
    box(stand,.14,.035,.65,steel,.35,1.42,0);
    const indicator = tube(stand,.077,.077,lamp,0,1.43,-.23);
    const stock = makePart(machinery,index);
    const carried = makePart(machinery,index);
    const aboveFeed = feed.clone().add(new THREE.Vector3(0,.61,0));
    const aboveMount = mount.clone().add(new THREE.Vector3(0,.40,0));
    const motion = [
      [.0,aboveFeed],[.45,feed],[.67,feed],[1.19,aboveFeed],
      [2.06,aboveMount],[2.61,mount],[2.84,mount],[3.31,aboveMount],[4.04,aboveFeed]
    ];
    return { arm, feed, offset, depth, stock, carried, indicator, motion };
  });

  // The gripper targets an actual point in the scene. Solve the two arm links
  // in the vertical plane that passes through the shoulder and the target.
  function reach(arm, target, grip) {
    const dx = target.x-arm.x;
    const dz = target.z-arm.z;
    const vertical = target.y+.42-1.54;
    const horizontal = Math.hypot(dx,dz);
    const upper = 1.48;
    const fore = 1.30;
    const cosine = (horizontal**2+vertical**2-upper**2-fore**2)/(2*upper*fore);
    const elbowAngle = -Math.acos(THREE.MathUtils.clamp(cosine,-1,1));
    const shoulderAngle = Math.atan2(horizontal,vertical)
      -Math.atan2(fore*Math.sin(elbowAngle),upper+fore*Math.cos(elbowAngle));
    arm.turret.rotation.y = Math.atan2(dx,dz);
    arm.shoulder.rotation.x = shoulderAngle;
    arm.elbow.rotation.x = elbowAngle;
    arm.wrist.rotation.x = Math.PI-shoulderAngle-elbowAngle;
    arm.jaws.forEach((jaw,index) => {
      const side = index ? 1 : -1;
      jaw.position.x = side*THREE.MathUtils.lerp(.40,.28,grip);
    });
  }

  const burstColors = [0x8af0b5,0x9ae8ff,0xffd391,0xedbcff];
  const burstGeometry = new THREE.IcosahedronGeometry(.036,0);
  const beamGeometry = new THREE.TorusGeometry(1,.024,6,48);
  stations.forEach((station,index) => {
    const [,mount] = station.motion[5];
    const flash = group(machinery,mount.x,mount.y,mount.z);
    const glow = new THREE.MeshBasicMaterial({
      color:burstColors[index],transparent:true,opacity:0,depthWrite:false,
      blending:THREE.AdditiveBlending
    });
    const ring = place(new THREE.Mesh(beamGeometry,glow),flash,0,.06,0);
    ring.rotation.x = -Math.PI/2;
    const sparks = Array.from({length:12},(_,i) => {
      const spark = place(new THREE.Mesh(burstGeometry,glow),flash,0,0,0);
      const angle = i*2.39996;
      return {spark,x:Math.cos(angle)*(.54+(i%3)*.24),z:Math.sin(angle)*(.54+(i%3)*.24),y:.32+(i%4)*.19};
    });
    const light = place(new THREE.PointLight(burstColors[index],0,4,2),flash,0,.24,0);
    station.flash = {flash,glow,ring,sparks,light};
  });

  function sparkStation(station, clock, occupied) {
    const {flash,glow,ring,sparks,light} = station.flash;
    const age = (clock-2.77)/.67;
    flash.visible = occupied && age >= 0 && age < 1;
    light.intensity = flash.visible ? 9*(1-age)**2 : 0;
    if (!flash.visible) return;
    glow.opacity = .85*(1-age);
    ring.scale.setScalar(.16+age*.93);
    for (const {spark,x,y,z} of sparks) {
      spark.position.set(x*age,y*age-.24*age**2,z*age);
      spark.scale.setScalar(1.45-age);
    }
  }

  const gripTarget = new THREE.Vector3();
  function moveStation(station, clock, occupied) {
    const { arm, feed, stock, carried, indicator, motion } = station;
    stock.position.copy(feed);
    if (!occupied) {
      reach(arm,motion[0][1],0);
      carried.visible = false;
      stock.visible = true;
      indicator.visible = false;
      return;
    }
    const next = motion.findIndex(([time]) => time > clock);
    if (next > 0) {
      const [start,from] = motion[next-1];
      const [end,to] = motion[next];
      gripTarget.lerpVectors(from,to,THREE.MathUtils.smoothstep(clock,start,end));
    } else {
      gripTarget.copy(motion[0][1]);
    }
    const grip = THREE.MathUtils.smoothstep(clock,.45,.64)
      * (1-THREE.MathUtils.smoothstep(clock,2.65,2.82));
    reach(arm,gripTarget,grip);
    carried.visible = clock >= .64 && clock < 2.77;
    carried.position.copy(gripTarget);
    stock.visible = clock < .64 || clock >= 3.35;
    indicator.visible = clock >= 2.77;
  }

  const logo = new Image();
  const modules = [
    ['GÜNGÖR','#8ff0c0', (ctx) => {
      if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 91, 24, 74, 74);
      else { ctx.font = '900 78px system-ui'; ctx.fillText('G',128,92); }
    }],
    ['MOBİL UYGULAMA','#85e4fd', (ctx) => {
      ctx.strokeRect(105,24,46,75);
      ctx.beginPath();ctx.moveTo(115,64);ctx.lineTo(125,74);ctx.lineTo(140,54);ctx.stroke();
    }],
    ['ERP DANIŞMANLIĞI','#f5c586', (ctx) => {
      for (let i=0;i<3;i++) {
        const y=42+i*19;
        ctx.beginPath();ctx.moveTo(83,y);ctx.lineTo(128,y+16);ctx.lineTo(173,y);ctx.stroke();
      }
    }],
    ['GOOGLE ADS','#90f6bc', (ctx) => {
      for (let i=0;i<4;i++) ctx.fillRect(82+i*25,90-i*15,13,12+i*15);
    }],
    ['KURUMSAL WEB','#e7b6ff', (ctx) => {
      ctx.strokeRect(78,27,100,68);
      ctx.fillRect(78,43,100,5);
      ctx.fillRect(91,59,28,22);
      ctx.fillRect(128,59,37,5);
      ctx.fillRect(128,71,28,5);
    }],
    ['OYUN GELİŞTİRME','#ffb7c8', (ctx) => {
      ctx.beginPath();ctx.roundRect(75,42,106,49,18);ctx.stroke();
      ctx.fillRect(97,55,7,23);ctx.fillRect(89,63,23,7);
      ctx.fillRect(145,56,8,8);ctx.fillRect(156,68,8,8);
    }],
    ['SOSYAL MEDYA','#b7e4ff', (ctx) => {
      ctx.beginPath();ctx.roundRect(78,26,100,64,10);ctx.stroke();
      ctx.beginPath();ctx.moveTo(102,90);ctx.lineTo(102,104);ctx.lineTo(123,90);ctx.stroke();
      for (let i=0;i<3;i++) ctx.fillRect(103+i*20,54,9,9);
    }],
    ['YZ OTOMASYONU','#adf8ce', (ctx) => {
      ctx.strokeRect(103,36,50,50);
      ctx.beginPath();ctx.moveTo(128,22);ctx.lineTo(128,36);ctx.moveTo(128,86);ctx.lineTo(128,102);
      ctx.moveTo(88,61);ctx.lineTo(103,61);ctx.moveTo(153,61);ctx.lineTo(168,61);
      ctx.moveTo(114,61);ctx.lineTo(124,70);ctx.lineTo(142,49);ctx.stroke();
    }]
  ];
  const moduleTextures = modules.map(([label,color,icon]) => {
    const tile = document.createElement('canvas');
    tile.width = 256;tile.height = 160;
    const ctx = tile.getContext('2d');
    const texture = new THREE.CanvasTexture(tile);
    texture.colorSpace = THREE.SRGBColorSpace;
    function draw() {
      ctx.fillStyle = '#292140';ctx.fillRect(0,0,256,160);
      ctx.strokeStyle = '#9b87bd';ctx.lineWidth = 3;ctx.strokeRect(7,7,242,146);
      ctx.fillStyle = color;ctx.strokeStyle = color;ctx.lineWidth = 6;
      ctx.textAlign = 'center';icon(ctx);
      ctx.font = '800 21px system-ui';ctx.fillText(label,128,132);
      texture.needsUpdate = true;
    }
    draw();
    if (label === 'GÜNGÖR') logo.addEventListener('load',draw,{once:true});
    return texture;
  });
  logo.src = '/assets/logo.png';
  const pieces = moduleTextures.map((texture,index) => {
    const pallet = group(machinery,0,palletHeight,0);
    box(pallet,1.92,.16,1.54,dark,0,.02,0);
    box(pallet,1.6,.26,1.34,index === 2 ? amber : mint,0,.23,0);
    const face = new THREE.MeshStandardMaterial({map:texture,roughness:.5,emissive:0x171029});
    box(pallet,1.73,.73,.08,face,0,.60,.65);
    box(pallet,1.48,.16,1.18,shell,0,.43,-.02);
    const fittedParts = stations.map((station,stationIndex) => {
      const part = makePart(pallet,stationIndex);
      part.position.set(station.offset,.51+partHeight/2,station.depth);
      return part;
    });
    return { pallet, fittedParts };
  });

  const lid = group(deck,0,.78,-2.77);
  box(lid,18.2,.21,5.5,shell,0,.01,2.75);
  box(lid,17.6,.05,.12,edge,0,.14,5.42);
  for (let i=0;i<13;i++) box(lid,.6,.055,.19,edge,(i-6)*1.27,.14,4.94);
  const side = group(deck,9.15,.79,0);
  box(side,.18,.15,5.5,edge,0,0,0);

  let visible = true;
  let paused = reducedMotion.matches;
  let useStaticPose = paused;
  let elapsed = 0;
  let previous;
  let frame;
  let sceneWidth = 0;
  let lastRevealTime;
  const cameraTarget = new THREE.Vector3();
  function render(t) {
    const revealTime = useStaticPose ? 2.15 : Math.min(t,2.15);
    if (revealTime !== lastRevealTime) {
      const lidLift = THREE.MathUtils.smoothstep(revealTime,.08,.78);
      const spread = THREE.MathUtils.smoothstep(revealTime,.28,2.15);
      assembly.style.setProperty('--cube-open',lidLift);
      assembly.style.setProperty('--factory-reveal',`${spread*178}%`);
      assembly.style.setProperty('--factory-grow',.13+spread*.87);
      assembly.style.setProperty('--factory-beam',.27+.69*Math.sin(Math.PI*spread));
      assembly.style.setProperty('--projection-edge',spread*.85);
      lastRevealTime = revealTime;
    }
    const opening = useStaticPose ? 1 : THREE.MathUtils.smoothstep(t,0,1.75);
    lid.position.y = 1.15-.35*opening;
    lid.rotation.x = -opening*2.70;
    const rise = THREE.MathUtils.smoothstep(opening,.18,.95);
    machinery.position.y = -1.15*(1-rise);
    machinery.visible = opening > .18;
    side.rotation.z = -opening*.28;
    const cycleLength = 5.35;
    const phase = Math.max(0,t-1.65)*1.35;
    const step = Math.floor(phase/cycleLength);
    const clock = phase%cycleLength;
    const advance = THREE.MathUtils.smoothstep(clock,4.12,cycleLength);
    const highlight = useStaticPose ? 0 : step%showLabels.length;
    updateShow(highlight,useStaticPose ? 2.78 : clock,opening,useStaticPose ? 1 : clock/cycleLength);
    if (sceneWidth) {
      const mobile = sceneWidth < 850;
      const drift = useStaticPose ? 0 : Math.sin(t*.36);
      const push = useStaticPose ? 0 : .85*Math.sin(Math.PI*THREE.MathUtils.smoothstep(clock,1.65,4.14));
      camera.position.set((mobile ? 8 : 9.7)+drift*.8,mobile ? 8.2 : 9.8,(mobile ? 20 : 18)-push);
      cameraTarget.set(drift*.34,mobile ? 2.62 : 2.98,0);
      camera.lookAt(cameraTarget);
    }
    const beltTravel = (step+advance)*stationPitch;
    rollers.forEach((roller,index) => {
      roller.position.x = -8.65 + (index*.31 + beltTravel)%(4*stationPitch);
    });
    stations.forEach((station,index) => {
      const occupied = pieces.some((_,pieceIndex) => step >= pieceIndex
        && (step-pieceIndex)%pieces.length === index);
      moveStation(station,clock,!useStaticPose && occupied);
      sparkStation(station,clock,!useStaticPose && occupied);
    });
    pieces.forEach(({pallet,fittedParts},index) => {
      const age = step-index;
      const stage = useStaticPose ? index-1 : Math.max(0,age)%pieces.length;
      const position = stage+.5+(useStaticPose ? 0 : advance);
      const location = Math.floor(position);
      pallet.visible = opening > .8 && position >= 0 && position < 4 && (useStaticPose || age >= 0);
      pallet.position.x = beltStart+position*stationPitch;
      const clearance = Math.min(position,4-position);
      pallet.scale.setScalar(THREE.MathUtils.lerp(.48,1,THREE.MathUtils.smoothstep(clearance,0,.44)));
      fittedParts.forEach((part,partIndex) => {
        part.visible = partIndex < location
          || (!useStaticPose && location === stage && partIndex === stage && clock >= 2.77);
      });
    });
    renderer.render(scene,camera);
  }
  function tick(now) {
    frame = undefined;
    if (previous !== undefined) elapsed += Math.min((now-previous)/1000,.05);
    previous = now;
    render(elapsed);
    schedule();
  }
  function schedule() {
    if (!frame && visible && !paused && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = undefined;
    previous = undefined;
    render(elapsed);
    schedule();
  }
  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    sceneWidth = width;
    camera.aspect = width/height;
    const mobile = width < 850;
    camera.fov = width < 500 ? 50 : mobile ? 44 : 35;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    render(elapsed);
  }
  const updateButton = () => {
    control.textContent = paused ? 'Animasyonu oynat' : 'Animasyonu duraklat';
  };
  control.addEventListener('click', () => {
    paused = !paused;
    if (!paused) useStaticPose = false;
    updateButton();
    sync();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    useStaticPose = paused;
    updateButton();
    sync();
  });
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {visible = entry.isIntersecting;sync();}).observe(assembly.querySelector('.hero-surface'));
  canvas.addEventListener('webglcontextlost',event => {
    event.preventDefault();
    paused = true;
    hero.classList.remove('factory-ready');
    assembly.removeAttribute('style');
    control.hidden = true;
    show.hidden = true;
    sync();
  });
  resize();
  hero.classList.add('factory-ready');
  control.hidden = false;
  show.hidden = false;
  updateButton();
  schedule();
}

try {
  startFactory();
} catch (error) {
  console.warn('3B fabrika başlatılamadı.', error);
}
