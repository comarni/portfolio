// portfolio-content.js — ES module
// Cursor cubo 3D, catálogo de proyectos, validación de formulario, tema dark/light

import * as THREE from 'three';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ============================================
// 1. Catálogo de proyectos
// ============================================

const projectCatalog = [
  {
    category: 'Proyectos Web / Negocios Locales',
    projects: [
      { name: 'ElRinconDeMamaInes', repo: 'https://github.com/comarni/ElRinconDeMamaInes', description: 'Web para una pastelería y repostería en Alcobendas, orientada a presencia de negocio local con estructura clara en HTML.', tools: ['HTML', 'CSS', 'Diseño para negocio local'] },
      { name: 'PinPanPun',          repo: 'https://github.com/comarni/PinPanPun',          description: 'Web para otra pastelería en Alcobendas, enfocada en práctica de diseño CSS para hostelería.',                        tools: ['HTML', 'CSS', 'Diseño gastronómico'] },
      { name: 'DreamsCoffee',       repo: 'https://github.com/comarni/DreamsCoffee',       description: 'Sitio para cafetería en Alcobendas con trabajo de marca visual y presentación de producto.',                         tools: ['HTML', 'CSS', 'Branding UI'] },
      { name: 'de-Melani',          repo: 'https://github.com/comarni/de-Melani',          description: 'Sitio web para peluquería en Alcobendas con foco en diseño web para el sector estética.',                           tools: ['HTML', 'CSS', 'Diseño de servicios'] },
      { name: 'pikolin',             repo: 'https://github.com/comarni/pikolin',             description: 'Landing page para colchonería en Alcobendas orientada a producto y captación local.',                               tools: ['HTML', 'CSS', 'Landing page'] },
      { name: 'pasteleriaBalaguer',  repo: 'https://github.com/comarni/pasteleriaBalaguer',  description: 'Sitio para pastelería local con estructura sencilla para presentación de catálogo.',                               tools: ['HTML', 'CSS', 'Estructura web básica'] },
    ],
  },
  {
    category: 'Proyectos de Producto / SaaS',
    projects: [
      { name: 'VoiceHub',           repo: 'https://github.com/comarni/VoiceHub',           description: 'SaaS de procesado de audio con IA: transcripción, separación de pistas y efectos en tiempo real. API REST con Fastify y TypeScript, autenticación JWT, pagos recurrentes con Stripe, cola de trabajos con Bull/Redis, almacenamiento en AWS S3 e inferencia IA via Replicate. Frontend en React 18 con TanStack Query y Zustand.', tools: ['TypeScript', 'Fastify', 'React 18', 'Prisma', 'PostgreSQL', 'Redis', 'Stripe', 'AWS S3', 'Docker', 'Replicate AI'] },
      { name: 'LanhHub',            repo: 'https://github.com/comarni/LanhHub',            description: 'Plataforma de aprendizaje de idiomas con IA estilo Duolingo y enfoque social.',                                    tools: ['Docker', 'Backend', 'IA conversacional', 'Full stack'] },
      { name: 'Komarn.IA',          repo: 'https://github.com/comarni/Komarn.IA',          description: 'Landing de agencia IA centrada en presentación de servicios y captación de clientes.',                             tools: ['HTML', 'CSS', 'Copy comercial'] },
      { name: 'TypeHub',            repo: 'https://github.com/comarni/TypeHub',            live: 'https://comarni.github.io/TypeHub/',   description: 'App de mecanografía tipo Monkeytype con eventos de teclado y métricas en tiempo real.',                         tools: ['JavaScript', 'HTML', 'CSS', 'Lógica interactiva'] },
      { name: 'CarHub',             repo: 'https://github.com/comarni/CarHub',             description: 'Plataforma de compraventa de coches con listados, filtros y flujo tipo e-commerce.',                               tools: ['JavaScript', 'HTML', 'CSS', 'Filtros dinámicos'] },
      { name: 'webhub',             repo: 'https://github.com/comarni/webhub',             live: 'https://comarni.github.io/webhub/',    description: 'Portal hub con automatizaciones, feeds, bots y cambio de tema.',                                                  tools: ['HTML', 'CSS', 'JavaScript', 'Arquitectura de portal'] },
      { name: 'DisasterSim-Analytics.', repo: 'https://github.com/comarni/DisasterSim-Analytics.', description: 'Herramienta de simulación y análisis de desastres orientada a visualización de datos.',                    tools: ['HTML', 'JavaScript', 'Data viz'] },
    ],
  },
  {
    category: 'Herramientas y Utilidades',
    projects: [
      { name: 'generador-gradiente-css', repo: 'https://github.com/comarni/generador-gradiente-css', description: 'Generador interactivo de gradientes CSS con presets y modo oscuro/claro.',                                    tools: ['HTML', 'CSS', 'JavaScript', 'UI interactiva'] },
      { name: 'conversor-de-texto',      repo: 'https://github.com/comarni/conversor-de-texto',      description: 'Conversor de texto online para cambios rápidos de formato y limpieza.',                                        tools: ['HTML', 'CSS', 'JavaScript', 'Manipulación de strings'] },
      { name: 'Conversor-de-divisas',    repo: 'https://github.com/comarni/Conversor-de-divisas',    live: 'https://comarni.github.io/Conversor-de-divisas/', description: 'Conversor de divisas en tiempo real con API de Frankfurter y gráficos Chart.js.', tools: ['JavaScript asíncrono', 'API REST', 'Chart.js', 'HTML/CSS'] },
      { name: 'ruleta3D',                repo: 'https://github.com/comarni/ruleta3D',                description: 'Ruleta 3D interactiva enfocada en animación y eventos en navegador.',                                          tools: ['JavaScript', 'Animación', 'Geometría 3D'] },
    ],
  },
  {
    category: '3D / Gráficos',
    projects: [
      { name: 'threejs-prueba', repo: 'https://github.com/comarni/threejs-prueba', live: 'https://comarni.github.io/threejs-prueba/', description: 'Demo de Three.js con cubo 3D interactivo sin frameworks ni bundlers, publicado en GitHub Pages.', tools: ['Three.js', 'WebGL', 'JavaScript Vanilla', 'GitHub Pages'] },
    ],
  },
  {
    category: 'Portfolio y Presentación Personal',
    projects: [
      { name: 'portfolio', repo: 'https://github.com/comarni/portfolio', live: 'https://comarni.github.io/portfolio/', description: 'Portafolio personal con sitemap, robots.txt y páginas legales para presencia profesional.', tools: ['HTML', 'CSS', 'JavaScript', 'SEO técnico'] },
      { name: 'Ignite',    repo: 'https://github.com/comarni/Ignite',    description: 'Landing page moderna orientada a práctica de diseño y estructura de conversión.',                                                          tools: ['HTML', 'CSS', 'Diseño visual'] },
    ],
  },
  {
    category: 'Sector Automoción',
    projects: [
      { name: 'bmw-showcase-site', repo: 'https://github.com/comarni/bmw-showcase-site', description: 'Web corporativa de BMW responsive con historia de marca y catálogo de vehículos.', tools: ['HTML', 'CSS', 'Diseño corporativo responsive'] },
    ],
  },
];

function getRepoSlug(repoUrl) {
  return repoUrl.replace('https://github.com/', '').replace(/\/$/, '');
}

function getRepoPreview(repoUrl) {
  return `https://opengraph.githubassets.com/1/${getRepoSlug(repoUrl)}`;
}

function getLivePreview(liveUrl) {
  return `https://image.thum.io/get/width/1200/noanimate/${encodeURIComponent(liveUrl)}`;
}

function getInlineFallbackPreview(projectName) {
  const safeName = (projectName || 'Proyecto').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1f2f"/><stop offset="52%" stop-color="#15273d"/><stop offset="100%" stop-color="#2a170f"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1020" cy="120" r="180" fill="rgba(255,140,0,0.16)"/><circle cx="170" cy="600" r="220" fill="rgba(79,140,255,0.18)"/><text x="90" y="520" fill="#f8fafc" font-size="58" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${safeName}</text><text x="92" y="568" fill="#ffb347" font-size="26" font-family="Segoe UI, Arial, sans-serif">Preview no disponible</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function wirePreviewFallbacks(scope) {
  scope.querySelectorAll('.js-project-preview').forEach((img) => {
    const fallbackRepo   = img.getAttribute('data-fallback-repo');
    const fallbackInline = img.getAttribute('data-fallback-inline');
    img.addEventListener('error', () => {
      const current = img.getAttribute('src') || '';
      if (fallbackRepo && current !== fallbackRepo) { img.setAttribute('src', fallbackRepo); return; }
      if (fallbackInline && current !== fallbackInline) img.setAttribute('src', fallbackInline);
    }, { once: false });
  });
}

function renderProjectCatalog() {
  const container = document.getElementById('projectCategories');
  if (!container) return;

  container.innerHTML = projectCatalog.map((group) => {
    const cards = group.projects.map((project) => {
      const tools         = project.tools.map((t) => `<span class="tech-tag">${t}</span>`).join('');
      const repoPreview   = getRepoPreview(project.repo);
      const inlineFallback = getInlineFallbackPreview(project.name);
      const primaryPreview = project.live ? getLivePreview(project.live) : repoPreview;
      const liveButton     = project.live
        ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Ver preview</a>`
        : '<span class="btn btn-muted" aria-disabled="true">Sin preview publicada</span>';
      const previewLabel = project.live ? 'Web preview' : 'Repo preview';

      return `
        <article class="project-card">
          <div class="project-preview-frame-wrap" data-preview-label="${previewLabel}" aria-hidden="true">
            <img
              class="project-preview-image js-project-preview"
              src="${primaryPreview}"
              data-fallback-repo="${repoPreview}"
              data-fallback-inline="${inlineFallback}"
              alt="Previsualización de ${project.name}"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer" />
          </div>
          <div class="project-content">
            <div class="project-headline">
              <span class="project-badge">${group.category}</span>
              <h3 class="project-title">${project.name}</h3>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${tools}</div>
            <div class="project-links">
              <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Repositorio</a>
              ${liveButton}
            </div>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="project-category" aria-label="${group.category}">
        <header class="project-category-header">
          <h3 class="project-category-title">${group.category}</h3>
          <span class="project-category-count">${group.projects.length} proyectos</span>
        </header>
        <div class="project-grid-category">${cards}</div>
      </section>
    `;
  }).join('');

  wirePreviewFallbacks(container);

  // IntersectionObserver para reveal de project-cards dentro del panel
  const panelProyectos = document.getElementById('panel-proyectos');
  if (typeof IntersectionObserver !== 'undefined' && panelProyectos) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          obs.unobserve(entry.target);
        }
      });
    }, { root: panelProyectos, threshold: 0.05 });

    container.querySelectorAll('.project-card').forEach((el) => obs.observe(el));
  } else {
    container.querySelectorAll('.project-card').forEach((el) => el.classList.add('animated'));
  }
}

renderProjectCatalog();

// IntersectionObserver para skill-pills y testimonial-cards
(function initRevealObserver() {
  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.skill-pill, .testimonial-card, .skills-category').forEach((el) => el.classList.add('animated'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.skill-pill, .testimonial-card, .skills-category').forEach((el) => obs.observe(el));
})();

// ============================================
// 2. Chip interact → pulso visual en el cubo
// ============================================

document.querySelectorAll('.highlight-chip').forEach((chip) => {
  chip.addEventListener('mouseenter', () => {
    window.dispatchEvent(new CustomEvent('cube:interact'));
  });
});

// ============================================
// 3. Validación del formulario de contacto
// ============================================

function addListenerIfExists(el, event, handler, opts) {
  if (el) el.addEventListener(event, handler, opts);
}

function setFieldState(field, errorEl, errorText) {
  if (!field || !errorEl) return;
  const hasError = Boolean(errorText);
  field.setAttribute('aria-invalid', String(hasError));
  errorEl.textContent = errorText;
  errorEl.classList.toggle('show', hasError);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateField(field, errorEl, rules) {
  if (!field || !errorEl) return true;
  const value = field.value.trim();
  let errorText = '';
  if (rules.required && !value) {
    errorText = 'Este campo es obligatorio';
  } else if (rules.email && !isValidEmail(value)) {
    errorText = 'Por favor ingresa un email válido';
  } else if (rules.minLength && value.length < rules.minLength) {
    errorText = `Mínimo ${rules.minLength} caracteres`;
  }
  setFieldState(field, errorEl, errorText);
  return errorText === '';
}

(function initContactForm() {
  const form          = document.getElementById('contactForm');
  const nombreInput   = document.getElementById('nombre');
  const emailInput    = document.getElementById('email');
  const mensajeInput  = document.getElementById('mensaje');
  const nombreError   = document.getElementById('nombreError');
  const emailError    = document.getElementById('emailError');
  const mensajeError  = document.getElementById('mensajeError');
  const formMessage   = document.getElementById('formMessage');

  const fields = [
    { input: nombreInput,  error: nombreError,  rules: { required: true, minLength: 2 } },
    { input: emailInput,   error: emailError,   rules: { required: true, email: true } },
    { input: mensajeInput, error: mensajeError, rules: { required: true, minLength: 10 } },
  ];

  fields.forEach(({ input, error, rules }) => {
    addListenerIfExists(input, 'blur',  () => validateField(input, error, rules));
    addListenerIfExists(input, 'input', () => setFieldState(input, error, ''));
  });

  addListenerIfExists(form, 'submit', (e) => {
    e.preventDefault();
    const valid = fields.every(({ input, error, rules }) => validateField(input, error, rules));
    if (valid && formMessage) {
      formMessage.textContent = '¡Mensaje enviado correctamente! Te responderé pronto.';
      formMessage.className = 'form-message success';
      form.reset();
      fields.forEach(({ input, error }) => setFieldState(input, error, ''));
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 4500);
    } else if (formMessage) {
      formMessage.textContent = 'Por favor completa todos los campos correctamente.';
      formMessage.className = 'form-message error';
      const first = fields.find(({ input, error, rules }) => !validateField(input, error, rules));
      if (first?.input) first.input.focus();
    }
  });
})();

// ============================================
// 4. Cursor cubo 3D
// ============================================

function initCursorCube() {
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  if (prefersReducedMotion.matches) return null;

  const canvas = document.getElementById('cursorCube');
  if (!canvas) return null;

  const SIZE = 54;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.set(0, 0, 3.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(SIZE, SIZE, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const pointLight = new THREE.PointLight(0x4f8cff, 1.8, 10);
  pointLight.position.set(2, 2, 3);
  scene.add(pointLight);

  const geo     = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const mat     = new THREE.MeshPhysicalMaterial({ color: 0x2ec4b6, roughness: 0.25, metalness: 0.35, clearcoat: 0.6, emissive: 0x2ec4b6, emissiveIntensity: 0.3 });
  const wireGeo = new THREE.WireframeGeometry(geo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
  const mesh    = new THREE.Mesh(geo, mat);
  const wire    = new THREE.LineSegments(wireGeo, wireMat);

  const group = new THREE.Group();
  group.add(mesh, wire);
  scene.add(group);

  const colorMap = {
    'inicio':      0x2ec4b6,
    'proyectos':   0x4f8cff,
    'habilidades': 0xf59e0b,
    'sobre-mi':    0x10b981,
    'testimonios': 0xa78bfa,
    'contacto':    0xef4444,
  };

  const cs = {
    mouseX: -999, mouseY: -999,
    lerpX: -999,  lerpY: -999,
    velX: 0, velY: 0,
    prevX: 0, prevY: 0,
    rotX: 0, rotY: 0,
    hoverStrength: 0, hoverTarget: 0,
    clickPulse: 0, clickTarget: 0,
    scaleX: 1, scaleY: 1, scaleZ: 1,
    emissiveCurrent: 0x2ec4b6,
    emissiveTarget:  0x2ec4b6,
    visible: false,
    rafId: 0,
  };

  const INTERACTIVE = 'a, button, .btn, .hud-btn, .highlight-chip, .social-link, label, input, textarea, .project-card';

  document.addEventListener('mousemove', (e) => {
    cs.velX   = e.clientX - cs.prevX;
    cs.velY   = e.clientY - cs.prevY;
    cs.prevX  = e.clientX;
    cs.prevY  = e.clientY;
    cs.mouseX = e.clientX;
    cs.mouseY = e.clientY;
    if (!cs.visible) {
      cs.lerpX = e.clientX;
      cs.lerpY = e.clientY;
      cs.visible = true;
      canvas.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE)) cs.hoverTarget = 1;
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTIVE)) cs.hoverTarget = 0;
  });
  document.addEventListener('mousedown', () => {
    cs.clickTarget = 1;
    setTimeout(() => { cs.clickTarget = 0; }, 140);
  });

  // Sincronizar color con la cara activa del cubo navegador
  window.addEventListener('face:changed', (e) => {
    const id = e.detail?.key;
    if (id && colorMap[id]) {
      cs.emissiveTarget = colorMap[id];
    }
  });

  window.addEventListener('theme:changed', (e) => {
    mat.color.setHex(e.detail.theme === 'light' ? 0x2563eb : 0x2ec4b6);
  });

  function lerpColor(current, target, t) {
    const cr = (current >> 16) & 0xff, cg = (current >> 8) & 0xff, cb = current & 0xff;
    const tr = (target  >> 16) & 0xff, tg = (target  >> 8) & 0xff, tb = target  & 0xff;
    return (Math.round(cr + (tr - cr) * t) << 16) | (Math.round(cg + (tg - cg) * t) << 8) | Math.round(cb + (tb - cb) * t);
  }

  function animate() {
    cs.lerpX += (cs.mouseX - cs.lerpX) * 0.14;
    cs.lerpY += (cs.mouseY - cs.lerpY) * 0.14;
    canvas.style.left = cs.lerpX + 'px';
    canvas.style.top  = cs.lerpY + 'px';

    cs.rotY += cs.velX * 0.022 + 0.008;
    cs.rotX += cs.velY * 0.016 + 0.003;
    cs.velX *= 0.82;
    cs.velY *= 0.82;
    group.rotation.y = cs.rotY;
    group.rotation.x = cs.rotX;

    cs.hoverStrength += (cs.hoverTarget  - cs.hoverStrength)  * 0.12;
    cs.clickPulse    += (cs.clickTarget  - cs.clickPulse)     * 0.22;

    const hoverScale = 1 + cs.hoverStrength * 0.28;
    const squashY    = hoverScale - cs.clickPulse  * 0.38;
    const stretchXZ  = hoverScale + cs.clickPulse  * 0.22;
    cs.scaleX += (stretchXZ - cs.scaleX) * 0.14;
    cs.scaleY += (squashY   - cs.scaleY) * 0.14;
    cs.scaleZ += (stretchXZ - cs.scaleZ) * 0.14;
    group.scale.set(cs.scaleX, cs.scaleY, cs.scaleZ);

    cs.emissiveCurrent = lerpColor(cs.emissiveCurrent, cs.emissiveTarget, 0.06);
    mat.emissive.setHex(cs.emissiveCurrent);
    mat.emissiveIntensity = 0.30 + cs.hoverStrength * 0.25 + cs.clickPulse * 0.40;
    pointLight.color.setHex(cs.emissiveCurrent);

    renderer.render(scene, camera);
    cs.rafId = requestAnimationFrame(animate);
  }

  animate();

  // Aplicar tema inicial
  const theme = document.documentElement.dataset.theme || 'dark';
  mat.color.setHex(theme === 'light' ? 0x2563eb : 0x2ec4b6);

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(cs.rafId);
    geo.dispose(); mat.dispose();
    wireGeo.dispose(); wireMat.dispose();
    renderer.dispose();
  });

  return cs;
}

initCursorCube();

// ============================================
// 5. Typewriter para el hero
// ============================================

(function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const fullText = el.textContent.trim();
  if (prefersReducedMotion.matches) { el.classList.add('typing-done'); return; }
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += fullText.charAt(i);
    i++;
    if (i >= fullText.length) { clearInterval(timer); el.classList.add('typing-done'); }
  }, 80);
})();

// ============================================
// 6. Tipografía base en inputs (iOS fix)
// ============================================

document.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('focus', () => {
    document.documentElement.style.fontSize = '16px';
  });
});
