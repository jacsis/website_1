/* Shared behaviour for every page: header/footer, language, config values, animations, forms */
(function () {
  const PALETTE = ["#E8732A", "#F4A85C", "#F6CDB0", "#E9A597", "#7EA6DA", "#4B78B5", "#8A2D3B", "#F2B880"];
  const page = document.body.dataset.page || "home";

  /* ---------- header & footer ---------- */
  const links = [
    ["index.html", "home", "Home", "Home"],
    ["location.html", "location", "Luogo", "Location"],
    ["gifts.html", "gifts", "Regali", "Gifts"],
    ["rsvp.html", "rsvp", "RSVP", "RSVP"],
    ["photos.html", "photos", "Foto", "Photos"]
  ];
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="index.html">J &amp; S</a>
    <nav class="nav" id="nav">
      ${links.map(([href, id, it, en]) =>
        `<a href="${href}" ${id === page ? 'aria-current="page"' : ""}><span lang="it">${it}</span><span lang="en">${en}</span></a>`).join("")}
    </nav>
    <div style="display:flex;gap:.6rem;align-items:center">
      <div class="lang-toggle" role="group" aria-label="Language">
        <button data-set-lang="it">IT</button><button data-set-lang="en">EN</button>
      </div>
      <button class="menu-btn" aria-label="Menu" id="menuBtn">☰</button>
    </div>`;
  document.body.prepend(header);
  document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("nav").classList.toggle("open"));

  const footer = document.createElement("footer");
  footer.innerHTML = `<span class="brand">Jacopo &amp; Silvia</span>
    <span data-cfg="dateText"></span> · <span data-cfg="cityText"></span><br>
    <span lang="it">Con amore, non vediamo l'ora di festeggiare con voi</span>
    <span lang="en">With love — we can't wait to celebrate with you</span>`;
  document.body.append(footer);

  /* ---------- language ---------- */
  function setLang(lang) {
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-set-lang]").forEach(b => b.classList.toggle("active", b.dataset.setLang === lang));
    document.querySelectorAll("[data-ph-it]").forEach(el => el.placeholder = el.dataset["ph" + (lang === "it" ? "It" : "En")]);
    try { localStorage.setItem("lang", lang); } catch (e) {}
    fillConfig(lang);
  }
  document.querySelectorAll("[data-set-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.setLang)));

  /* ---------- fill values from config.js ---------- */
  function fillConfig(lang) {
    document.querySelectorAll("[data-cfg]").forEach(el => {
      const v = CONFIG[el.dataset.cfg];
      el.textContent = (v && typeof v === "object") ? v[lang] : (v || "");
    });
    document.querySelectorAll("[data-map]").forEach(el => {
      el.src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG[el.dataset.map]) + "&output=embed";
    });
    document.querySelectorAll("[data-directions]").forEach(el => {
      el.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG[el.dataset.directions]);
    });
    document.querySelectorAll("[data-mapslink]").forEach(el => {
      el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG[el.dataset.mapslink]);
    });
    document.querySelectorAll("[data-href]").forEach(el => {
      const url = CONFIG[el.dataset.href];
      if (url) el.href = url; else el.classList.add("hidden");
    });
  }

  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  setLang(saved || ((navigator.language || "it").startsWith("it") ? "it" : "en"));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.12 + "s"; io.observe(el); });

  /* ---------- inner pages: little flower sprigs beside the title ---------- */
  const head = document.querySelector(".page-head");
  if (head) {
    const sprig = side => `<svg class="sprig ${side}" viewBox="0 0 120 160" aria-hidden="true">
      <path d="M60 158 C 58 110, 40 80, 30 40" stroke="#8C9A6E" stroke-width="2" fill="none"/>
      <path d="M58 120 C 70 100, 85 90, 95 70" stroke="#8C9A6E" stroke-width="1.6" fill="none"/>
      <path d="M48 95 q 14 -6 18 -22 q -16 4 -18 22z" fill="#8C9A6E" opacity=".7"/>
      ${[[30, 36, 16, "#E8732A"], [95, 66, 12, "#F4A85C"], [52, 70, 9, "#E9A597"]].map(([x, y, r, c]) =>
        [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${x}" cy="${y - r * .55}" rx="${r * .42}" ry="${r * .62}" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join("") +
        `<circle cx="${x}" cy="${y}" r="${r * .28}" fill="#8A2D3B"/>`).join("")}
      ${[[18, 70], [26, 78], [14, 82], [22, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#7EA6DA"/>`).join("")}
    </svg>`;
    head.insertAdjacentHTML("afterbegin", sprig("l") + sprig("r"));
  }

  /* ---------- home: names letter animation ---------- */
  const names = document.querySelector(".names");
  if (names) {
    let i = 0;
    names.innerHTML = names.textContent.trim().split(" ").map(word =>
      `<span style="white-space:nowrap;display:inline-block">` + [...word].map(c =>
        `<span class="${c === "&" ? "ch amp" : "ch"}" style="animation-delay:${0.6 + (i++) * 0.09}s">${c}</span>`).join("") + `</span>`
    ).join(" ");
  }

  /* ---------- home: blooming flower arch (SVG) ---------- */
  const wreath = document.getElementById("wreath");
  if (wreath) buildWreath(wreath);

  function flower(cx, cy, r, color, centre, petals, delay, cls) {
    let s = `<g class="bloom ${cls || ""}" style="animation-delay:${delay}s"><g class="spin" style="animation-delay:${-delay * 2}s">`;
    for (let k = 0; k < petals; k++) {
      const a = (360 / petals) * k;
      s += `<ellipse cx="${cx}" cy="${cy - r * .55}" rx="${r * .42}" ry="${r * .62}" fill="${color}" opacity=".92" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${r * .28}" fill="${centre}"/></g></g>`;
    return s;
  }
  function hydrangea(cx, cy, r, delay) {
    let s = `<g class="bloom" style="animation-delay:${delay}s">`;
    for (let k = 0; k < 14; k++) {
      const a = k * 2.4, d = r * Math.sqrt(k / 14) * .9;
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const c = k % 3 ? "#7EA6DA" : "#9BBCE6";
      s += `<g transform="rotate(${k * 33} ${x} ${y})">
        ${[0, 90, 180, 270].map(t => `<ellipse cx="${x}" cy="${y - r * .14}" rx="${r * .12}" ry="${r * .16}" fill="${c}" transform="rotate(${t} ${x} ${y})"/>`).join("")}
        <circle cx="${x}" cy="${y}" r="${r * .04}" fill="#4B78B5"/></g>`;
    }
    return s + "</g>";
  }
  function leaf(x, y, rot, delay) {
    return `<path class="leaf" style="animation-delay:${delay}s" d="M${x} ${y} q 10 -14 0 -28 q -10 14 0 28z" fill="#8C9A6E" opacity=".75" transform="rotate(${rot} ${x} ${y})"/>`;
  }
  function buildWreath(svg) {
    const W = 560, H = 230, cx = W / 2, cy = 250, R = 220;
    let out = "";
    // arching stems
    out += `<path class="stem" d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}"/>`;
    out += `<path class="stem" style="animation-delay:.3s" d="M ${cx - R + 18} ${cy + 6} A ${R - 14} ${R - 22} 0 0 1 ${cx + R - 18} ${cy + 6}"/>`;
    const items = 15;
    for (let k = 0; k <= items; k++) {
      const t = Math.PI + (Math.PI * k) / items;
      const x = cx + Math.cos(t) * R, y = cy + Math.sin(t) * R;
      const d = 0.6 + Math.abs(k - items / 2) * -0.04 + 1.2 * (1 - Math.abs(k - items / 2) / (items / 2)) + Math.random() * .3;
      out += leaf(x + 10, y + 6, (t * 180 / Math.PI) + 60, d - .2);
      out += leaf(x - 10, y + 4, (t * 180 / Math.PI) - 40, d - .1);
      if (k % 4 === 1) out += hydrangea(x, y, 26, d);
      else {
        const col = PALETTE[[0, 1, 2, 3, 7, 0, 1][k % 7]];
        const centre = k % 5 === 0 ? "#8A2D3B" : "#C9562A";
        out += flower(x, y, 17 + (k % 3) * 5, col, centre, k % 2 ? 8 : 6, d);
      }
      if (k % 3 === 0) out += flower(x + 22 * Math.cos(t + 1), y + 14, 8, "#8A2D3B", "#5a1a24", 5, d + .3);
    }
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = out;
  }

  /* ---------- home: falling petals (canvas) ---------- */
  const canvas = document.getElementById("petals");
  if (canvas && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, petals = [];
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = (x, y, burst) => ({
      x: x ?? Math.random() * w, y: y ?? -20 - Math.random() * h,
      s: 6 + Math.random() * 9, c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      vy: burst ? -2 - Math.random() * 3 : .4 + Math.random() * .9,
      vx: burst ? (Math.random() - .5) * 6 : 0,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .04,
      sway: Math.random() * 6.28, life: burst ? 1 : null
    });
    resize(); addEventListener("resize", resize);
    const count = Math.min(55, Math.round(w / 22));
    for (let k = 0; k < count; k++) petals.push(make());

    // a click / tap anywhere on the hero throws a handful of petals
    document.querySelector(".hero").addEventListener("pointerdown", e => {
      const r = canvas.getBoundingClientRect();
      for (let k = 0; k < 22; k++) petals.push(make(e.clientX - r.left, e.clientY - r.top, true));
    });

    (function tick() {
      ctx.clearRect(0, 0, w, h);
      petals = petals.filter(p => !(p.life !== null && p.life <= 0));
      for (const p of petals) {
        p.sway += .015;
        if (p.life !== null) { p.vy += .08; p.vx *= .98; p.life -= .006; }
        p.y += p.vy; p.x += p.vx + Math.sin(p.sway) * .6; p.rot += p.vr;
        if (p.life === null && p.y > h + 20) { Object.assign(p, make(), { y: -20 }); }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = p.life !== null ? Math.max(p.life, 0) * .9 : .75;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(0, -p.s);
        ctx.bezierCurveTo(p.s * .9, -p.s * .6, p.s * .6, p.s * .7, 0, p.s);
        ctx.bezierCurveTo(-p.s * .6, p.s * .7, -p.s * .9, -p.s * .6, 0, -p.s);
        ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- home: countdown ---------- */
  const cd = document.getElementById("countdown");
  if (cd) {
    const target = new Date(CONFIG.weddingDate).getTime();
    const upd = () => {
      let diff = Math.max(0, target - Date.now()) / 1000;
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const hr = Math.floor(diff / 3600); diff -= hr * 3600;
      const m = Math.floor(diff / 60), s = Math.floor(diff - m * 60);
      cd.querySelector("[data-d]").textContent = d;
      cd.querySelector("[data-h]").textContent = String(hr).padStart(2, "0");
      cd.querySelector("[data-m]").textContent = String(m).padStart(2, "0");
      cd.querySelector("[data-s]").textContent = String(s).padStart(2, "0");
    };
    upd(); setInterval(upd, 1000);
  }

  /* ---------- gifts: copy IBAN ---------- */
  const copyBtn = document.getElementById("copyIban");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CONFIG.iban.replace(/\s/g, "")); } catch (e) {}
    copyBtn.querySelectorAll("[lang=it]")[0].textContent = "Copiato ✓";
    copyBtn.querySelectorAll("[lang=en]")[0].textContent = "Copied ✓";
  });

  /* ---------- photos: QR code ---------- */
  const qr = document.getElementById("qr");
  if (qr && window.QRCode) {
    new QRCode(qr, { text: CONFIG.photoUploadUrl, width: 180, height: 180, colorDark: "#8A2D3B", colorLight: "#ffffff" });
  }

  /* ---------- RSVP ---------- */
  const form = document.getElementById("rsvpForm");
  if (form) {
    const details = document.getElementById("attendingDetails");
    const allergyBox = document.getElementById("allergyBox");
    form.addEventListener("change", () => {
      const att = form.attending.value;
      details.classList.toggle("hidden", att !== "yes");
      allergyBox.classList.toggle("hidden", form.allergies.value !== "yes");
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const msg = document.getElementById("formMsg");
      const lang = document.body.dataset.lang;
      const fd = new FormData(form);
      const data = {};
      fd.forEach((v, k) => { data[k] = data[k] ? data[k] + ", " + v : v; });
      if (data.attending !== "yes") { delete data.guests; delete data.allergies; delete data.allergens; delete data.allergy_details; delete data.diet; }
      if (data.allergies !== "yes") { delete data.allergens; delete data.allergy_details; }

      const show = (ok, it, en) => { msg.className = "form-msg " + (ok ? "ok" : "err"); msg.textContent = lang === "it" ? it : en; };

      if (CONFIG.rsvpEndpoint) {
        try {
          const res = await fetch(CONFIG.rsvpEndpoint, {
            method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error();
          form.reset(); details.classList.add("hidden"); allergyBox.classList.add("hidden");
          show(true, "Grazie! La tua risposta è arrivata 💐", "Thank you! Your reply has been received 💐");
        } catch (err) {
          show(false, "Qualcosa è andato storto. Riprova o scrivici.", "Something went wrong. Please try again or write to us.");
        }
      } else {
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent("RSVP – " + (data.name || ""))}&body=${encodeURIComponent(body)}`;
        show(true, "Si aprirà la tua app di posta: premi invia per confermare.", "Your e-mail app will open: press send to confirm.");
      }
    });
  }
})();
