import * as THREE from 'three';

const FACES = [
  { key: 'inicio',      label: 'Inicio',      euler: [0, 0, 0],            hash: '#inicio' },
  { key: 'proyectos',   label: 'Proyectos',   euler: [0, -Math.PI / 2, 0], hash: '#proyectos' },
  { key: 'habilidades', label: 'Habilidades', euler: [0, -Math.PI, 0],      hash: '#habilidades' },
  { key: 'sobre-mi',    label: 'Sobre mí',    euler: [0, Math.PI / 2, 0],  hash: '#sobre-mi' },
  { key: 'testimonios', label: 'Testimonios', euler: [-Math.PI / 2, 0, 0], hash: '#testimonios' },
  { key: 'contacto',    label: 'Contacto',    euler: [Math.PI / 2, 0, 0],  hash: '#contacto' },
];

const canvas          = document.getElementById('scene-canvas');
const wrap            = document.getElementById('scene-wrap');
const fallback        = document.getElementById('fallback');
const panelsContainer = document.getElementById('panels-container');
const sidebarPanel    = document.getElementById('sidebar-panel');

function getPanels() {
  return new Map(FACES.map((f) => [f.key, document.querySelector(`[data-face="${f.key}"]`)]));
}

// ============================================
// Estado global del cubo
// ============================================

const state = {
  faceIndex: 0,
  targetQ:   new THREE.Quaternion(),
  isDragging: false,
  dragStart:  { x: 0, y: 0 },
  cube:       null,
};

// ============================================
// Sistema de modos de vista
// ============================================

const viewState = {
  current: localStorage.getItem('view-mode') || 'float',
};

function applyViewMode(mode) {
  viewState.current = mode;
  localStorage.setItem('view-mode', mode);
  document.documentElement.dataset.viewMode = mode;

  document.querySelectorAll('.hud-btn--mode').forEach((btn) => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (mode === 'sidebar') {
    mountSidebarPanel();
  } else {
    unmountSidebarPanel();
  }

  if (mode !== 'card') closeModal();

  const cardPreview = document.getElementById('card-preview');
  if (cardPreview) cardPreview.hidden = (mode !== 'card');

  doResize();
}

function mountSidebarPanel() {
  if (!sidebarPanel) return;
  sidebarPanel.hidden = false;
  const activeKey   = FACES[state.faceIndex]?.key;
  const activePanel = activeKey ? document.querySelector(`[data-face="${activeKey}"]`) : null;
  if (activePanel && !sidebarPanel.contains(activePanel)) {
    sidebarPanel.appendChild(activePanel);
  }
}

function unmountSidebarPanel() {
  if (!sidebarPanel || !panelsContainer) return;
  sidebarPanel.querySelectorAll('.face-content').forEach((p) => panelsContainer.appendChild(p));
  sidebarPanel.hidden = true;
}

// ============================================
// Modal (modo card)
// ============================================

let _lastFocused = null;

function openModal(faceKey) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;
  const panel = document.querySelector(`[data-face="${faceKey}"]`);
  if (!panel) return;
  content.innerHTML = panel.innerHTML;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  _lastFocused = document.activeElement;
  const closeBtn = document.getElementById('btn-close-modal');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  if (_lastFocused) { _lastFocused.focus(); _lastFocused = null; }
}

// ============================================
// Inicialización
// ============================================

if (!webglAvailable()) {
  wrap.hidden = true;
  fallback.hidden = false;
} else {
  startScene();
  initControls();
  applyViewMode(viewState.current);
}

// ============================================
// Escena Three.js
// ============================================

let _rendererRef = null;
let _cameraRef   = null;

function startScene() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  _rendererRef = renderer;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 8.2);
  _cameraRef = camera;

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  const keyL    = new THREE.DirectionalLight(0xffffff, 1.0);
  keyL.position.set(5, 6, 4);
  const rim = new THREE.DirectionalLight(0x77aaff, 0.45);
  rim.position.set(-4, -2, -6);
  scene.add(ambient, keyL, rim);

  const geom = new THREE.BoxGeometry(4.8, 4.8, 4.8);
  const mats = [
    makeFaceMat(0x89b8ff), makeFaceMat(0x6a95ea), makeFaceMat(0x467bcf),
    makeFaceMat(0x5d8be0), makeFaceMat(0x80abf5), makeFaceMat(0x355ea8),
  ];
  const cube = new THREE.Mesh(geom, mats);
  scene.add(cube);
  state.cube = cube;

  setFace(0, true);

  canvas.addEventListener('pointerdown', (e) => {
    state.isDragging = true;
    state.dragStart.x = e.clientX;
    state.dragStart.y = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    const dx = e.clientX - state.dragStart.x;
    const dy = e.clientY - state.dragStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      rotateBy(dx < 0 ? +1 : -1, 0);
    } else {
      rotateBy(0, dy < 0 ? +1 : -1);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  rotateBy(-1, 0);
    if (e.key === 'ArrowRight') rotateBy(+1, 0);
    if (e.key === 'ArrowUp')    rotateBy(0, +1);
    if (e.key === 'ArrowDown')  rotateBy(0, -1);
    if (e.key === 'Escape')     closeModal();
  });

  window.addEventListener('hashchange', () => {
    const idx = FACES.findIndex((f) => f.hash === location.hash);
    if (idx >= 0) setFace(idx);
  });

  window.addEventListener('resize', doResize);
  doResize();

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    cube.quaternion.slerp(state.targetQ, Math.min(1, dt * 5.8));
    renderer.render(scene, camera);
  })();
}

function doResize() {
  if (!_rendererRef || !_cameraRef) return;
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  if (w === 0 || h === 0) return;
  _rendererRef.setSize(w, h, false);
  _cameraRef.aspect = w / h;
  _cameraRef.updateProjectionMatrix();
}

// ============================================
// Navegación del cubo
// ============================================

function rotateBy(dxFaces, dyFaces) {
  if (dyFaces !== 0) {
    const top = dyFaces > 0 ? 'testimonios' : 'contacto';
    setFace(FACES.findIndex((f) => f.key === top));
    return;
  }
  let next = state.faceIndex + dxFaces;
  if (next < 0) next = FACES.length - 1;
  if (next >= FACES.length) next = 0;
  setFace(next);
}

function setFace(index, immediate = false) {
  state.faceIndex = index;
  const face = FACES[index];

  const e = new THREE.Euler(face.euler[0], face.euler[1], face.euler[2], 'YXZ');
  state.targetQ.setFromEuler(e);
  if (immediate && state.cube) state.cube.quaternion.copy(state.targetQ);

  const labelEl = document.getElementById('active-face-label');
  const countEl = document.getElementById('active-face-index');
  if (labelEl) labelEl.textContent = face.label;
  if (countEl) countEl.textContent = `${index + 1} / ${FACES.length}`;

  const panels = getPanels();
  panels.forEach((el, key) => {
    if (!el) return;
    el.classList.toggle('active', key === face.key);
  });

  // Modo sidebar: mover panel activo al sidebar
  if (viewState.current === 'sidebar' && sidebarPanel) {
    sidebarPanel.querySelectorAll('.face-content').forEach((p) => panelsContainer?.appendChild(p));
    const activePanel = document.querySelector(`[data-face="${face.key}"]`);
    if (activePanel) sidebarPanel.appendChild(activePanel);
  }

  // Modo card: asegurar que el botón de expandir está visible
  if (viewState.current === 'card') {
    const cardPreview = document.getElementById('card-preview');
    if (cardPreview) cardPreview.hidden = false;
  }

  history.replaceState(null, '', face.hash);

  // Notificar a portfolio-content.js
  window.dispatchEvent(new CustomEvent('face:changed', {
    detail: { key: face.key, label: face.label, index },
  }));
}

// ============================================
// Controles: modos, tema, modal, navegación interna
// ============================================

function initControls() {
  // Botones de modo de vista
  document.querySelectorAll('.hud-btn--mode').forEach((btn) => {
    btn.addEventListener('click', () => applyViewMode(btn.dataset.mode));
  });

  // Botón de tema
  const btnTheme = document.getElementById('btn-theme');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const html = document.documentElement;
      const next = (html.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark';
      html.dataset.theme = next;
      localStorage.setItem('theme', next);
      window.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme: next } }));
    });
  }

  // Modal: abrir / cerrar
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-expand-card')) openModal(FACES[state.faceIndex].key);
    if (e.target.closest('#btn-close-modal'))  closeModal();
    if (e.target.id === 'modal-overlay')        closeModal();
  });

  // Navegación interna de paneles (botones .js-nav-face)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-nav-face');
    if (!btn) return;
    const idx = FACES.findIndex((f) => f.key === btn.dataset.faceKey);
    if (idx >= 0) setFace(idx);
  });

  // Leer tema guardado en localStorage
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'dark';
}

// ============================================
// Helpers
// ============================================

function makeFaceMat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.04,
    emissive: 0x0b1020,
    emissiveIntensity: 0.12,
  });
}

function webglAvailable() {
  try {
    const test = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (test.getContext('webgl') || test.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}
