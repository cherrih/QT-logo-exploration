const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor('#fff', 1);


const placeLogo = document.querySelector('#logo');
placeLogo.appendChild(renderer.domElement); 

const scene = new THREE.Scene();
// scene.fog = new THREE.FogExp2(0xffffff, 0.00012)

// // Add in the lights
// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);
// // Add a spotlight
// const pointLight = new THREE.PointLight(0xffffff, 1, 0);
// pointLight.position.set(500, 500, -3000);
// scene.add(pointLight);

// Create the texture loader
const loader = new THREE.TextureLoader();


// Add in the camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = -3000;

// Create the globe
const createLogo = () => {
  const texture = loader.load("/images/queertrip_skin1.png");
  const geometry = new THREE.SphereGeometry(800, 128, 128);
  const material = new THREE.MeshBasicMaterial({
      // color: 0x2727e6,
      map: texture
  })
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -25 * Math.PI / 180;

  scene.add(mesh);
  return mesh;
}

// const createAirplane = () => {
//   const texture = loader.load("/images/airplane.png");
//   const geometry = new THREE.Geometry();
  
//   const point = new THREE.Vector3();
//   const sphericalPoint = new THREE.Spherical(
//     - 950,
//     0.8,
//     0.8
//   )
//   point.setFromSpherical(sphericalPoint);

//   geometry.vertices.push(point);

//   const material = new THREE.PointsMaterial({
//       size: 1200,
//       map: texture,
//       transparent: true,
//       depthTest: true,
//       depthWrite: false
//   });

//   const points = new THREE.Points(geometry, material);
//   scene.add(points);
//   return points;
// }

const createAirplane = () => {
  const geometry = new THREE.PlaneGeometry(1000, 861);
  const texture = loader.load("/images/airplane.png");
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.translateX(-700);
  mesh.translateY(-700);

  mesh.geometry.rotateY(Math.PI/0.85);
  // mesh.geometry.rotateZ(Math.PI/10)
  //add it to the scene and the scene
  scene.add(mesh);
  return mesh;
}
const createBox = () => {
  const geometry = new THREE.PlaneGeometry(1000, 861);
  const texture = loader.load("/images/airplane.png");
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });

  const parent = new THREE.Object3D()
  scene.add(parent)
  
  const pivot = new THREE.Object3D()
  pivot.rotation.z = 0;
  
  parent.add(pivot)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = -700;
  mesh.position.x = -700;
  mesh.geometry.rotateY(0.6);
  // mesh.rotateZ = 0.2;
  pivot.add(mesh)
  return parent;
}
const parent = createBox();
const logoElement = createLogo();
// const airplaneElement = createAirplane();

// Hold camera position
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

const animate = () => {
  // This is tweening for a smoother camera animation
  // const xDistance = targetX - currentX;
  // const yDistance = targetY - currentY; 

  // currentX = currentX + xDistance * 0.1;
  // currentY = currentY + yDistance * 0.1;

  // camera.position.x = currentX;
  // camera.position.y = currentY;

  // Make the camera point at the scene
  camera.lookAt(scene.position);
  
  // Move the logo and plane around
  logoElement.rotateY(0.009);
  // airplaneElement.rotateZ(0.009);
  // airplaneElement.geometry.rotateY(0.009);
  // airplaneElement.rotateY(0.009);
  parent.rotation.z += 0.01;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();



// Handle the resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

// Follow the mousemove

document.addEventListener('mousemove', (event) => {
  const halfPageWidth = window.innerWidth / 2;
  const halfPageHeight = window.innerHeight / 2;

  // The number you multiply by is adding a velocity feel
  targetX = (halfPageWidth - event.pageX) * 2;
  targetY = (halfPageHeight - event.pageY) * 2;
})


document.addEventListener('touchmove', (event) => {
  const halfPageWidth = window.innerWidth / 2;
  const halfPageHeight = window.innerHeight / 2;

  // The number you multiply by is adding a velocity feel
  targetX = (halfPageWidth - event.pageX) * 2;
  targetY = (halfPageHeight - event.pageY) * 2;
})