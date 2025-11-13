// --- Navegación entre secciones (solo si el enlace apunta a un id local)
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
  // Solo interceptamos enlaces que usan data-section (SPA) o href que empiece con '#'
  const href = link.getAttribute('href') || '';
  const isLocal = link.dataset && link.dataset.section;
  const isHash = href.startsWith('#');
  if (!isLocal && !isHash) return; // dejar la navegación normal para enlaces entre páginas

  link.addEventListener("click", e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.dataset.section || href.replace('#','');
    sections.forEach(section => {
      section.classList.remove("active");
      if (section.id === target) section.classList.add("active");
    });
    // movimiento suave
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({behavior: 'smooth'});
  });
});

// --- Formulario de contacto ---
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const confirmacion = document.getElementById("mensajeConfirmacion");

    if (nombre && email && mensaje) {
      // Simulación de envío
      confirmacion.textContent = `¡Gracias ${nombre}! Hemos recibido tu mensaje. Te responderemos pronto.`;
      confirmacion.style.color = "green";
      e.target.reset();
    } else {
      confirmacion.textContent = "Por favor completa todos los campos antes de enviar.";
      confirmacion.style.color = "red";
    }
  });
}

// --- Geolocalización: botón en inicio ---
const geoBtn = document.getElementById('geoBtn');
const geoStatus = document.getElementById('geoStatus');
if (geoBtn) {
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      geoStatus.textContent = 'Geolocalización no soportada por este navegador.';
      return;
    }
    geoStatus.textContent = 'Solicitando ubicación...';
    navigator.geolocation.getCurrentPosition(pos => {
      const {latitude, longitude, accuracy} = pos.coords;
      geoStatus.innerHTML = `Ubicación: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)} m). <a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}" target="_blank">Abrir en mapa</a>`;
    }, err => {
      if (err.code === 1) geoStatus.textContent = 'Permiso denegado. Permitir ubicación para usar esta función.';
      else geoStatus.textContent = 'No se pudo obtener la ubicación: ' + err.message;
    }, { enableHighAccuracy: true, timeout: 10000 });
  });
}

// --- Botones de "Obtener Plan" abren contacto y prefijan el mensaje ---
const planButtons = document.querySelectorAll('.open-plan');
planButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan || '';
    // Si estamos en una página con sección contacto, usarla; si no, navegar a contacto.html pasando el plan como query
    const contacto = document.getElementById('contacto');
    if (contacto) {
      sections.forEach(s => s.classList.remove('active'));
      contacto.classList.add('active');
      contacto.scrollIntoView({behavior: 'smooth'});
      const mensajeField = document.getElementById('mensaje');
      if (mensajeField) mensajeField.value = `Estoy interesado en el plan: ${plan}`;
      const nombreField = document.getElementById('nombre');
      if (nombreField) nombreField.focus();
    } else {
      // navegar a la página contacto con query string
      const url = new URL(window.location.href);
      const base = url.origin + url.pathname.replace(/[^/]*$/, 'contacto.html');
      window.location.href = `contacto.html?plan=${encodeURIComponent(plan)}`;
    }
  });
});

// Colocar año actual en el footer si existe
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// --- Prefill del formulario en la página contacto si viene ?plan=... ---
if (window.location.search) {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  if (plan) {
    const mensajeField = document.getElementById('mensaje');
    if (mensajeField && mensajeField.value.trim() === '') {
      mensajeField.value = `Estoy interesado en el plan: ${plan}`;
    }
  }
}
