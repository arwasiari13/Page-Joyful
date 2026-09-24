/* ============================================================================
   ★ CONFIGURATION — tout se modifie ici, et nulle part ailleurs ★
   ============================================================================ */

const invitation = {

  /* --- les mariés --- */
  groom:      "Taha",
  bride:      "Yasmine",
  familyName: "Bouchmal",          // la famille qui invite

  /* --- date & heure --- (format AAAA-MM-JJ et HH:MM, 24h) */
  date: "2026-10-17",
  time: "11:00",

  /* --- lieu --- */
  location:       "Salle des fêtes l'Alliance",
  locationAccent: "l'Alliance",     // cette partie est écrite en calligraphie
  city:           "Constantine, Algérie",

  /* --- lien --- */
  // Remplacez par le lien Google Maps exact de la salle
  mapsUrl:  "https://www.google.com/maps/search/?api=1&query=Salle+des+f%C3%AAtes+l%27Alliance+Constantine",

  /* --- textes --- */
  texts: {
    eyebrow:     "Save the date",
    heroSub:     "Nous vous invitons à célébrer notre mariage",
    invitation:  "serait honorée de votre présence à l'occasion du mariage de",
    note:        "Votre présence à nos côtés rendra ce jour plus lumineux encore. C'est avec le cœur plein de joie que nous vous accueillerons.",
    countdownDay:"C'est aujourd'hui !",   // affiché le jour J, à la place du décompte
    closing:     "Nous avons hâte de partager ce merveilleux moment avec vous",
    credit:      "Page Joyful"
  }
};

/* ============================================================================
   ▼ Rien à modifier en dessous de cette ligne ▼
   ============================================================================ */

(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- petit générateur pseudo-aléatoire déterministe (rendu stable) --- */
  function seeded(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const eventDate = new Date(invitation.date + "T" + invitation.time + ":00");

  /* ==========================================================================
     1. Injection du contenu
     ========================================================================== */
  function fmt(opts) {
    return new Intl.DateTimeFormat("fr-FR", opts).format(eventDate);
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  function fillContent() {
    const t = invitation.texts;

    document.title = invitation.groom + " & " + invitation.bride +
                     " — " + cap(fmt({ day: "numeric", month: "long", year: "numeric" }));

    $("#groom").textContent = invitation.groom;
    $("#bride").textContent = invitation.bride;
    $(".eyebrow").textContent = t.eyebrow;
    $("#heroDate").textContent = fmt({ day: "numeric", month: "long", year: "numeric" });
    $("#heroSub").textContent = t.heroSub;

    $("#familyName").textContent = invitation.familyName;
    $(".lede").innerHTML =
      "La famille <em>" + invitation.familyName + "</em> " + t.invitation;
    $("#ledeNames").innerHTML = invitation.groom +
      " <span class=\"amp\">&amp;</span> " + invitation.bride;
    $("#ledeNote").textContent = t.note;

    $("#dayName").textContent  = cap(fmt({ weekday: "long" }));
    $("#monthName").textContent = fmt({ month: "long" });
    $("#dayNum").textContent   = fmt({ day: "numeric" });
    $("#yearNum").textContent  = fmt({ year: "numeric" });
    $("#timeLabel").textContent = invitation.time.replace(":", "H");

    const acc = invitation.locationAccent;
    $("#venue").innerHTML = acc && invitation.location.includes(acc)
      ? invitation.location.replace(acc, "<em>" + acc + "</em>")
      : invitation.location;
    $("#city").textContent = invitation.city;

    $("#btnMap").href = invitation.mapsUrl;

    $("#closingText").textContent = t.closing;
    $("#closingSign").innerHTML = invitation.groom + " &amp; " + invitation.bride;
    $(".foot strong").textContent = t.credit;
  }

  /* ==========================================================================
     2. Végétation dessinée (feuillages, fleurs, glycines)
     ========================================================================== */
  const GREENS = ["#7D8F5E", "#93A473", "#688054", "#A7B78C", "#5F7348"];
  const BLOOMS = [
    ["#E9B7C4", "#D98FA4"], ["#C6B8E2", "#A896CE"],
    ["#FBF1F4", "#EAD3DB"], ["#DFA9BA", "#C4839A"]
  ];

  function el(name, attrs) {
    const n = document.createElementNS(SVGNS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function leaf(x, y, angle, size, fill, opacity) {
    return el("path", {
      d: "M0 0 C 5 -5.5, 13 -4.8, 18 0 C 13 4.8, 5 5.5, 0 0 Z",
      transform: "translate(" + x + " " + y + ") rotate(" + angle + ") scale(" + size + ")",
      fill: fill, opacity: opacity
    });
  }

  function blossom(g, x, y, r, pair, rnd) {
    const [petal, core] = pair;
    const flower = el("g", {
      transform: "translate(" + x + " " + y + ") rotate(" + (rnd() * 360) + ")"
    });
    for (let i = 0; i < 5; i++) {
      flower.appendChild(el("ellipse", {
        cx: 0, cy: -r * 0.78, rx: r * 0.46, ry: r * 0.82,
        transform: "rotate(" + (i * 72) + ")",
        fill: petal, opacity: 0.88
      }));
    }
    flower.appendChild(el("circle", { r: r * 0.28, fill: core, opacity: 0.9 }));
    g.appendChild(flower);
  }

  // grappe de glycine suspendue
  function wisteria(g, x, y, len, rnd) {
    const tone = rnd() > 0.5 ? "#C2B2DF" : "#D8C3E2";
    const n = Math.round(len / 7);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const w = (1 - t) * 4.6 + 1.2;
      g.appendChild(el("ellipse", {
        cx: x + Math.sin(i * 1.7) * (1 - t) * 5,
        cy: y + t * len,
        rx: w, ry: w * 1.25,
        fill: tone, opacity: 0.55 + rnd() * 0.3
      }));
    }
  }

  function growVine(group, d, opts) {
    const o = Object.assign({
      leaves: 26, flowers: 3, wist: 0, scale: 1, seed: 7, stem: 0.9, opacity: 1
    }, opts);
    const rnd = seeded(o.seed);

    const path = el("path", {
      d: d, fill: "none",
      stroke: GREENS[4], "stroke-width": o.stem,
      "stroke-linecap": "round", opacity: 0.65 * o.opacity
    });
    group.appendChild(path);

    let L = 0;
    try { L = path.getTotalLength(); } catch (e) { L = 0; }
    if (!L) return;

    const g = el("g", { opacity: o.opacity });
    group.appendChild(g);

    for (let i = 1; i <= o.leaves; i++) {
      const t = i / (o.leaves + 1);
      const p = path.getPointAtLength(L * t);
      const q = path.getPointAtLength(Math.min(L, L * t + 4));
      const tangent = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      const side = (i % 2 ? 1 : -1);
      const spread = 38 + rnd() * 34;
      const size = (0.55 + (1 - t) * 0.65 + rnd() * 0.25) * o.scale;
      g.appendChild(leaf(
        p.x, p.y, tangent + side * spread, size,
        GREENS[(i + o.seed) % GREENS.length],
        0.62 + rnd() * 0.33
      ));
    }

    for (let i = 0; i < o.flowers; i++) {
      const t = 0.15 + rnd() * 0.8;
      const p = path.getPointAtLength(L * t);
      blossom(g, p.x + (rnd() - 0.5) * 12, p.y + (rnd() - 0.5) * 12,
              (3.4 + rnd() * 3.6) * o.scale, BLOOMS[Math.floor(rnd() * BLOOMS.length)], rnd);
    }

    for (let i = 0; i < o.wist; i++) {
      const t = 0.2 + rnd() * 0.7;
      const p = path.getPointAtLength(L * t);
      wisteria(g, p.x, p.y, (26 + rnd() * 40) * o.scale, rnd);
    }
  }

  const TOP_VINES = [
    ["M-20,-12 C 90,20 40,90 130,150",      { seed: 3,  leaves: 30, flowers: 4, wist: 2, scale: 1.05 }],
    ["M120,-14 C 150,60 110,110 165,205",   { seed: 11, leaves: 24, flowers: 3, wist: 1, scale: .85 }],
    ["M250,-10 C 265,50 235,80 258,128",    { seed: 19, leaves: 16, flowers: 2, wist: 2, scale: .7  }],
    ["M420,-12 C 440,44 405,70 432,112",    { seed: 23, leaves: 14, flowers: 2, wist: 1, scale: .62 }],
    ["M560,-12 C 585,50 548,78 575,124",    { seed: 31, leaves: 15, flowers: 2, wist: 2, scale: .66 }],
    ["M735,-14 C 700,60 760,112 700,198",   { seed: 41, leaves: 24, flowers: 3, wist: 1, scale: .86 }],
    ["M1020,-12 C 910,24 960,92 870,152",   { seed: 47, leaves: 30, flowers: 4, wist: 2, scale: 1.05 }],
    ["M880,-10 C 845,44 885,70 850,104",    { seed: 53, leaves: 12, flowers: 1, wist: 1, scale: .58 }],
    ["M330,-10 C 318,36 344,58 326,92",     { seed: 59, leaves: 11, flowers: 1, wist: 1, scale: .52 }]
  ];

  const BOTTOM_VINES = [
    ["M-10,352 C 90,320 50,250 140,196",    { seed: 5,  leaves: 30, flowers: 5, scale: 1.05 }],
    ["M130,352 C 160,290 120,250 180,190",  { seed: 13, leaves: 22, flowers: 4, scale: .88 }],
    ["M275,352 C 290,306 262,278 288,238",  { seed: 17, leaves: 16, flowers: 3, scale: .72 }],
    ["M430,352 C 448,308 415,286 440,248",  { seed: 29, leaves: 14, flowers: 3, scale: .64 }],
    ["M580,352 C 600,306 566,282 592,240",  { seed: 37, leaves: 15, flowers: 3, scale: .68 }],
    ["M730,352 C 700,296 765,258 706,198",  { seed: 43, leaves: 23, flowers: 4, scale: .9  }],
    ["M1010,352 C 905,322 955,252 865,198", { seed: 61, leaves: 30, flowers: 5, scale: 1.05 }],
    ["M880,352 C 848,310 890,286 856,252",  { seed: 67, leaves: 12, flowers: 2, scale: .58 }],
    ["M355,352 C 342,316 368,296 350,264",  { seed: 71, leaves: 11, flowers: 2, scale: .54 }]
  ];

  function renderGarlands() {
    const top = $("#vines-top"), bottom = $("#vines-bottom");
    if (top)    TOP_VINES.forEach(v => growVine(top, v[0], v[1]));
    if (bottom) BOTTOM_VINES.forEach(v => growVine(bottom, v[0], v[1]));
  }

  /* --- petits rameaux séparateurs --- */
  function renderDividers() {
    ["#divider1", "#divider2", "#divider3"].forEach(function (sel, i) {
      const svg = $(sel);
      if (!svg) return;
      const g = el("g", {});
      svg.appendChild(g);
      growVine(g, "M120,20 C 96,20 74,13 44,20", { seed: 13 + i * 7, leaves: 9, flowers: 1, scale: .52, stem: .7 });
      growVine(g, "M120,20 C 144,20 166,27 196,20", { seed: 29 + i * 7, leaves: 9, flowers: 1, scale: .52, stem: .7 });
      g.appendChild(el("path", {
        d: "M120 12 L124 20 L120 28 L116 20 Z", fill: "#C6A75E", opacity: .85
      }));
    });
  }

  /* ==========================================================================
     3. Papillons
     ========================================================================== */
  const WING =
    '<g>' +
      '<path d="M50 43C45 21 32 5 19 7 7 9 3 25 11 34c8 9 26 11 39 11Z"/>' +
      '<path d="M50 47c-11 1-25 5-29 15-4 10 4 19 13 15 10-5 15-18 16-30Z" opacity=".92"/>' +
      '<circle cx="24" cy="22" r="4.4" fill="#FFFFFF" opacity=".34"/>' +
      '<circle cx="30" cy="61" r="3" fill="#FFFFFF" opacity=".28"/>' +
    '</g>';

  const BFLY_SVG =
    '<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="GID" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="C1"/><stop offset="1" stop-color="C2"/>' +
      '</linearGradient></defs>' +
      '<g fill="url(#GID)" stroke="C2" stroke-width="1.1" stroke-linejoin="round" opacity=".92">' +
        WING +
        '<g transform="translate(100 0) scale(-1 1)">' + WING + '</g>' +
      '</g>' +
      '<g stroke="#6F6154" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7">' +
        '<path d="M50 30c2.4 9 2.4 24 0 34-2.4-10-2.4-25 0-34Z" fill="#6F6154" stroke="none"/>' +
        '<path d="M51 31c3-7 8-11 14-13"/><path d="M49 31c-3-7-8-11-14-13"/>' +
      '</g>' +
    '</svg>';

  const BFLY_COLORS = [
    ["#E9A9BC", "#C97F93"], ["#C3B2E4", "#9C89C9"],
    ["#F0C3CE", "#DE9BB0"], ["#D2C4EC", "#B2A0DA"]
  ];

  function renderButterflies() {
    if (reduced) return;
    const host = $("#flutter");
    if (!host) return;
    const rnd = seeded(2026);
    const n = window.innerWidth < 700 ? 5 : 8;

    for (let i = 0; i < n; i++) {
      const c = BFLY_COLORS[i % BFLY_COLORS.length];
      const b = document.createElement("div");
      b.className = "bfly";
      b.style.setProperty("--w", (24 + rnd() * 22).toFixed(0) + "px");
      b.style.setProperty("--dur", (28 + rnd() * 26).toFixed(1) + "s");
      b.style.setProperty("--delay", (-rnd() * 34).toFixed(1) + "s");
      b.style.setProperty("--dx", ((rnd() * 26 - 13)).toFixed(1) + "vw");
      b.style.setProperty("--dy", ((rnd() * 60 - 34)).toFixed(1) + "vh");
      // on garde les papillons sur les marges, jamais devant le texte
      const leftSide = i % 2 === 0;
      b.style.left = (leftSide ? rnd() * 7 : 90 + rnd() * 7).toFixed(1) + "%";
      b.style.top  = (rnd() * 74 + 10).toFixed(1) + "%";
      b.innerHTML = BFLY_SVG
        .replace(/GID/g, "bf" + i)
        .replace("C1", c[0]).replace("C2", c[1]);
      const svg = b.querySelector("svg");
      svg.style.animationDuration = (2 + rnd() * 1.6).toFixed(2) + "s";
      host.appendChild(b);
    }
  }

  /* ==========================================================================
     4. Compte à rebours
     ========================================================================== */
  function startCountdown() {
    const D = $("#cdD"), H = $("#cdH"), M = $("#cdM"), S = $("#cdS");
    const pad = (v, n) => String(Math.max(0, v)).padStart(n, "0");

    function tick() {
      let diff = eventDate.getTime() - Date.now();
      if (diff <= 0) {
        D.textContent = "00"; H.textContent = M.textContent = S.textContent = "00";
        const msg = document.createElement("p");
        msg.className = "cd-msg in";
        msg.textContent = invitation.texts.countdownDay;
        $("#countdown").appendChild(msg);
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      D.textContent = pad(Math.floor(s / 86400), 2);
      H.textContent = pad(Math.floor(s / 3600) % 24, 2);
      M.textContent = pad(Math.floor(s / 60) % 60, 2);
      S.textContent = pad(s % 60, 2);
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ==========================================================================
     5. Apparitions au défilement
     ========================================================================== */
  function setupReveals() {
    const items = document.querySelectorAll(".reveal");

    items.forEach(function (n) {
      if (n.dataset.d) n.style.setProperty("--d", n.dataset.d);
    });

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(n => n.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (n, i) {
      // les éléments du héros s'animent immédiatement, en cascade
      if (n.closest(".hero")) { n.classList.add("in"); return; }
      // cascade locale à chaque section
      if (!n.dataset.d && !n.style.getPropertyValue("--d")) {
        const sibs = Array.from(n.parentElement.querySelectorAll(":scope > .reveal"));
        n.style.setProperty("--d", sibs.indexOf(n));
      }
      io.observe(n);
    });
  }

  /* ==========================================================================
     Démarrage
     ========================================================================== */
  function init() {
    fillContent();
    renderGarlands();
    renderDividers();
    renderButterflies();
    startCountdown();
    setupReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
