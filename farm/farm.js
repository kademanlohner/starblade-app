/* Dragon Farm. Dragons are never removed. Stars only go up. Care never lowers a dragon. */
(function () {
  "use strict";
  var SPECIES = ["cinder", "ripple", "moss", "cloud", "pebble", "bloom"];
  var NAMES = { cinder: "Cinderling", ripple: "Ripplet", moss: "Mosslet", cloud: "Cloudlet", pebble: "Pebblet", bloom: "Bloomlet" };
  var STAGE = ["egg", "baby", "teen", "adult", "elder"];
  var GLOW = ["Ready for a treat", "Nibbling", "Comfy", "Bright", "Thriving", "Gleaming"];
  var LESSON = "Roots grow into the soil. Tiny root hairs take in water and minerals. The stem carries water up to the leaves. Leaves use sunlight, water, and air to make sugar. That is photosynthesis.";

  function C(id, name, part, line, needs, season, extra) {
    return { id: id, name: name, part: part, line: line, needs: needs, season: season, extra: extra };
  }
  var CROPS = {
    carrot: C("carrot", "Carrot", "root", "The orange part we eat is a root. It stores sugar the leaves made.", "Sun, water, and loose soil.", "Cool season.", "Your body can turn the orange color, beta-carotene, into vitamin A."),
    lettuce: C("lettuce", "Lettuce", "leaf", "We eat the leaves. Leaves catch sunlight and make sugar.", "Sun, steady water, and soil.", "Cool season.", "Leaves give vitamins, including vitamin K and folate."),
    tomato: C("tomato", "Tomato", "fruit", "A tomato is a fruit. It grows from a flower and holds seeds.", "Lots of sun, water, and soil.", "Warm season.", "Tomatoes have vitamin C."),
    bean: C("bean", "Bean", "seed", "We eat the seeds. The pod is a fruit. Helpful bacteria on the roots turn nitrogen from the air into plant food.", "Sun, water, and soil.", "Warm season.", "Beans have protein and fiber."),
    basil: C("basil", "Basil", "leaf", "Basil is an herb. We eat the leaves.", "Sun, water, and soil.", "Warm season.", "The smell comes from oils in the leaves."),
    wheat: C("wheat", "Wheat", "seed", "Wheat is a grass. The grain is the seed.", "Sun, water, and soil.", "Cool start, warm finish.", "The grain is mostly starch, which people use for energy."),
    rice: C("rice", "Rice", "seed", "Rice is a grass. A lot of rice grows in shallow water. The grain is the seed.", "Sun, plenty of water, and soil.", "Warm season.", "The grain is mostly starch."),
    apple: C("apple", "Apple", "fruit", "We eat the fruit. A flower becomes the apple. Many apple trees need a cold winter. A real tree takes years. This bed shows the idea faster.", "Sun, water, and soil.", "After a cold winter.", "Apples have fiber and some vitamin C."),
    maize: C("maize", "Maize", "seed", "Maize, also called corn, is a grass. Each kernel is a seed. People in Mexico domesticated it.", "Sun, water, and soil.", "Warm season.", "The kernels are mostly starch."),
    avocado: C("avocado", "Avocado", "fruit", "We eat the fruit. The pit is the seed. Avocados come from Central America and were grown in southern Mexico long ago.", "Sun, water, and soil.", "Warm places.", "The fruit has more oil than most fruits."),
    chili: C("chili", "Chili pepper", "fruit", "The pepper is a fruit. People in Mexico used chili peppers thousands of years ago.", "Sun, water, and soil.", "Warm season.", "The heat comes from capsaicin. Sweet peppers are the same kind of fruit without that heat."),
    potato: C("potato", "Potato", "tuber", "A potato is a tuber, a fat underground stem, not a root. The eyes are buds. People in the Andes, including Peru, domesticated potatoes.", "Sun, water, and loose soil.", "Cool season.", "Potatoes are mostly starch, with some vitamin C."),
    quinoa: C("quinoa", "Quinoa", "seed", "We eat the seed. Quinoa is not a grass. It was grown in the high Andes, including Peru.", "Sun, water, and soil.", "Cool highlands.", "The seeds contain protein."),
    cacao: C("cacao", "Cacao", "seed", "Cacao is native to the Amazon, including Peru. The seed grows inside a pod. People in Mexico grew it later.", "Warmth, rain, soil, and some shade.", "Warm wet forests.", "The seed is what becomes cocoa."),
    coffee: C("coffee", "Coffee", "seed", "The bean is a seed inside a red fruit. Coffea arabica comes from the highlands of Ethiopia and nearby Sudan.", "Water, soil, and sun or light shade.", "Warm highlands.", "The seed is roasted before people brew it."),
    teff: C("teff", "Teff", "seed", "Teff is a tiny grass seed. It was domesticated in Ethiopia.", "Sun, water, and soil.", "Warm season.", "The whole tiny grain is eaten, which keeps its fiber."),
    soybean: C("soybean", "Soybean", "seed", "A soybean is a legume seed, domesticated in China. Its roots can host bacteria that add nitrogen to the soil.", "Sun, water, and soil.", "Warm season.", "Soybeans have protein."),
    tea: C("tea", "Tea", "leaf", "We steep the young leaves. Tea plants come from the hills of southwestern China and the highlands beside them.", "Water, soil, warmth, and often some shade.", "Warm hills.", "The leaf is dried."),
    mango: C("mango", "Mango", "fruit", "We eat the fruit. Mangoes come from South Asia, including India. A real tree takes years.", "Sun, water, and soil.", "Warm places.", "Mangoes have vitamin C."),
    pepper: C("pepper", "Black pepper", "fruit", "A peppercorn is a dried unripe fruit. The plant is a vine from the wet forests of southern India.", "Warmth, water, soil, and something to climb.", "Warm wet forests.", "People grind the dried fruit as a spice."),
    olive: C("olive", "Olive", "fruit", "We eat the fruit and press oil from it. Olives come from around the Mediterranean Sea, including Italy.", "Sun and soil. Deep roots can reach water in a dry summer.", "Sunny dry summers.", "The fruit is full of oil."),
    grape: C("grape", "Grape", "fruit", "We eat the fruit. Grapevines come from the Mediterranean and nearby western Asia.", "Sun, water, soil, and a place to climb.", "Warm season.", "The fruit holds natural sugars."),
    macadamia: C("macadamia", "Macadamia", "seed", "The nut is a seed. Macadamia trees are native to eastern Australian rainforests.", "Sun or part shade, water, and soil.", "Warm rainforests.", "The seed has a lot of oil."),
    fingerlime: C("fingerlime", "Finger lime", "fruit", "Finger limes are native to eastern Australian rainforests. The juice sits in tiny pearls.", "Sun or part shade, water, and soil.", "Warm rainforests.", "Like other citrus, it has vitamin C.")
  };
  var STARTERS = ["carrot", "lettuce", "tomato", "bean", "basil", "wheat", "rice", "apple"];
  var PLACES = [
    { id: "mexico", name: "Mexico", crops: ["maize", "avocado", "chili"], fact: "Maize was domesticated in Mexico. Avocados come from Central America and were grown in southern Mexico long ago. Chili peppers are fruits people there used very early. Cacao is not from Mexico. It is from the Amazon." },
    { id: "peru", name: "Peru", crops: ["potato", "quinoa", "cacao"], fact: "Potatoes and quinoa come from the Andes, including Peru. A potato is an underground stem. Quinoa is a seed, not a grass. Cacao is native to the Amazon, including Peru." },
    { id: "ethiopia", name: "Ethiopia", crops: ["coffee", "teff"], fact: "Coffee plants come from the highlands of Ethiopia and nearby Sudan. The bean is a seed inside a fruit. Teff is a tiny grain domesticated in Ethiopia." },
    { id: "china", name: "China", crops: ["soybean", "tea"], fact: "Soybeans were domesticated in China. Tea plants come from the hills of southwestern China and the highlands beside them. We use the young leaves." },
    { id: "india", name: "India", crops: ["mango", "pepper"], fact: "Mangoes come from South Asia, including India. Black pepper is a vine from southern India. A peppercorn is a dried unripe fruit." },
    { id: "italy", name: "Italy", crops: ["olive", "grape"], fact: "Olive trees and grapevines come from around the Mediterranean Sea. Italy has grown both for a very long time. Olives and grapes are fruits." },
    { id: "australia", name: "Australia", crops: ["macadamia", "fingerlime"], fact: "Macadamia trees and finger limes are native to the rainforests of eastern Australia. The macadamia we eat is the seed. The finger lime is a fruit." }
  ];

  var root, raf = 0, st, ui, cv, ctx, viewW = 360, viewH = 480, board = [], plotsBox = [], drag = null, imgs = {}, ready = false;
  var pops = [], sparks = [];
  var audioCtx = null, musicTimer = 0, soundOn = true;

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function gapDays(a, b) { return Math.max(0, Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000)); }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function profileId() {
    try { var p = JSON.parse(localStorage.getItem("starblade-academy-profiles") || "{}"); return (p && p.last) || "main"; }
    catch (e) { return "main"; }
  }
  function key() { return "starblade-farm-v1:" + profileId(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function make(species, stage, rarity) {
    return { id: uid(), species: species, stage: stage, rarity: rarity || 0, wellness: stage ? 1 : 0, name: NAMES[species], phase: Math.random() * 6, slot: null };
  }
  function blank() {
    return { v: 2, dragons: [], seeds: {}, pantry: {}, plots: [], found: {}, visited: {}, upgrades: { beds: 4, lanterns: 1 }, best: { glide: 0, hunt: 0, fair: 0 }, ribbons: {}, stars: 0, lastGift: "", hello: "", note: "" };
  }
  function starter() {
    var s = blank();
    s.dragons = [make("cinder", 0, 0), make("cinder", 0, 0), make("cinder", 0, 1), make("ripple", 1, 1)];
    STARTERS.forEach(function (id) { s.seeds[id] = id === "apple" ? 1 : 3; s.found[id] = true; });
    s.seeds.carrot = 4;
    s.plots = [null, null, null, null];
    s.lastGift = today();
    s.hello = "Three Cinderling eggs and a Ripplet are here. Drag a dragon onto a match. Nobody has to leave.";
    ensureSlots(s);
    return s;
  }
  function save(s) { s.v = 2; try { localStorage.setItem(key(), JSON.stringify(s)); } catch (e) {} }
  function ensureSlots(s) {
    var used = {};
    s.dragons.forEach(function (d) {
      if (d.slot == null || used[d.slot]) d.slot = null;
      else used[d.slot] = 1;
    });
    var n = 0;
    s.dragons.forEach(function (d) {
      if (d.slot == null) {
        while (used[n]) n++;
        d.slot = n;
        used[n] = 1;
      }
    });
  }
  function welcomeDay(s) {
    var t = today();
    if (s.lastGift && s.lastGift !== t) {
      var n = Math.min(3, gapDays(s.lastGift, t) || 1);
      for (var i = 0; i < n; i++) s.dragons.push(make(SPECIES[i % SPECIES.length], 0, 0));
      s.hello = "Welcome back. Eggs waited here. Your dragons stayed cozy, and nothing was lost.";
    }
    s.lastGift = t;
    ensureSlots(s);
  }
  function load() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(key()) || "null"); } catch (e) {}
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.dragons) || !raw.dragons.length && !raw.lastGift) {
      var fresh = starter();
      save(fresh);
      return fresh;
    }
    var s = blank();
    s.dragons = raw.dragons.filter(function (d) { return d && NAMES[d.species] && STAGE[d.stage] != null; });
    s.seeds = raw.seeds || {};
    s.pantry = raw.pantry || {};
    s.plots = Array.isArray(raw.plots) ? raw.plots : [];
    s.found = raw.found || {};
    s.visited = raw.visited || {};
    s.best = Object.assign({ glide: 0, hunt: 0, fair: 0 }, raw.best || {});
    s.ribbons = raw.ribbons || {};
    s.stars = Math.max(0, raw.stars || 0);
    s.upgrades = Object.assign({ beds: 4, lanterns: 1 }, raw.upgrades || {});
    if (s.upgrades.beds < 4) s.upgrades.beds = 4;
    if (s.upgrades.beds < s.plots.length) s.upgrades.beds = s.plots.length;
    while (s.plots.length < s.upgrades.beds) s.plots.push(null);
    STARTERS.forEach(function (id) { s.found[id] = true; });
    s.lastGift = raw.lastGift || "";
    s.hello = raw.hello || "";
    s.note = raw.note || "";
    s.dragons.forEach(function (d) {
      if (!d.id) d.id = uid();
      if (d.wellness == null || d.wellness < 0) d.wellness = d.stage ? 1 : 0;
      if (d.wellness > 5) d.wellness = 5;
      d.name = NAMES[d.species];
      if (d.phase == null) d.phase = 0;
    });
    if (!s.dragons.length) return starter();
    welcomeDay(s);
    save(s);
    return s;
  }
  function earn(n) { n = Math.max(0, n | 0); st.stars = (st.stars || 0) + n; return n; }
  function placeBy(id) { return PLACES.filter(function (p) { return p.id === id; })[0] || null; }
  function pocket(countryId) {
    var place = placeBy(countryId);
    if (!place) return;
    var s = load();
    var fresh = 0;
    place.crops.forEach(function (cid) {
      var have = s.seeds[cid] || 0;
      s.seeds[cid] = have + (have ? 1 : 3);
      if (!s.found[cid]) { s.found[cid] = true; fresh++; }
    });
    s.visited[place.id] = today();
    s.note = fresh ? "Seeds from " + place.name + " are in your pouch." : "You already carry these seeds. A few more were added.";
    save(s);
    if (st) { st = s; if (ui) ui.note = s.note; if (root) paint(); }
  }

  function ac() {
    if (!soundOn) return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function tone(freq, delay, dur, type, vol) {
    var c = ac();
    if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (delay || 0);
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function chime() { [523, 659, 784].forEach(function (f, i) { tone(f, i * 0.08, 0.28, "sine", 0.04); }); }
  function startMusic() {
    stopMusic();
    if (!soundOn || reduced()) return;
    var notes = [262, 330, 392, 330, 294, 392, 349, 262];
    var i = 0;
    musicTimer = setInterval(function () { tone(notes[i % notes.length], 0, 0.45, "sine", 0.018); i++; }, 780);
  }
  function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = 0; }
  function setSound(on) {
    soundOn = on;
    try { localStorage.setItem("starblade-farm-mute", on ? "0" : "1"); } catch (e) {}
    if (on) startMusic(); else stopMusic();
    paint();
  }

  function loadImages(done) {
    var jobs = [["bg", "farm/art/farm-bg.jpg"]];
    SPECIES.forEach(function (id) { for (var i = 0; i < 5; i++) jobs.push(["s:" + id + ":" + i, "farm/art/" + id + "-" + i + ".png"]); });
    PLACES.forEach(function (p) { jobs.push(["land:" + p.id, "farm/art/land-" + p.id + ".jpg"]); });
    var left = jobs.length;
    jobs.forEach(function (job) {
      var img = new Image();
      img.onload = img.onerror = function () { imgs[job[0]] = img.naturalWidth ? img : null; if (--left === 0) done(); };
      img.src = job[1];
    });
  }
  function sprite(d) { return imgs["s:" + d.species + ":" + d.stage]; }

  function burst(x, y, color, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.28, sp = 0.6 + Math.random() * 2.2;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2, life: 1, color: color, size: 3 + Math.random() * 4 });
    }
    if (sparks.length > 120) sparks.splice(0, sparks.length - 120);
  }
  function floatText(x, y, text) { pops.push({ x: x, y: y, text: text, life: 1 }); }

  function cols() { return viewW >= 720 ? 6 : 4; }
  function slotCount() {
    var max = 11;
    st.dragons.forEach(function (d) { if (d.slot > max) max = d.slot; });
    var need = Math.max(max + 1, st.dragons.length + 2, 12);
    var c = cols();
    return Math.ceil(need / c) * c;
  }
  function layout() {
    var c = cols(), n = slotCount(), rows = n / c;
    var top = viewH * 0.30, bottom = viewH * 0.78;
    var size = Math.min((viewW - 16) / c, (bottom - top) / rows);
    var ox = (viewW - size * c) / 2;
    board = [];
    for (var i = 0; i < n; i++) {
      var col = i % c, row = Math.floor(i / c);
      board.push({ i: i, x: ox + col * size + 2, y: top + row * size + 2, s: size - 4 });
    }
    var beds = st.plots.length, gap = 6, y = viewH * 0.82, h = Math.max(36, viewH * 0.14);
    var w = Math.min(78, (viewW - 16 - gap * (beds - 1)) / beds);
    var x0 = (viewW - (w * beds + gap * (beds - 1))) / 2;
    plotsBox = [];
    for (var p = 0; p < beds; p++) plotsBox.push({ i: p, x: x0 + p * (w + gap), y: y, w: w, h: h });
  }
  function dragonAt(slot) { return st.dragons.filter(function (d) { return d.slot === slot; })[0] || null; }
  function cellAt(x, y) {
    for (var i = 0; i < board.length; i++) {
      var b = board[i];
      if (x >= b.x && y >= b.y && x <= b.x + b.s && y <= b.y + b.s) return b;
    }
    return null;
  }
  function emptySlot() {
    var used = {};
    st.dragons.forEach(function (d) { used[d.slot] = 1; });
    for (var i = 0; i < slotCount() + cols(); i++) if (!used[i]) return i;
    return st.dragons.length;
  }
  function kindCount(d) {
    return st.dragons.filter(function (x) { return x.species === d.species && x.stage === d.stage; }).length;
  }
  function welcomeNext(d) {
    var rarity = d.rarity;
    st.dragons.forEach(function (x) { if (x.species === d.species && x.stage === d.stage) rarity = Math.max(rarity, x.rarity); });
    var baby = d.stage >= 4 ? make(d.species, 0, 3) : make(d.species, d.stage + 1, rarity);
    baby.wellness = 2;
    baby.slot = emptySlot();
    st.dragons.push(baby);
    ui.selected = baby.id;
    var cell = board.filter(function (b) { return b.i === baby.slot; })[0];
    burst(cell ? cell.x + cell.s / 2 : viewW / 2, cell ? cell.y + cell.s / 2 : viewH / 2, "#ffcf6b", 28);
    floatText(viewW / 2, viewH * 0.24, "+1 star");
    earn(1);
    chime();
    ui.note = d.stage >= 4
      ? "Three elders welcomed a gleam egg. All three stay."
      : "A bigger " + NAMES[d.species] + " joined the meadow. The three who matched all stay.";
    save(st);
  }

  function round(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawCover(img) {
    if (!img) return;
    var ir = img.width / img.height, cr = viewW / viewH, dw, dh, dx, dy;
    if (ir > cr) { dh = viewH; dw = dh * ir; dx = (viewW - dw) / 2; dy = 0; }
    else { dw = viewW; dh = dw / ir; dx = 0; dy = (viewH - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  function drawCreature(d, x, y, size, t, ghost) {
    var img = sprite(d);
    ctx.save();
    ctx.translate(x, y);
    if (!reduced()) {
      ctx.rotate(Math.sin(t / 220 + d.phase) * 0.06);
      ctx.scale(1, 1 + Math.sin(t / 520 + d.phase) * 0.035);
    }
    if (ghost) ctx.globalAlpha = 0.85;
    var glow = ["transparent", "rgba(255,255,255,.35)", "rgba(180,220,255,.55)", "rgba(255,207,107,.75)"][d.rarity] || "transparent";
    if (d.rarity) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 12 + d.rarity * 4;
    }
    if (img) {
      var sc = (size * 0.92) / Math.max(img.width, img.height);
      ctx.drawImage(img, -img.width * sc / 2, -img.height * sc / 2, img.width * sc, img.height * sc);
      if (!reduced() && Math.floor(t / 140) % 26 === Math.floor(d.phase) % 26 && d.stage) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(80,40,30,.45)";
        ctx.fillRect(-size * 0.05, -size * 0.18, size * 0.16, size * 0.035);
      }
    }
    ctx.restore();
  }
  function drawCrop(plot, box) {
    var x = box.x, y = box.y, w = box.w, h = box.h;
    ctx.fillStyle = "#6b3f1d";
    round(x, y, w, h, 10); ctx.fill();
    ctx.fillStyle = "#8a5a32";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.35, w * 0.12, 4, 0, 0, 6.3);
    ctx.ellipse(x + w * 0.68, y + h * 0.55, w * 0.16, 5, 0, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = "#3e2412";
    for (var i = 0; i < 5; i++) ctx.fillRect(x + 5 + (i * w) / 6, y + h - 9, 5, 3);
    if (!plot) {
      return;
    }
    var c = CROPS[plot.crop], step = plot.step || 0;
    ctx.strokeStyle = "#246b32";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h - 8);
    ctx.lineTo(x + w / 2, y + h - 16 - step * 8);
    ctx.stroke();
    if (step >= 1) {
      ctx.fillStyle = "#3cb054";
      ctx.beginPath();
      ctx.ellipse(x + w / 2 - 6, y + h - 20 - step * 6, 7, 4, -0.6, 0, 6.3);
      ctx.ellipse(x + w / 2 + 6, y + h - 20 - step * 6, 7, 4, 0.6, 0, 6.3);
      ctx.fill();
    }
    if (step >= 2) {
      ctx.fillStyle = "#2f8f45";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + 16, w * 0.28, 10, 0, 0, 6.3);
      ctx.fill();
    }
    if (step >= 3) {
      var food = c.part === "root" ? "#ff8a2a" : c.part === "tuber" ? "#e6c27a" : c.part === "leaf" ? "#7dce4a" : c.part === "fruit" ? "#e23d3d" : "#f2d48a";
      ctx.fillStyle = food;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.42, Math.min(10, w * 0.22), 0, 6.3);
      ctx.fill();
    }
  }
  function drawBoard(t) {
    layout();
    board.forEach(function (b) {
      ctx.fillStyle = "rgba(255,255,255,.14)";
      round(b.x, b.y, b.s, b.s, 12);
      ctx.fill();
      var d = dragonAt(b.i);
      if (d && (!drag || drag.id !== d.id)) drawCreature(d, b.x + b.s / 2, b.y + b.s / 2 + 4, b.s, t, false);
      if (d && ui.selected === d.id) {
        ctx.strokeStyle = "#ffcf6b";
        ctx.lineWidth = 3;
        round(b.x + 2, b.y + 2, b.s - 4, b.s - 4, 12);
        ctx.stroke();
      }
    });
    plotsBox.forEach(function (b) { drawCrop(st.plots[b.i], b); });
  }
  function drawSparkles() {
    sparks.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.016;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 6.3);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    sparks = sparks.filter(function (p) { return p.life > 0; });
    pops.forEach(function (p) {
      p.y -= 0.6; p.life -= 0.012;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = "#ffcf6b";
      ctx.font = "700 22px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    pops = pops.filter(function (p) { return p.life > 0; });
  }
  function frame(t) {
    if (!root || !st) return;
    var next = root.querySelector("canvas");
    if (!next) { raf = requestAnimationFrame(frame); return; }
    cv = next;
    ctx = cv.getContext("2d");
    var rect = cv.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    viewW = Math.max(280, rect.width || 360);
    viewH = Math.max(320, rect.height || 480);
    if (cv.width !== Math.floor(viewW * dpr) || cv.height !== Math.floor(viewH * dpr)) {
      cv.width = Math.floor(viewW * dpr);
      cv.height = Math.floor(viewH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    if (ui.mode === "glide" && ui.phase === "play") drawGlide(t);
    else if (ui.mode === "hunt" && ui.phase === "play") drawHunt(t);
    else if (ui.mode === "fair" && ui.phase === "play") drawFair(t);
    else if (ui.mode === "gallery") drawGallery(t);
    else {
      drawCover(imgs.bg);
      var wash = ctx.createLinearGradient(0, 0, 0, viewH);
      wash.addColorStop(0, "rgba(255,210,120,.08)");
      wash.addColorStop(1, "rgba(0,0,0,.12)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, viewW, viewH);
      drawBoard(t);
      if (drag) {
        var d = byId(drag.id);
        if (d) drawCreature(d, drag.x, drag.y, 86, t, true);
      }
    }
    drawSparkles();
    if (ui.mode === "glide" && ui.phase === "play") stepGlide(t);
    raf = requestAnimationFrame(frame);
  }

  function byId(id) { return st.dragons.filter(function (d) { return d.id === id; })[0]; }
  function selectedDragon() { return byId(ui.selected) || st.dragons.filter(function (d) { return d.stage > 0; })[0] || st.dragons[0]; }

  function hatch() {
    var egg = st.dragons.filter(function (d) { return d.stage === 0; })[0];
    if (!egg) { ui.note = "No eggs are waiting. Everyone already here is safe."; paint(); return; }
    egg.stage = 1;
    egg.wellness = Math.max(egg.wellness, 2);
    ui.selected = egg.id;
    ui.note = egg.name + " hatched. Wings, horns, and a tail, and the egg's friends stay.";
    var cell = board.filter(function (b) { return b.i === egg.slot; })[0];
    burst(cell ? cell.x + cell.s / 2 : 80, cell ? cell.y : 80, "#ffb15a", 26);
    chime();
    save(st); paint();
  }
  function firstFood() {
    var best = null, n = 0;
    Object.keys(st.pantry).forEach(function (k) { if ((st.pantry[k] || 0) > n) { best = k; n = st.pantry[k]; } });
    return best;
  }
  function feed() {
    var d = selectedDragon();
    if (!d || d.stage === 0) { ui.note = "Warm an egg first. Eggs do not need a snack yet."; paint(); return; }
    var food = firstFood();
    if (!food) { ui.note = d.name + " is still cozy. Harvest a plant when you want to share a snack."; paint(); return; }
    if (d.wellness >= 5) { ui.note = d.name + " is already gleaming. Save the food. Glow does not go backward."; paint(); return; }
    st.pantry[food]--;
    d.wellness++;
    ui.note = d.name + " nibbled " + CROPS[food].name.toLowerCase() + ". " + CROPS[food].line + " " + GLOW[d.wellness] + ".";
    tone(660, 0, 0.12, "sine", 0.04);
    save(st); paint();
  }
  function mergeButton() {
    var groups = {};
    st.dragons.forEach(function (d) { var k = d.species + ":" + d.stage; (groups[k] = groups[k] || []).push(d); });
    var found = null;
    Object.keys(groups).forEach(function (k) { if (!found && groups[k].length >= 3) found = groups[k][0]; });
    if (!found) { ui.note = "Drag one dragon onto a matching one when three of that kind are here. All of them stay."; paint(); return; }
    welcomeNext(found);
    paint();
  }
  function plant(id) {
    if (!st.seeds[id]) { ui.note = "That seed is not in the pouch yet."; paint(); return; }
    var i = st.plots.indexOf(null);
    if (i < 0) { ui.note = "Every bed is full. Gather what is ready, or add a bed at the fair. Nothing is thrown out."; paint(); return; }
    st.seeds[id]--;
    st.plots[i] = { crop: id, step: 0 };
    ui.note = "Seed in the soil. " + CROPS[id].line + " It needs " + CROPS[id].needs;
    save(st); paint();
  }
  function water() {
    var n = 0;
    st.plots.forEach(function (p) { if (p && p.step < 3) { p.step++; n++; } });
    ui.note = n ? "Water sank in. " + LESSON : "Nothing is thirsty. Ready plants can be gathered.";
    tone(520, 0, 0.1, "triangle", 0.03);
    save(st); paint();
  }
  function harvest() {
    var names = [];
    st.plots.forEach(function (p, i) {
      if (p && p.step >= 3) { st.pantry[p.crop] = (st.pantry[p.crop] || 0) + 1; names.push(CROPS[p.crop].name); st.plots[i] = null; }
    });
    if (!names.length) { ui.note = "Nothing is ready. Water the beds. Waiting is not a failure."; paint(); return; }
    var grown = CROPS[Object.keys(st.pantry).filter(function (k) { return st.pantry[k]; })[0]];
    ui.note = "You gathered " + names.join(", ") + "." + (grown ? " " + grown.extra : "");
    earn(names.length);
    chime();
    save(st); paint();
  }
  function addBed() {
    if (st.upgrades.beds >= 8) { ui.note = "Eight beds is enough for now."; paint(); return; }
    var total = Object.keys(st.pantry).reduce(function (n, k) { return n + (st.pantry[k] || 0); }, 0);
    if (total < 4) { ui.note = "A new bed costs 4 gathered foods, not stars."; paint(); return; }
    var left = 4;
    Object.keys(st.pantry).forEach(function (k) { while (left && st.pantry[k]) { st.pantry[k]--; left--; } });
    st.upgrades.beds++;
    st.plots.push(null);
    ui.note = "A new bed is tilled. Your stars were not used.";
    save(st); paint();
  }

  function localPoint(e) {
    var r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onDown(e) {
    if (!cv || ui.mode !== "farm") return;
    var p = localPoint(e);
    var cell = cellAt(p.x, p.y);
    if (!cell) return;
    var d = dragonAt(cell.i);
    if (!d) return;
    drag = { id: d.id, x: p.x, y: p.y };
    ui.selected = d.id;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    e.preventDefault();
  }
  function onMove(e) { if (!drag || !cv) return; var p = localPoint(e); drag.x = p.x; drag.y = p.y; }
  function onUp(e) {
    if (!drag) return;
    var p = cv ? localPoint(e) : { x: 0, y: 0 };
    var cell = cellAt(p.x, p.y);
    var d = byId(drag.id);
    drag = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (!d || !cell) return;
    var other = dragonAt(cell.i);
    if (!other) { d.slot = cell.i; save(st); return; }
    if (other.id === d.id) return;
    if (other.species === d.species && other.stage === d.stage && kindCount(d) >= 3) { welcomeNext(d); paint(); return; }
    if (other.species === d.species && other.stage === d.stage) {
      ui.note = "These two match. One more of the same kind welcomes a bigger dragon. Both stay.";
      paint();
      return;
    }
    var tmp = d.slot; d.slot = other.slot; other.slot = tmp;
    save(st);
  }

  function drawGlide(t) {
    var g = ui.glide;
    var sky = ctx.createLinearGradient(0, 0, 0, viewH);
    sky.addColorStop(0, "#241848");
    sky.addColorStop(1, "#e39a55");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.fillStyle = "#2f6a3e";
    var shift = ((t / 30) % viewW);
    ctx.beginPath();
    ctx.moveTo(-shift, viewH * 0.72);
    for (var x = -shift; x < viewW + 40; x += 40) ctx.lineTo(x, viewH * 0.72 - Math.sin(x / 50) * 18);
    ctx.lineTo(viewW, viewH); ctx.lineTo(0, viewH); ctx.fill();
    ctx.fillStyle = "#1f4d2c";
    ctx.fillRect(0, viewH * 0.82, viewW, viewH);
    g.clouds.forEach(function (c) {
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.beginPath(); ctx.ellipse(c.x, c.y, 34, 14, 0, 0, 6.3); ctx.fill();
    });
    g.rings.forEach(function (r) {
      ctx.strokeStyle = r.got ? "rgba(255,255,255,.3)" : "#ffcf6b";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(r.x, r.y, 18, 0, 6.3); ctx.stroke();
    });
    if (g.dragon) drawCreature(g.dragon, g.x, g.y, 110, t, false);
    ctx.fillStyle = "#ffcf6b";
    ctx.font = "700 20px Cinzel, serif";
    ctx.textAlign = "left";
    ctx.fillText("Lights " + g.score, 16, 32);
  }
  function stepGlide(t) {
    var g = ui.glide;
    if (!g || g.done) return;
    if (!g.t0) g.t0 = t;
    var dt = Math.min(32, t - (g.last || t));
    g.last = t;
    if (g.hold) g.vy -= 0.002 * dt;
    g.vy += 0.0011 * dt;
    g.vy *= 0.985;
    g.y += g.vy * dt;
    if (g.y < 40) { g.y = 40; g.vy = 0; }
    if (g.y > viewH - 50) { g.y = viewH - 50; g.vy = 0; }
    g.rings.forEach(function (r) {
      r.x -= 0.16 * dt;
      if (!r.got && Math.abs(r.x - g.x) < 24 && Math.abs(r.y - g.y) < 26) {
        r.got = true; g.score++; burst(r.x, r.y, "#ffcf6b", 10); floatText(r.x, r.y, "+1"); tone(740, 0, 0.08, "sine", 0.03);
      }
    });
    g.clouds.forEach(function (c) { c.x -= 0.08 * dt; if (Math.abs(c.x - g.x) < 36 && Math.abs(c.y - g.y) < 24) g.vy *= 0.45; });
    g.rings = g.rings.filter(function (r) { return r.x > -40; });
    g.clouds = g.clouds.filter(function (c) { return c.x > -50; });
    if (t - g.spawn > 650) {
      g.spawn = t;
      g.rings.push({ x: viewW + 24, y: 50 + Math.random() * (viewH - 120), got: false });
      g.clouds.push({ x: viewW + 30, y: 40 + Math.random() * (viewH * 0.6) });
    }
    if (t - g.t0 > 16000) endGlide();
  }
  function endGlide() {
    if (!ui.glide || ui.glide.done) return;
    ui.glide.done = true;
    var got = Math.max(1, ui.glide.score);
    if (ui.glide.score > st.best.glide) st.best.glide = ui.glide.score;
    var gained = earn(got);
    ui.phase = "end";
    ui.note = "You flew the whole way and earned " + gained + " stars. Clouds only slow you. Stars now: " + st.stars + ".";
    chime();
    save(st);
    paint();
  }
  function drawHunt(t) {
    drawCover(imgs.bg);
    ui.hunt.spots.forEach(function (s) {
      if (s.found) return;
      var x = s.x * viewW, y = s.y * viewH;
      ctx.strokeStyle = s.hint ? "#fff" : "#ffcf6b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 18 + Math.sin(t / 200) * 3, 0, 6.3);
      ctx.stroke();
      var egg = { species: "cinder", stage: 0, rarity: 0, phase: s.i, id: "egg" };
      drawCreature(egg, x, y, 54, t, false);
    });
  }
  function drawFair(t) {
    drawCover(imgs.bg);
    var d = selectedDragon();
    if (d) drawCreature(d, viewW / 2, viewH * 0.55, Math.min(viewW, viewH) * 0.55, t, false);
    ctx.fillStyle = "rgba(255,207,107,.25)";
    ctx.beginPath();
    ctx.ellipse(viewW / 2, viewH * 0.78, 70, 16, 0, 0, 6.3);
    ctx.fill();
  }
  function drawGallery(t) {
    drawCover(imgs.bg);
    ctx.fillStyle = "rgba(8,6,20,.35)";
    ctx.fillRect(0, 0, viewW, viewH);
    var col = 0, row = 0, size = Math.min(110, (viewW - 20) / 4);
    SPECIES.forEach(function (id) {
      for (var stage = 1; stage <= 4; stage++) {
        var x = 12 + col * size, y = 16 + row * (size + 8);
        drawCreature({ species: id, stage: stage, rarity: stage === 4 ? 3 : 0, phase: id.length, id: id + stage }, x + size / 2, y + size / 2, size - 8, t, false);
        col++;
        if (col >= 4) { col = 0; row++; }
      }
    });
  }

  function paint() {
    if (!root || !st) return;
    var hello = st.hello || st.note;
    if (st.hello || st.note) { st.hello = ""; st.note = ""; save(st); }
    if (hello && !ui.note) ui.note = hello;
    root.innerHTML = shell();
    bind();
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function shell() {
    var head = '<div class="farm-top"><div><h2>' + title() + '</h2><p>' + st.dragons.length + " dragons · farm stars " + (st.stars || 0) + " · pantry " + pantryCount() + '</p></div><div class="farm-row"><button class="farm-btn" data-farm="back">Back</button><button class="farm-btn" data-farm="mute">' + (soundOn ? "Sound on" : "Sound off") + "</button></div></div>";
    if (ui.mode === "flight") return flightHtml(head);
    if (ui.mode === "gallery") return head + '<div class="farm-stage"><canvas aria-label="Dragon kinds"></canvas></div><p class="farm-note">Six kinds, from baby to elder. Eggs are the start. Elders wear a brighter trim. Rarity is a glow, not a rank against anyone.</p><button class="farm-btn" data-farm="home">Back to the meadow</button>';
    if (ui.phase === "start") return head + card(ui.mode) + '<button class="farm-btn gold" data-farm="begin">Begin</button><button class="farm-btn" data-farm="home">Not now</button>';
    if (ui.phase === "end") return head + '<article class="farm-card"><p class="farm-kicker">Stars earned</p><h3>' + esc(ui.note) + '</h3><p>Stars only go up. You have ' + st.stars + ' farm stars.</p><button class="farm-btn gold" data-farm="again">Play again</button><button class="farm-btn" data-farm="home">Back to the meadow</button></article>';
    var garden = ui.panel === "garden" ? '<div class="farm-sheet"><p class="farm-kicker">Plant a seed</p><p>' + esc(LESSON) + '</p><div class="farm-row">' + Object.keys(CROPS).filter(function (id) { return st.found[id]; }).map(function (id) { return '<button class="farm-btn" data-farm="plant:' + id + '">' + esc(CROPS[id].name) + " " + (st.seeds[id] || 0) + "</button>"; }).join("") + "</div></div>" : "";
    var fly = ui.panel === "fly" ? '<div class="farm-sheet"><p class="farm-kicker">Seed flights</p><p>Each landing shows the land and pockets seeds. Seeds are never taken back.</p><div class="farm-row">' + PLACES.map(function (p) { return '<button class="farm-btn" data-farm="place:' + p.id + '">' + esc(p.name) + "</button>"; }).join("") + "</div></div>" : "";
    var play = ui.panel === "play" ? '<div class="farm-sheet"><p class="farm-kicker">Play</p><div class="farm-row"><button class="farm-btn gold" data-farm="glide">Lantern glide</button><button class="farm-btn gold" data-farm="hunt">Egg garden</button><button class="farm-btn gold" data-farm="fair">Harvest fair</button></div></div>' : "";
    var rise = ui.mode === "glide" && ui.phase === "play" ? '<button class="farm-btn gold" id="farm-rise" data-farm="rise">Hold to rise</button><button class="farm-btn" data-farm="glide-end">Land softly</button>' : "";
    var fair = ui.mode === "fair" && ui.phase === "play" ? '<button class="farm-btn gold" data-farm="ribbon">Give the ribbon</button><button class="farm-btn" data-farm="bed">Add a bed (' + st.upgrades.beds + "/8)</button>" : "";
    return head
      + '<div class="farm-stage"><canvas aria-label="Dragon farm meadow"></canvas></div>'
      + '<p class="farm-note">' + esc(ui.note || "Drag a dragon onto a match. Water the soil. Everyone stays.") + "</p>"
      + '<div class="farm-row">'
      + '<button class="farm-btn gold" data-farm="hatch">Warm an egg</button>'
      + '<button class="farm-btn gold" data-farm="feed">Share a snack</button>'
      + '<button class="farm-btn gold" data-farm="merge">Welcome a bigger one</button>'
      + '<button class="farm-btn" data-farm="water">Water</button>'
      + '<button class="farm-btn" data-farm="harvest">Gather</button>'
      + '<button class="farm-btn" data-farm="panel:garden">Plant</button>'
      + '<button class="farm-btn" data-farm="panel:fly">Fly</button>'
      + '<button class="farm-btn" data-farm="panel:play">Play</button>'
      + '<button class="farm-btn" data-farm="gallery">Kinds</button>'
      + rise + fair
      + "</div>" + garden + fly + play;
  }
  function title() {
    if (ui.mode === "flight" && ui.flightPlace) return "Flying to " + ui.flightPlace.name;
    if (ui.mode === "gallery") return "Dragon kinds";
    if (ui.mode === "glide") return "Lantern glide";
    if (ui.mode === "hunt") return "Egg garden";
    if (ui.mode === "fair") return "Harvest fair";
    return "Dragon Farm";
  }
  function pantryCount() { return Object.keys(st.pantry).reduce(function (n, k) { return n + (st.pantry[k] || 0); }, 0); }
  function card(mode) {
    var copy = {
      glide: ["Lantern glide", "Hold to rise. Let go to glide. Fly through the lights. Clouds only slow you. You always finish, and stars only go up."],
      hunt: ["Egg garden", "Find five glowing eggs in the meadow. A hint appears if you wait. The eggs join you. Nothing is lost if you look slowly."],
      fair: ["Harvest fair", "This is a celebration for one dragon, not a contest. A ribbon names their glow. A new bed costs gathered food, never stars."]
    }[mode];
    return '<article class="farm-card"><p class="farm-kicker">Ready</p><h3>' + copy[0] + "</h3><p>" + copy[1] + "</p></article>";
  }
  function flightHtml(head) {
    var p = ui.flightPlace;
    var img = imgs["land:" + p.id];
    return head + '<div class="farm-sky"><i style="width:70px;top:24px;left:10%"></i><i style="width:90px;top:64px;left:55%"></i>'
      + (sprite({ species: "cinder", stage: 3 }) ? '<img class="farm-pop" alt="" src="farm/art/cinder-3.png">' : "")
      + "</div>"
      + (ui.flightLanded
        ? '<article class="farm-card">' + (img ? '<img alt="The lands of ' + esc(p.name) + '" src="farm/art/land-' + p.id + '.jpg">' : "") + '<p class="farm-kicker">Seed card</p><h3>' + esc(p.name) + "</h3><p>" + esc(p.fact) + '</p><button class="farm-btn gold" data-farm="pocket">Pocket the seeds</button></article>'
        : '<p class="farm-note">Wings up. The meadow is safe while you fly.</p><button class="farm-btn gold" data-farm="arrive">Land in ' + esc(p.name) + "</button>");
  }

  function bind() {
    root.onclick = function (e) {
      var el = e.target.closest("[data-farm]");
      if (!el) return;
      act(el.getAttribute("data-farm"));
    };
    cv = root.querySelector("canvas");
    if (cv) {
      cv.addEventListener("pointerdown", onDown);
      if (ui.mode === "hunt" && ui.hunt) {
        cv.setAttribute("data-spots", JSON.stringify(ui.hunt.spots.map(function (s) { return { x: s.x, y: s.y, found: !!s.found }; })));
        cv.addEventListener("pointerdown", huntTap);
      }
    }
    var rise = root.querySelector("#farm-rise");
    if (rise) {
      var down = function (e) { e.preventDefault(); if (ui.glide) ui.glide.hold = true; };
      var up = function () { if (ui.glide) ui.glide.hold = false; };
      rise.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
    }
  }
  function huntTap(e) {
    if (!ui.hunt || ui.phase !== "play") return;
    var p = localPoint(e);
    var hit = null;
    ui.hunt.spots.forEach(function (s) {
      if (!s.found && Math.abs(s.x * viewW - p.x) < 32 && Math.abs(s.y * viewH - p.y) < 32) hit = s;
    });
    if (!hit) return;
    hit.found = true;
    ui.hunt.found++;
    burst(p.x, p.y, "#ffcf6b", 14);
    tone(620, 0, 0.08, "sine", 0.04);
    if (ui.hunt.found >= 5) finishHunt();
    else { ui.note = ui.hunt.found + " of 5 eggs."; paint(); }
  }
  function finishHunt() {
    if (ui.hunt.first) {
      for (var i = 0; i < 5; i++) st.dragons.push(make(SPECIES[i % SPECIES.length], 0, i === 4 ? 2 : 0));
      ensureSlots(st);
    } else {
      var id = STARTERS[Math.floor(Math.random() * STARTERS.length)];
      st.seeds[id] = (st.seeds[id] || 0) + 1;
    }
    st.best.hunt = Math.max(st.best.hunt || 0, 5);
    var gained = earn(ui.hunt.first ? 5 : 1);
    ui.phase = "end";
    ui.note = "You found every egg and earned " + gained + " stars.";
    chime();
    save(st);
    paint();
  }
  function act(name) {
    if (name === "back") { if (ui.mode === "farm" && !ui.panel) { if (window.go) window.go("home"); return; } ui.mode = "farm"; ui.panel = ""; ui.phase = ""; paint(); return; }
    if (name === "home") { ui.mode = "farm"; ui.panel = ""; ui.phase = ""; paint(); return; }
    if (name === "mute") { setSound(!soundOn); return; }
    if (name.indexOf("panel:") === 0) { ui.panel = name.slice(6); ui.mode = "farm"; ui.phase = ""; paint(); return; }
    if (name === "hatch") return hatch();
    if (name === "feed") return feed();
    if (name === "merge") return mergeButton();
    if (name === "water") return water();
    if (name === "harvest") return harvest();
    if (name.indexOf("plant:") === 0) return plant(name.slice(6));
    if (name === "gallery") { ui.mode = "gallery"; ui.panel = ""; paint(); return; }
    if (name.indexOf("place:") === 0) return openFlight(name.slice(6));
    if (name === "arrive") { ui.flightLanded = true; paint(); return; }
    if (name === "pocket") { pocket(ui.flightPlace.id); ui.mode = "farm"; ui.panel = "garden"; ui.note = st.note; paint(); return; }
    if (name === "glide" || name === "hunt" || name === "fair") { ui.mode = name; ui.phase = "start"; ui.panel = ""; paint(); return; }
    if (name === "begin" || name === "again") return beginPlay();
    if (name === "glide-end") return endGlide();
    if (name === "ribbon") return giveRibbon();
    if (name === "bed") return addBed();
  }
  function openFlight(id) {
    var p = placeBy(id);
    if (!p) return;
    ui.mode = "flight";
    ui.flightPlace = p;
    ui.flightLanded = !!reduced();
    ui.panel = "";
    paint();
    if (!reduced()) setTimeout(function () { if (ui && ui.mode === "flight" && root) { ui.flightLanded = true; paint(); } }, 1600);
  }
  function beginPlay() {
    ui.phase = "play";
    if (ui.mode === "glide") {
      var d = selectedDragon() || st.dragons[0];
      ui.glide = { x: 90, y: 160, vy: 0, hold: false, score: 0, rings: [], clouds: [], spawn: 0, t0: 0, last: 0, done: false, dragon: d };
      ui.note = "Hold to rise. Let go to glide.";
    } else if (ui.mode === "hunt") {
      var spots = [];
      for (var i = 0; i < 5; i++) spots.push({ i: i, x: 0.18 + Math.random() * 0.64, y: 0.2 + Math.random() * 0.55, found: false, hint: false });
      ui.hunt = { spots: spots, found: 0, first: !(st.best.hunt >= 5) };
      ui.note = "Five eggs are glowing. Tap them. A hint appears if you wait.";
      setTimeout(function () { if (ui && ui.hunt) { var left = ui.hunt.spots.filter(function (s) { return !s.found; })[0]; if (left) left.hint = true; paint(); } }, 7000);
    }
    paint();
  }
  function giveRibbon() {
    var d = selectedDragon();
    if (!d || !d.stage) { ui.note = "Hatch a dragon first. There is no rush."; ui.phase = "end"; paint(); return; }
    if ((st.ribbons[d.id] || 0) < d.wellness) st.ribbons[d.id] = d.wellness;
    st.best.fair = Math.max(st.best.fair || 0, d.wellness);
    var gained = earn(1);
    ui.phase = "end";
    ui.note = d.name + " receives a " + GLOW[d.wellness] + " ribbon and " + gained + " star. This is a celebration, not a ranking.";
    burst(viewW / 2, viewH / 2, "#ffcf6b", 24);
    chime();
    save(st); paint();
  }

  function mount(el) {
    unmount();
    root = el;
    if (root) root.classList.add("farm-app");
    try { soundOn = localStorage.getItem("starblade-farm-mute") !== "1"; } catch (e) { soundOn = true; }
    st = load();
    ui = { mode: "farm", panel: "", phase: "", selected: st.dragons[0] ? st.dragons[0].id : null, note: st.hello || st.note || "The meadow kept everyone safe." };
    var boot = function () { ready = true; paint(); startMusic(); };
    if (ready && imgs.bg) boot();
    else loadImages(boot);
  }
  function unmount() {
    cancelAnimationFrame(raf);
    raf = 0;
    stopMusic();
    drag = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (root) root.onclick = null;
    root = null; cv = null; ctx = null;
  }
  window.StarFarm = {
    mount: mount,
    unmount: unmount,
    pocket: pocket,
    counts: function () { return { species: SPECIES.length, stages: STAGE.length, rarities: 4, plants: Object.keys(CROPS).length, countries: PLACES.length }; }
  };
})();
