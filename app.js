(() => {
  const DATA = window.CERVANTES_DATA;
  const root = document.getElementById('app');

  const esc = (v='') => String(v).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const list = items => `<ul class="list">${(items||[]).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const tags = items => `<div class="tag-list">${(items||[]).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>`;
  const getSlug = () => decodeURIComponent(location.hash.replace(/^#\/?/, '').split('?')[0]);
  const career = slug => DATA.careers.find(c => c.slug === slug);

  function home(){
    document.title = 'Institución Cervantes — Información de Carreras';
    root.innerHTML = `
      <div class="shell">
        <header class="hero">
          <div class="logo-wrap"><img src="https://i.ibb.co/4nqvFQGM/logo.png" alt="Cervantes"></div>
          <h1>Cervantes</h1>
          <p>Información comercial + datos oficiales de cada carrera, reunidos en un solo lugar para consultar y vender mejor.</p>
          <span class="eyebrow">Oferta académica · inicio ${esc(DATA.inicioGeneral)}</span>
        </header>
        <div class="update-banner">
          <span class="dot"></span><div><strong>Información oficial incorporada</strong><small>Landings de cervantes.edu.ar/carreras revisadas el ${esc(DATA.actualizado)}. Cada carrera incluye perfil, campo laboral, qué sabrás hacer, plan de estudios, articulaciones y requisitos.</small></div>
        </div>
        <div class="section-title"><h2>Nuestras carreras</h2><p>Ingresá a una carrera para ver toda la información comercial y oficial.</p></div>
        <main class="career-grid">
          ${DATA.careers.map(c=>`
            <article class="career-card" data-open="${esc(c.slug)}" style="--career:${esc(c.color)}" tabindex="0" role="button">
              <span class="badge">${esc(c.area)}</span><span class="arrow">→</span>
              <h3>${esc(c.nombre)}</h3><p>${esc(c.resumen)}</p>
              <div class="career-meta"><span>⏱ ${esc(c.duracion)}</span><span>🎓 ${esc(c.titulo)}</span><span>📍 ${esc(c.modalidad)}</span></div>
            </article>`).join('')}
        </main>
        <div class="section-title"><h2>Beneficios institucionales</h2><p>Aspectos que Cervantes destaca en su propuesta académica.</p></div>
        <section class="benefits-grid">
          ${DATA.beneficios.map((b,i)=>`<article class="glass benefit"><div class="emoji">${['🧑‍💼','🎥','💼','🎓','🤝','💙'][i]}</div><h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p></article>`).join('')}
        </section>
        <section class="glass compare-wrap">
          <div class="section-title" style="margin-top:0"><h2 style="font-size:1.7rem">Resumen comparativo</h2><p>Datos rápidos de las ocho propuestas.</p></div>
          <div class="table-scroll"><table class="compare"><thead><tr><th>Carrera</th><th>Duración publicada</th><th>Modalidad</th><th>Próximo inicio</th></tr></thead><tbody>
          ${DATA.careers.map(c=>`<tr><td class="career-link" data-open="${esc(c.slug)}">${esc(c.nombre)}</td><td>${esc(c.duracion)}</td><td>${esc(c.modalidad)}</td><td>${esc(c.official.inicio)}</td></tr>`).join('')}
          </tbody></table></div>
        </section>
        <section class="glass footer-card"><h3>Información de contacto</h3><p>Para fechas, aranceles, beneficios vigentes o cambios de modalidad, conviene validar siempre la cohorte puntual con Cervantes.</p><div class="contact-row"><span class="chip">📍 ${esc(DATA.contacto.direccion)}</span><span class="chip">☎ ${esc(DATA.contacto.telefono)}</span><span class="chip">✉ ${esc(DATA.contacto.email)}</span></div></section>
      </div>`;
    bindOpen(); window.scrollTo(0,0);
  }

  function detail(c){
    document.title = `${c.nombre} — Cervantes`;
    const certs = c.certificaciones?.length ? c.certificaciones.join(' · ') : 'Sin certificación intermedia publicada en la landing consultada';
    const continuity = c.official.continuidad?.length ? list(c.official.continuidad) : `<p class="muted">La landing oficial consultada no publica una articulación específica para esta carrera.</p>`;
    root.innerHTML = `<div class="shell detail">
      <button class="back" id="back">← Volver a carreras</button>
      <section class="detail-hero" style="--career:${esc(c.color)}">
        <div class="detail-topline"><span class="badge" style="--career:${esc(c.color)}">${esc(c.area)}</span><span class="source-status">● Información oficial revisada ${esc(DATA.actualizado)}</span></div>
        <h1>${esc(c.nombre)}</h1><p class="lead">${esc(c.resumen)}</p>
        <div class="stats"><div class="stat"><span class="label">Título</span><strong>${esc(c.titulo)}</strong></div><div class="stat"><span class="label">Duración</span><strong>${esc(c.duracion)}</strong></div><div class="stat"><span class="label">Modalidad</span><strong>${esc(c.modalidad)}</strong></div><div class="stat"><span class="label">Próximo inicio</span><strong>${esc(c.official.inicio)}</strong></div></div>
        ${c.duracionNota ? `<div class="note">⚠️ <strong>Aclaración de duración:</strong> ${esc(c.duracionNota)}</div>` : ''}
        <div class="actions"><button class="btn btn-green" id="copyWhatsapp">💬 Copiar mensaje para WhatsApp</button><a class="btn btn-primary" href="${esc(c.official.url)}" target="_blank" rel="noopener">↗ Ver landing oficial</a></div>
      </section>
      <nav class="anchor-nav"><a href="#perfil">Perfil</a><a href="#oficial">Información oficial</a><a href="#salida">Campo laboral</a><a href="#plan">Plan de estudios</a><a href="#continuidad">Continuidad</a><a href="#requisitos">Requisitos</a><a href="#venta">Enfoque comercial</a></nav>

      <section class="glass detail-section" id="perfil"><h2>Perfil comercial y contenidos clave</h2><p class="intro">La síntesis que ya usabas para identificar rápidamente a quién ofrecerle la carrera.</p><div class="info-grid"><div class="info-box"><h3>👤 Perfil del interesado</h3><p>${esc(c.perfilComercial)}</p></div><div class="info-box"><h3>🧠 Contenidos clave</h3>${tags(c.clavesComerciales)}</div></div></section>

      <section class="glass detail-section" id="oficial"><h2>Información oficial de Cervantes</h2><p class="intro">Resumen de la landing institucional, separado de los argumentos comerciales.</p><div class="info-grid"><div class="info-box"><h3>📘 Presentación de la carrera</h3><p>${esc(c.official.presentacion)}</p></div><div class="info-box"><h3>🎯 Perfil profesional</h3><p>${esc(c.official.perfil)}</p></div><div class="info-box"><h3>🏅 Certificaciones / títulos intermedios</h3><p>${esc(certs)}</p></div><div class="info-box"><h3>📅 Inicio publicado</h3><p>${esc(c.official.inicio)}. Las fechas y modalidades pueden actualizarse por cohorte.</p></div></div></section>

      <section class="glass detail-section" id="salida"><h2>Campo laboral y qué sabrás hacer</h2><p class="intro">Dos bloques especialmente útiles para responder “¿de qué puedo trabajar?” y “¿qué voy a aprender a hacer?”.</p><div class="info-grid"><div class="info-box"><h3>💼 Campo laboral</h3>${list(c.official.campo)}</div><div class="info-box"><h3>🛠 Competencias profesionales</h3>${list(c.official.competencias)}</div></div></section>

      <section class="glass detail-section" id="plan"><h2>Plan de estudios completo</h2><p class="intro">Materias publicadas por Cervantes, ordenadas por semestre. Tocá cada semestre para desplegarlo.</p><div class="plan">${c.official.plan.map((s,i)=>`<details class="semester" ${i===0?'open':''}><summary>${esc(s.semestre)} <span>${s.materias.length} materias</span></summary><ul>${s.materias.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></details>`).join('')}</div></section>

      <section class="glass detail-section" id="continuidad"><h2>Continuidad universitaria / articulaciones</h2><p class="intro">Opciones de continuidad que figuran en la información oficial consultada.</p>${continuity}</section>

      <section class="glass detail-section" id="requisitos"><h2>Requisitos de documentación</h2><p class="intro">Documentación general indicada por Cervantes para completar el legajo. El procedimiento y los plazos deben validarse al momento de la inscripción.</p><ol class="requirements">${DATA.requisitos.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></section>

      <section class="glass detail-section" id="venta"><h2>Enfoque comercial</h2><p class="intro">Se conservan separados los argumentos de venta para no confundirlos con información institucional.</p><div class="commercial-grid">${c.commercial.map(x=>`<article class="commercial-card"><h3>${esc(x.titulo)}</h3><p>${esc(x.texto)}</p></article>`).join('')}</div></section>

      <section class="glass detail-section"><div class="source-box"><div><strong>Fuente oficial</strong><p>Landing de ${esc(c.nombre)} · consultada el ${esc(DATA.actualizado)}.</p></div><a class="btn btn-primary" href="${esc(c.official.url)}" target="_blank" rel="noopener">Abrir en Cervantes ↗</a></div></section>
    </div>`;
    document.getElementById('back').onclick = () => { location.hash = ''; };
    document.getElementById('copyWhatsapp').onclick = () => copyWhatsapp(c);
    window.scrollTo(0,0);
  }

  function copyWhatsapp(c){
    const cert = c.certificaciones?.length ? `\n🏅 *Certificación:* ${c.certificaciones.join(' / ')}` : '';
    const msg = `Hola! 👋 Te paso información de *${c.nombre}* en Cervantes:\n\n🎓 *Título:* ${c.titulo}\n⏳ *Duración:* ${c.duracion}\n📍 *Modalidad:* ${c.modalidad}\n📅 *Próximo inicio:* ${c.official.inicio}${cert}\n\n💼 *¿De qué podés trabajar?*\n${c.official.campo.slice(0,4).map(x=>'• '+x).join('\n')}\n\n🛠 *¿Qué vas a aprender a hacer?*\n${c.official.competencias.slice(0,4).map(x=>'• '+x).join('\n')}\n\nSi querés, te paso también el plan de estudios completo y vemos la modalidad que mejor te quede 😊`;
    if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(msg).then(()=>showToast('Mensaje copiado para WhatsApp ✅')).catch(()=>fallbackCopy(msg)); }
    else fallbackCopy(msg);
  }
  function fallbackCopy(text){ const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();showToast('Mensaje copiado para WhatsApp ✅'); }
  function showToast(text){ let t=document.getElementById('toast');t.textContent=text;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200); }
  function bindOpen(){ document.querySelectorAll('[data-open]').forEach(el=>{ const open=()=>location.hash='/'+el.dataset.open; el.onclick=open; el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}}; }); }
  function route(){ const slug=getSlug(); const c=career(slug); if(!slug)home(); else if(c)detail(c); else { root.innerHTML=`<div class="shell empty"><h1>Carrera no encontrada</h1><p class="muted">Volvé al inicio para elegir una de las carreras disponibles.</p><button class="btn btn-primary" onclick="location.hash=''">Volver</button></div>`; } }
  window.addEventListener('hashchange',route); route();
})();
