// إعداد المشهد والكاميرا والرندر
const scene = new THREE.Scene();
// بدل هذا السطر
// scene.background = new THREE.Color(0x000000);

// بهذا السطر لإنشاء تدرج لوني
const canvas = document.createElement('canvas');
canvas.width = 510;
canvas.height = 510;
const ctx = canvas.getContext('2d');

// إنشاء gradient دائري
const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);

gradient.addColorStop(0.2, '#0a0a33'); // أزرق غامق في الوسط
gradient.addColorStop(1, '#000000'); // أسود في الأطراف

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 510, 510);

const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;


const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4); // بداية الكاميرا أمام المجسم

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// TrackballControls
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.dynamicDampingFactor = 0.3;
controls.minDistance = 1;
controls.maxDistance = 100;

// نجوم
const starGeometry = new THREE.BufferGeometry();
const starCount = 6000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.7) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.6) * 1000;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// تحميل نموذج glb
const loader = new THREE.GLTFLoader();
let moonModel;

loader.load('moon.glb', gltf => {
  moonModel = gltf.scene;
  moonModel.scale.set(1, 1, 1);
  moonModel.position.set(0, 0, 0);
  scene.add(moonModel);
}, undefined, error => {
  console.error('حدث خطأ أثناء تحميل النموذج:', error);
});

// إضاءة
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// تدوير الكاميرا تلقائيًا
let autoRotateAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  // تدوير النجوم
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;

  // تدوير الكاميرا بشكل تلقائي حول المجسم
  autoRotateAngle += 0.009;
  const radius = 5;
  camera.position.x = Math.sin(autoRotateAngle) * radius;
  camera.position.z = Math.cos(autoRotateAngle) * radius;
  controls.target.set(0, 0, 0) // النظر إلى مركز المجسم

  controls.update(); // السماح للمستخدم بالتفاعل أيضًا

  renderer.render(scene, camera);
}

animate();

// تحديث الحجم عند تغيير حجم النافذة
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize(); // تحديث TrackballControls
});

// تحديد تاريخ البداية الثابت (تاريخ إطلاق المشروع)
const projectStartDate = new Date("2025-04-16T00:00:00");

// حساب تاريخ نهاية الـ 6 أشهر
const countdownDate = new Date(projectStartDate);
countdownDate.setMonth(countdownDate.getMonth() + 6);

// تحديث العدّاد كل ثانية
const interval = setInterval(() => {
  const now = new Date();
  const distance = countdownDate - now;

  if (distance <= 0) {
    clearInterval(interval);
    console.log("انتهى الوقت!");
    return;
  }

  // الحسابات
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // طباعة القيم أو إرسالها للواجهة
  console.log(`الأيام: ${days}, الساعات: ${hours}, الدقائق: ${minutes}, الثواني: ${seconds}`);

  // ربط مع عناصر إن وجدت
  const el = id => document.getElementById(id);
  if (el("days")) el("days").innerText = days;
  if (el("hours")) el("hours").innerText = hours;
  if (el("minutes")) el("minutes").innerText = minutes;
  if (el("seconds")) el("seconds").innerText = seconds;
}, 1000);