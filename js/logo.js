const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xf2f1ef, 1);


const placeLogo = document.querySelector('#logo');
placeLogo.appendChild(renderer.domElement); 

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.00012)

// Add in the lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
// Add a spotlight
const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(500, 500, -3000);
scene.add(pointLight);

// Create the texture loader
const loader = new THREE.TextureLoader();


// Add in the camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = -3000;

// Create the globe
const createLogo = () => {
  const texture = loader.load("/images/queertrip_skin1.png");
  const geometry = new THREE.SphereGeometry(800, 128, 128);
  const material = new THREE.MeshLambertMaterial({
      // color: 0x2727e6,
      map: texture
  })
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -25 * Math.PI / 180;

  scene.add(mesh);
  return mesh;
}

const createAirplane = () => {
  const texture = loader.load("/images/airplane.png");
  const geometry = new THREE.Geometry();
  
  const point = new THREE.Vector3();
  const sphericalPoint = new THREE.Spherical(
    - 950,
    0.8,
    0.8
  )

  point.setFromSpherical(sphericalPoint);
  geometry.vertices.push(point);

  const material = new THREE.PointsMaterial({
      size: 1200,
      map: texture,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      // Get rid of the boxes around the png
      depthTest: true,
      depthWrite: false
  });

  const points = new THREE.Points(geometry, material);

  scene.add(points)
  return points
}

// const makeSatellite = function(x,y){
//   const geometry = new THREE.SphereGeometry( 120, 33,33 )
//   const material = new THREE.MeshPhongMaterial({
//     color: 0x968f8f,
//     emissive:0x525252,
//     flatShading:true,
//     shininess:200,
//     specular:0x4aff,
//     reflectivity: 1
//   }) 
//    const mesh = new THREE.Mesh(geometry, material)
  
//    mesh.translateX(x)
//    mesh.translateY(y)

//    mesh.geometry.rotateX(Math.PI/1.3)
//    //mesh.geometry.rotateZ(Math.PI/10)
//   //add it to the scene and the scene
//    scene.add(mesh)
//    return mesh
// }

const airplaneElement = createAirplane();

const logoElement = createLogo();

// Hold camera position
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

const animate = () => {
  // This is tweening for a smoother camera animation
  const xDistance = targetX - currentX;
  const yDistance = targetY - currentY; 

  currentX = currentX + xDistance * 0.1;
  currentY = currentY + yDistance * 0.1;

  camera.position.x = currentX;
  camera.position.y = currentY;


  // Make the camera point at the scene
  camera.lookAt(scene.position)

  // Move the globe around
  logoElement.rotateY(0.009);


  renderer.render(scene, camera)
  requestAnimationFrame(animate)
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