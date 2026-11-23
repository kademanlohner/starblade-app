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
  var quality = "high", frameTimes = [], lastStamp = 0, frameDt = 16, slowWindows = 0, fastWindows = 0;
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
    var jobs = [["bg", "farm/art/farm-bg.jpg"], ["morning", "farm/art/meadow-morning.jpg"], ["night", "farm/art/meadow-night.jpg"], ["map", "farm/art/world-map.jpg"], ["stage", "farm/art/fair-stage.png"], ["glideSky", "farm/art/glide-sky.jpg"], ["glideNear", "farm/art/glide-near.png"], ["flight", "farm/art/flight-andes.jpg"], ["crop0", "farm/art/crop-seed.png"], ["crop1", "farm/art/crop-sprout.png"], ["crop2", "farm/art/crop-leaf.png"], ["crop3", "farm/art/crop-harvest.png"]];
    SPECIES.forEach(function (id) { for (var i = 0; i < 5; i++) jobs.push(["s:" + id + ":" + i, "farm/art/" + id + "-" + i + ".png"]); });
    PLACES.forEach(function (p) { jobs.push(["land:" + p.id, "farm/art/land-" + p.id + ".jpg"]); });
    SPECIES.forEach(function (id) { jobs.push(["fly:" + id, "farm/art/fly-" + id + ".png"]); });
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
  function floatText(x, y, text) { pops.push({ x: x, y: y, sx: x, sy: y, tx: viewW * 0.55, ty: 22, text: text, life: 1 }); }

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
    var beds = st.plots.length, gap = 4, h = Math.max(78, viewH * 0.24), y = viewH - h - 8;
    var w = (viewW - 8 - gap * (beds - 1)) / beds;
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
    var sx = cell ? cell.x + cell.s / 2 : viewW / 2, sy = cell ? cell.y + cell.s / 2 : viewH / 2;
    burst(sx, sy, "#ffcf6b", 28);
    if (window.FarmFX) FarmFX.burst(sx, sy, 0xfff1b0, 32);
    ui.swirl = { x: sx, y: sy, t0: performance.now() };
    ui.pull = { ids: st.dragons.filter(function (x) { return x.species === d.species && x.stage === d.stage; }).map(function (x) { return x.id; }), x: sx, y: sy, t0: performance.now() };
    baby.boing = performance.now();
    baby.pop = performance.now();
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
  function meadowArt() {
    if (ui && ui.sky === "night" && imgs.night) return imgs.night;
    if (ui && ui.sky === "morning" && imgs.morning) return imgs.morning;
    return imgs.bg;
  }
  function drawCover(img) {
    if (!img) return;
    var ir = img.width / img.height, cr = viewW / viewH, dw, dh, dx, dy;
    if (ir > cr) { dh = viewH; dw = dh * ir; dx = (viewW - dw) / 2; dy = 0; }
    else { dw = viewW; dh = dw / ir; dx = 0; dy = (viewH - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  function skyFromClock() {
    var h = new Date().getHours();
    if (h >= 19 || h < 5) return "night";
    if (h < 10) return "morning";
    return "golden";
  }
  function easeOut(v) { v = v < 0 ? 0 : v > 1 ? 1 : v; return 1 - Math.pow(1 - v, 3); }
  function easeInOut(v) { v = v < 0 ? 0 : v > 1 ? 1 : v; return v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2; }
  function lerp(a, b, v) { return a + (b - a) * v; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  var scratch = null, scratchCtx = null;
  function blitLit(img, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (quality === "low" || !img) { ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); return; }
    if (!scratch) { scratch = document.createElement("canvas"); scratchCtx = scratch.getContext("2d"); }
    var w = Math.max(2, dw | 0), h = Math.max(2, dh | 0);
    if (scratch.width !== w || scratch.height !== h) { scratch.width = w; scratch.height = h; }
    var sky = (ui && ui.sky) || "golden";
    scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
    scratchCtx.clearRect(0, 0, w, h);
    scratchCtx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    scratchCtx.globalCompositeOperation = "source-atop";
    scratchCtx.fillStyle = sky === "night" ? "rgba(150,176,255,.30)" : sky === "morning" ? "rgba(255,250,236,.14)" : "rgba(255,164,60,.22)";
    scratchCtx.fillRect(0, 0, w, h);
    scratchCtx.globalCompositeOperation = "destination-over";
    var ox = sky === "night" ? -2 : 3, oy = sky === "night" ? 2 : -3;
    scratchCtx.globalAlpha = 0.85;
    scratchCtx.drawImage(img, sx, sy, sw, sh, ox, oy, w, h);
    scratchCtx.globalAlpha = 1;
    scratchCtx.globalCompositeOperation = "source-over";
    ctx.drawImage(scratch, dx, dy, dw, dh);
  }
  function drawCreature(d, x, y, size, t, ghost, tilt) {
    var img = sprite(d);
    if (ui && ui.pull && ui.pull.ids && ui.pull.ids.indexOf(d.id) >= 0) {
      var page = t - ui.pull.t0;
      if (page < 640) {
        var pk = Math.sin(Math.min(1, page / 640) * 3.1416);
        x += (ui.pull.x - x) * 0.45 * pk;
        y += (ui.pull.y - y) * 0.45 * pk;
      }
    }
    ctx.save();
    ctx.translate(x, y);
    var phase = d.phase || 0;
    var breathe = reduced() ? 0 : Math.sin(t / 480 + phase) * 0.045;
    var flutter = reduced() || !d.stage ? 0 : Math.sin(t / 140 + phase) * 0.035;
    var sway = reduced() ? 0 : Math.sin(t / 760 + phase) * 0.05;
    var hop = 0;
    if (!reduced() && d.stage && Math.sin(t / 980 + phase) > 0.985) hop = -size * 0.08;
    var eggWob = 0;
    if (!d.stage && !reduced()) eggWob = Math.sin(t / 180 + phase) * 0.09;
    if (ui && ui.hatch && ui.hatch.id === d.id) eggWob += Math.sin(t / 16) * 0.22;
    var squx = 1, squy = 1;
    if (d.pick && t - d.pick < 180) {
      var k = 1 - (t - d.pick) / 180;
      squx += 0.18 * k; squy -= 0.16 * k;
    }
    if (drag && drag.id === d.id) { squx *= 1.08; squy *= 0.9; }
    if (d.drop && t - d.drop < 320) {
      var u = (t - d.drop) / 320;
      var wave = Math.sin(u * 3.1416);
      squx += 0.16 * wave; squy -= 0.14 * wave;
    }
    if (d.pop && t - d.pop < 560) {
      var pu = (t - d.pop) / 560;
      var c = 1.45;
      var back = 1 + (c + 1) * Math.pow(pu - 1, 3) + c * Math.pow(pu - 1, 2);
      var pop = 0.25 + 0.75 * back;
      squx *= pop; squy *= pop;
    }
    if (d.boing && t - d.boing < 320) breathe += Math.sin((t - d.boing) / 40) * 0.08;
    var lift = hop < 0 ? -hop : 0;
    var shadowW = size * 0.24 * squx * (1 - Math.min(0.6, lift / (size * 0.55)));
    ctx.globalAlpha = 0.28 * (1 - Math.min(0.7, lift / (size * 0.7)));
    ctx.fillStyle = ui && ui.sky === "night" ? "rgba(8,10,30,.9)" : "rgba(48,28,12,.95)";
    ctx.beginPath();
    ctx.ellipse(0, size * 0.42, Math.max(5, shadowW), Math.max(2, size * 0.04 * squy), 0, 0, 6.2832);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.translate(0, hop);
    ctx.rotate((tilt || 0) + sway + eggWob);
    ctx.scale(squx * ((ghost ? 1.12 : 1) + flutter), squy * (1 + breathe));
    if (ghost) ctx.globalAlpha = 0.94;
    var night = ui && ui.sky === "night" && d.stage;
    if (night && quality === "high") {
      ctx.fillStyle = "rgba(186, 214, 255, .35)";
      ctx.beginPath();
      ctx.ellipse(0, size * 0.02, size * 0.34, size * 0.16, 0, 0, 6.2832);
      ctx.fill();
    }
    if (img) {
      var sc = (size * 0.9) / Math.max(img.width, img.height);
      var dw = img.width * sc, dh = img.height * sc;
      if (quality === "high" && d.stage) blitLit(img, 0, 0, img.width, img.height, -dw / 2, -dh / 2, dw, dh);
      else ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      if (!reduced() && Math.floor(t / 160 + phase) % 28 === 0 && d.stage) {
        ctx.fillStyle = "rgba(40,24,16,.55)";
        ctx.fillRect(-size * 0.06, -size * 0.2, size * 0.14, size * 0.028);
      }
    }
    ctx.restore();
  }
  function drawGrassTuft(x, y, w) {
    ctx.strokeStyle = ui && ui.sky === "night" ? "rgba(46, 78, 62, .9)" : "rgba(36, 112, 48, .92)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (var i = 0; i < 5; i++) {
      var gx = x + w * (0.18 + i * 0.15);
      var h = 10 + (i % 3) * 4;
      ctx.beginPath();
      ctx.moveTo(gx, y + 2);
      ctx.quadraticCurveTo(gx + (i - 2) * 2, y - h * 0.6, gx + (i % 2 ? 3 : -3), y - h);
      ctx.stroke();
    }
  }
  function drawCrop(plot, box, t) {
    var step = plot ? Math.max(0, Math.min(3, plot.step || 0)) : 0;
    var painted = imgs["crop" + step];
    if (painted) {
      var col = box.w;
      var w = col * 0.98;
      var h = w * painted.height / painted.width;
      var cap = viewH * 0.46;
      if (h > cap) { h = cap; w = h * painted.width / painted.height; }
      if (w > col) { w = col; h = w * painted.height / painted.width; }
      var sway = reduced() || quality === "low" ? 0 : Math.sin(t / 540 + box.i) * 0.035;
      ctx.save();
      ctx.translate(box.x + box.w / 2, viewH - 2);
      ctx.rotate(sway);
      ctx.drawImage(painted, -w / 2, -h, w, h);
      ctx.restore();
      return;
    }
    var x = box.x, y = box.y, w = box.w, h = box.h;
    var bedTop = y + h * 0.42;
    ctx.fillStyle = "#5c3318";
    round(x, bedTop, w, h - (bedTop - y), 8);
    ctx.fill();
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(x + 3, bedTop, w - 6, 6);
    ctx.fillStyle = "#3d2412";
    ctx.fillRect(x + 2, y + h - 7, w - 4, 5);
    var sx = x + 5, sy = bedTop + 8, sw = w - 10, sh = y + h - sy - 8;
    var soil = ctx.createLinearGradient(sx, sy, sx, sy + sh);
    soil.addColorStop(0, "#6b3e1c");
    soil.addColorStop(1, "#2c160c");
    ctx.fillStyle = soil;
    ctx.fillRect(sx, sy, sw, sh);
    for (var row = 0; row < 4; row++) {
      var yy = sy + 5 + row * Math.max(4, (sh - 8) / 4);
      ctx.strokeStyle = "#241008";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 2, yy);
      ctx.bezierCurveTo(sx + sw * 0.35, yy + 2.5, sx + sw * 0.65, yy - 2, sx + sw - 2, yy);
      ctx.stroke();
      ctx.strokeStyle = "rgba(214, 164, 110, .55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + 2, yy + 2);
      ctx.bezierCurveTo(sx + sw * 0.35, yy + 4, sx + sw * 0.65, yy, sx + sw - 2, yy + 2);
      ctx.stroke();
    }
    if (!plot) return;
    var c = CROPS[plot.crop] || { part: "seed" };
    var step = plot.step || 0;
    var cx = x + w / 2;
    var ground = bedTop + 2;
    function leaf(lx, ly, rx, ry, rot, color) {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(rot);
      ctx.fillStyle = color || "#2f9a45";
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, 6.3);
      ctx.fill();
      ctx.restore();
    }
    function stem(hgt) {
      ctx.strokeStyle = "#1c6b32";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, ground);
      ctx.lineTo(cx, ground - hgt);
      ctx.stroke();
    }
    if (step === 0) {
      ctx.fillStyle = "#f4e2b0";
      ctx.strokeStyle = "#8a6230";
      ctx.lineWidth = 1;
      for (var s = 0; s < 3; s++) {
        var seedX = sx + 8 + s * Math.max(8, (sw - 16) / 2);
        ctx.beginPath();
        ctx.ellipse(seedX, sy + sh * 0.45, 4, 2.6, 0.5, 0, 6.3);
        ctx.fill();
        ctx.stroke();
      }
      return;
    }
    if (step === 1) {
      stem(16);
      leaf(cx - 6, ground - 14, 6, 3.5, -0.8, "#b6e86a");
      leaf(cx + 6, ground - 13, 6, 3.5, 0.8, "#3aaa48");
      return;
    }
    stem(40);
    leaf(cx - 14, ground - 16, 12, 6, -0.5, "#1f8a3a");
    leaf(cx + 14, ground - 18, 12, 6, 0.5, "#46b85a");
    leaf(cx - 8, ground - 28, 10, 5, -0.2, "#167a32");
    leaf(cx + 9, ground - 30, 10, 5, 0.3, "#67d36a");
    leaf(cx, ground - 36, 8, 6, 0, "#2f9a45");
    if (step < 3) return;
    var food = c.part === "root" ? "#ff8a2a" : c.part === "tuber" ? "#e6c27a" : c.part === "leaf" ? "#8ed45a" : c.part === "fruit" ? "#e23d3d" : "#f2d48a";
    ctx.fillStyle = food;
    ctx.beginPath();
    if (c.part === "root") {
      ctx.moveTo(cx - 5, ground - 2);
      ctx.quadraticCurveTo(cx + 10, ground + 8, cx, ground + 18);
      ctx.quadraticCurveTo(cx - 12, ground + 6, cx - 5, ground - 2);
    } else if (c.part === "tuber") {
      ctx.ellipse(cx, ground + 6, 9, 6, 0.2, 0, 6.3);
    } else if (c.part === "leaf") {
      ctx.ellipse(cx, ground - 30, 11, 8, 0, 0, 6.3);
    } else {
      ctx.arc(cx + 10, ground - 26, Math.max(9, Math.min(13, w * 0.2)), 0, 6.3);
    }
    ctx.fill();
    ctx.strokeStyle = "rgba(80,30,10,.45)";
    ctx.stroke();
  }
  function drawBoard(t) {
    layout();
    board.forEach(function (b) {
      var d = dragonAt(b.i);
      var hint = d && kindCount(d) >= 3 && quality !== "low" && !reduced();
      ctx.fillStyle = hint ? "rgba(255,207,107," + (0.16 + Math.sin(t / 180 + b.i) * 0.1) + ")" : "rgba(255,255,255,.14)";
      round(b.x, b.y, b.s, b.s, 12);
      ctx.fill();
      if (hint) {
        ctx.strokeStyle = "#ffcf6b";
        ctx.lineWidth = 2;
        round(b.x + 3, b.y + 3, b.s - 6, b.s - 6, 10);
        ctx.stroke();
      }
      if (d && (!drag || drag.id !== d.id)) {
        drawCreature(d, b.x + b.s / 2, b.y + b.s / 2 + 4, b.s, t, false);
        if (d.stage && quality !== "low") drawGrassTuft(b.x, b.y + b.s - 8, b.s);
      }
      if (d && ui.selected === d.id) {
        ctx.strokeStyle = "#ffcf6b";
        ctx.lineWidth = 3;
        round(b.x + 2, b.y + 2, b.s - 4, b.s - 4, 12);
        ctx.stroke();
      }
    });
    plotsBox.forEach(function (b) { drawCrop(st.plots[b.i], b, t); });
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
      p.life -= 0.012;
      var u = 1 - Math.max(0, p.life);
      var cx = ((p.sx || p.x) + (p.tx || p.x)) / 2;
      var cy = Math.min(p.sy || p.y, p.ty || p.y) - 70;
      var x = (1 - u) * (1 - u) * (p.sx || p.x) + 2 * (1 - u) * u * cx + u * u * (p.tx || p.x);
      var y = (1 - u) * (1 - u) * (p.sy || p.y) + 2 * (1 - u) * u * cy + u * u * (p.ty || 20);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = "#ffcf6b";
      ctx.font = "700 22px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText(p.text, x, y);
    });
    ctx.globalAlpha = 1;
    pops = pops.filter(function (p) { return p.life > 0; });
  }
  function noteFrame(t) {
    if (lastStamp) {
      var dt = t - lastStamp;
      if (dt > 0 && dt < 48) {
        frameDt = dt;
        frameTimes.push(dt);
        if (frameTimes.length > 90) frameTimes.shift();
        if (frameTimes.length >= 60) {
          var sorted = frameTimes.slice().sort(function (a, b) { return a - b; });
          var p95 = sorted[Math.floor(sorted.length * 0.95)];
          if (p95 > 40) {
            fastWindows = 0;
            if (++slowWindows >= 2 && quality !== "low") {
              quality = quality === "high" ? "mid" : "low";
              slowWindows = 0;
              frameTimes = [];
            }
          } else if (p95 < 20) {
            slowWindows = 0;
            if (++fastWindows >= 3 && quality !== "high") {
              quality = quality === "low" ? "mid" : "high";
              fastWindows = 0;
              frameTimes = [];
            }
          } else { slowWindows = 0; fastWindows = 0; }
        }
      }
    }
    lastStamp = t;
  }
  function perfNow() {
    if (!frameTimes.length) return { fps: 0, minFps: 0, p95: 0, quality: quality, frames: 0 };
    var sum = 0, worst = 0;
    frameTimes.forEach(function (n) { sum += n; if (n > worst) worst = n; });
    var avg = sum / frameTimes.length;
    var sorted = frameTimes.slice().sort(function (a, b) { return a - b; });
    return { fps: Math.round(1000 / avg), minFps: Math.round(1000 / worst), p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 10) / 10, quality: quality, frames: frameTimes.length };
  }
  function drawLife(t) {
    if (reduced() || quality === "low") return;
    if (imgs.glideSky) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, viewW, viewH * 0.46);
      ctx.clip();
      ctx.globalAlpha = ui && ui.sky === "night" ? 0.12 : 0.22;
      var w = viewW * 1.35;
      var x = -((t * 0.01) % w);
      ctx.drawImage(imgs.glideSky, x, -viewH * 0.02, w, viewH * 0.55);
      ctx.drawImage(imgs.glideSky, x + w, -viewH * 0.02, w, viewH * 0.55);
      ctx.restore();
    }
    var birds = quality === "high" ? 3 : 1;
    for (var i = 0; i < birds; i++) {
      var bx = ((t * 0.03 + i * 140) % (viewW + 80)) - 40;
      var by = viewH * (0.12 + i * 0.06) + Math.sin(t / 400 + i) * 6;
      ctx.strokeStyle = "rgba(70,40,20,.75)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - 7, by);
      ctx.quadraticCurveTo(bx - 3, by - 5, bx, by);
      ctx.quadraticCurveTo(bx + 3, by - 5, bx + 7, by);
      ctx.stroke();
    }
    if (quality === "high") {
      for (var f = 0; f < 2; f++) {
        var fx = (viewW * 0.2 + f * 80 + Math.sin(t / 700 + f) * 24);
        var fy = viewH * 0.62 + Math.cos(t / 500 + f) * 16;
        var wing = Math.sin(t / 80 + f) * 5;
        ctx.fillStyle = f ? "rgba(255,190,80,.85)" : "rgba(190,140,255,.85)";
        ctx.beginPath();
        ctx.ellipse(fx - 4, fy, 5, 2 + wing * 0.15, -0.6, 0, 6.3);
        ctx.ellipse(fx + 4, fy, 5, 2 + wing * 0.15, 0.6, 0, 6.3);
        ctx.fill();
      }
    }
    ctx.strokeStyle = "rgba(120,190,230,.45)";
    ctx.lineWidth = 1.5;
    for (var p = 0; p < 3; p++) {
      var px = viewW * 0.12, py = viewH * 0.58, pr = 10 + ((t / 18 + p * 14) % 28);
      ctx.globalAlpha = 1 - pr / 40;
      ctx.beginPath();
      ctx.ellipse(px, py, pr, pr * 0.35, 0, 0, 6.3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawSkyWash() {
    var sky = (ui && ui.sky) || "golden";
    if (sky === "night" && imgs.night) return;
    if (sky === "morning" && imgs.morning) return;
    if (sky === "golden") return;
  }
  function drawSwirl(t) {
    if (!ui || !ui.swirl) return;
    var age = t - ui.swirl.t0;
    if (age > 1100) { ui.swirl = null; return; }
    if (age < 160) {
      ctx.fillStyle = "rgba(255, 248, 220, " + (0.72 - age / 220) + ")";
      ctx.fillRect(0, 0, viewW, viewH);
    }
    ctx.save();
    ctx.translate(ui.swirl.x, ui.swirl.y);
    ctx.rotate(age / 55);
    ctx.strokeStyle = "rgba(255, 246, 210, " + (1 - age / 1100) + ")";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 26 + age / 7, 0.4, 5.2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 140, 40, " + (1 - age / 1100) + ")";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 12 + age / 9, 1.2, 5.6);
    ctx.stroke();
    ctx.restore();
  }
  function frame(t) {
    if (!root || !st) return;
    noteFrame(t);
    var next = root.querySelector("canvas");
    if (!next) { raf = requestAnimationFrame(frame); return; }
    cv = next;
    ctx = cv.getContext("2d");
    var rect = cv.getBoundingClientRect();
    viewW = Math.max(280, rect.width || 360);
    viewH = Math.max(320, rect.height || 480);
    var cap = quality === "low" ? 1 : quality === "mid" ? 1.25 : 2;
    var budget = Math.sqrt(720000 / Math.max(1, viewW * viewH));
    var dpr = Math.min(cap, budget, window.devicePixelRatio || 1);
    if (dpr < 1) dpr = 1;
    if (cv.width !== Math.floor(viewW * dpr) || cv.height !== Math.floor(viewH * dpr)) {
      cv.width = Math.floor(viewW * dpr);
      cv.height = Math.floor(viewH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    if (drag && drag.tx != null) {
      drag.x += (drag.tx - drag.x) * 0.38;
      drag.y += (drag.ty - drag.y) * 0.38;
    }
    if (ui.mode === "glide" && ui.phase === "play") drawGlide(t);
    else if (ui.mode === "hunt" && ui.phase === "play") drawHunt(t);
    else if (ui.mode === "fair" && ui.phase === "play") drawFair(t);
    else if (ui.mode === "flight" && !ui.flightLanded) drawRoute(t);
    else if (ui.mode === "gallery") drawGallery(t);
    else {
      drawCover(meadowArt());
      if (ui.mode === "farm" || ui.mode === "hunt" || ui.mode === "fair") drawLife(t);
      var wash = ctx.createLinearGradient(0, 0, 0, viewH);
      wash.addColorStop(0, "rgba(255,210,120,.08)");
      wash.addColorStop(1, "rgba(0,0,0,.12)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, viewW, viewH);
      drawBoard(t);
      var haze = ctx.createLinearGradient(0, viewH * 0.78, 0, viewH);
      haze.addColorStop(0, "rgba(255,255,255,0)");
      haze.addColorStop(1, ui.sky === "night" ? "rgba(18,28,64,.28)" : ui.sky === "morning" ? "rgba(255,248,230,.2)" : "rgba(255,196,120,.2)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, viewH * 0.78, viewW, viewH * 0.22);
      if (drag) {
        var d = byId(drag.id);
        if (d) {
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.beginPath();
          ctx.ellipse(drag.x, drag.y + 36, 22, 6, 0, 0, 6.3);
          ctx.fill();
          drawCreature(d, drag.x, drag.y - 8, 96, t, true);
        }
      }
    }
    if (ui.mode === "hunt" && ui.phase === "play") drawLife(t);
    if (ui.mode === "fair" && ui.phase === "play") drawLife(t);
    drawSwirl(t);
    drawSkyWash();
    drawSparkles();
    if (ui.mode === "glide" && ui.phase === "play") stepGlide(t);
    if (window.FarmFX && FarmFX.step) {
      var stage = root.querySelector(".farm-stage");
      FarmFX.step(lastStamp ? 16 : 16, { quality: quality, sky: ui.sky, rect: stage ? stage.getBoundingClientRect() : null });
    }
    raf = requestAnimationFrame(frame);
  }

  function byId(id) { return st.dragons.filter(function (d) { return d.id === id; })[0]; }
  function selectedDragon() {
    var picked = byId(ui.selected);
    if (picked && picked.stage) return picked;
    return st.dragons.filter(function (d) { return d.stage > 0; })[0] || picked || st.dragons[0];
  }

  function hatch() {
    if (ui.hatch) return;
    var egg = st.dragons.filter(function (d) { return d.stage === 0; })[0];
    if (!egg) { ui.note = "No eggs are waiting. Everyone already here is safe."; paint(); return; }
    ui.hatch = { id: egg.id, t0: performance.now() };
    ui.note = "The shell is cracking.";
    var cell = board.filter(function (b) { return b.i === egg.slot; })[0];
    var hx = cell ? cell.x + cell.s / 2 : viewW / 2, hy = cell ? cell.y + cell.s / 2 : viewH * 0.4;
    burst(hx, hy, "#fff1c4", 18);
    setTimeout(function () {
      if (!st || !egg) return;
      egg.stage = 1;
      egg.wellness = Math.max(egg.wellness, 2);
      egg.boing = performance.now();
      ui.selected = egg.id;
      ui.hatch = null;
      ui.note = egg.name + " hatched. Wings, horns, and a tail, and the egg's friends stay.";
      burst(hx, hy, "#ffb15a", 36);
      if (window.FarmFX) FarmFX.burst(hx, hy, 0xffe0a0, 24);
      chime();
      save(st); paint();
    }, reduced() ? 0 : 460);
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
    d.boing = performance.now();
    burst(viewW / 2, viewH * 0.4, "#ffcf6b", 20);
    if (window.FarmFX) FarmFX.burst(viewW / 2, viewH * 0.35, 0xffe7a8, 18);
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
    drag = { id: d.id, x: p.x, y: p.y, tx: p.x, ty: p.y };
    d.pick = performance.now();
    ui.selected = d.id;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    e.preventDefault();
  }
  function onMove(e) { if (!drag || !cv) return; var p = localPoint(e); drag.tx = p.x; drag.ty = p.y; }
  function onUp(e) {
    if (!drag) return;
    var p = cv ? localPoint(e) : { x: 0, y: 0 };
    var cell = cellAt(p.x, p.y);
    var d = byId(drag.id);
    if (d) d.drop = performance.now();
    drag = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if (!d || !cell) return;
    var other = dragonAt(cell.i);
    if (!other) { d.slot = cell.i; d.boing = performance.now(); save(st); return; }
    if (other.id === d.id) return;
    if (other.species === d.species && other.stage === d.stage && kindCount(d) >= 3) { welcomeNext(d); paint(); return; }
    if (other.species === d.species && other.stage === d.stage) {
      ui.note = "These two match. One more of the same kind welcomes a bigger dragon. Both stay.";
      paint();
      return;
    }
    var tmp = d.slot; d.slot = other.slot; other.slot = tmp;
    d.boing = performance.now();
    other.boing = performance.now();
    save(st);
  }

  function ridge(shift, base, color, jag, step) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-40, viewH);
    for (var x = -40; x <= viewW + 40; x += step) {
      var n = Math.sin((x + shift) / 80) * jag + Math.sin((x + shift) / 31) * jag * 0.55;
      ctx.lineTo(x, base + n);
    }
    ctx.lineTo(viewW + 40, viewH);
    ctx.fill();
  }
  function puff(x, y, s) {
    ctx.fillStyle = "rgba(255, 246, 236, .92)";
    ctx.beginPath();
    ctx.arc(x, y, 18 * s, 0, 6.3);
    ctx.arc(x + 16 * s, y + 3, 14 * s, 0, 6.3);
    ctx.arc(x - 14 * s, y + 5, 12 * s, 0, 6.3);
    ctx.arc(x + 4 * s, y - 12 * s, 11 * s, 0, 6.3);
    ctx.fill();
  }
  function seedGlide(g) {
    if (g.seeded) return;
    g.seeded = true;
    g.x = viewW * 0.32;
    g.y = viewH * 0.2;
    g.clouds = [
      { x: viewW * 0.18, y: viewH * 0.12, s: 0.7 },
      { x: viewW * 0.62, y: viewH * 0.18, s: 1.05 },
      { x: viewW * 1.05, y: viewH * 0.1, s: 0.8 }
    ];
    g.rings = [
      { x: viewW * 0.5, y: viewH * 0.3, got: false },
      { x: viewW * 0.72, y: viewH * 0.46, got: false },
      { x: viewW * 0.9, y: viewH * 0.24, got: false }
    ];
    g.obstacles = [
      { x: viewW * 0.6, y: viewH * 0.74, s: 58, kind: "tree" },
      { x: viewW * 0.78, y: viewH * 0.4, s: 40, kind: "arch" },
      { x: viewW * 0.96, y: viewH * 0.78, s: 72, kind: "tree" }
    ];
  }
  function drawTree(x, y, s) {
    ctx.fillStyle = "#6b4224";
    ctx.fillRect(x - 4, y - s * 0.35, 8, s * 0.45);
    ctx.fillStyle = "#1c6b34";
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.55, y - s * 0.15);
    ctx.lineTo(x - s * 0.55, y - s * 0.15);
    ctx.fill();
    ctx.fillStyle = "#2f8a48";
    ctx.beginPath();
    ctx.arc(x, y - s * 0.55, s * 0.28, 0, 6.3);
    ctx.fill();
  }
  function drawArch(x, y) {
    ctx.strokeStyle = "#d7c4a2";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x - 26, y + 20);
    ctx.lineTo(x - 26, y - 10);
    ctx.quadraticCurveTo(x, y - 48, x + 26, y - 10);
    ctx.lineTo(x + 26, y + 20);
    ctx.stroke();
    ctx.strokeStyle = "#ffcf6b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y - 8, 16, 0, 6.3);
    ctx.stroke();
  }
  function drawPainted(img, shift, y, destW) {
    if (!img) return 0;
    var dw = destW;
    var dh = dw * img.height / img.width;
    var extra = Math.max(0, dw - viewW);
    var slide = reduced() ? 0 : Math.sin(shift / 90) * (extra / 2);
    ctx.drawImage(img, (viewW - dw) / 2 - slide, y, dw, dh);
    return dh;
  }
  function drawGlide(t) {
    var g = ui.glide;
    seedGlide(g);
    if (!g.rig) g.rig = { bank: -0.25, tail: 0, neck: 0, flap: 0, flapAmp: 1, rate: 0.0036, vy: 0, scrollV: 1, clouds: null, wind: null };
    g.rig.vy = g.vy || 0;
    g.rig.scrollV = 1.1;
    g.rig.flapAmp = g.landT ? 0.35 : 1;
    if (!g.born) g.born = t;
    ensureSkyBits(g.rig);
    drawFarRange((g.far || 0) * 8);
    drawSkyBits(g.rig, "back");
    if (imgs.glideNear && quality !== "low") {
      ctx.save();
      ctx.globalAlpha = 0.95;
      drawPainted(imgs.glideNear, g.near || 0, viewH * 0.28, viewW * 1.3);
      ctx.restore();
    }
    if (quality !== "low") {
      g.rings.forEach(function (r) {
        if (r.got) return;
        var glow = ctx.createRadialGradient(r.x, r.y, 2, r.x, r.y, 26);
        glow.addColorStop(0, "rgba(255,244,210,.95)");
        glow.addColorStop(1, "rgba(255,160,40,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 26, 0, 6.3);
        ctx.fill();
        ctx.fillStyle = "#6a3e1c";
        ctx.fillRect(r.x - 4, r.y - 18, 8, 12);
        ctx.fillStyle = "#ffcf6b";
        ctx.beginPath();
        ctx.arc(r.x, r.y - 4, 5, 0, 6.3);
        ctx.fill();
      });
    }
    if (g.dragon) {
      stepSprings(g.rig);
      drawFlyer(g.dragon, g.x, g.y, Math.min(150, viewW * 0.42), t, g.rig);
      if (quality !== "low") drawSkyBits(g.rig, "front");
      drawDustPuff(g.x, viewH * 0.78, g.dustT, t);
    }
    ctx.fillStyle = "#fff8e8";
    ctx.font = "700 22px Cinzel, serif";
    ctx.textAlign = "left";
    ctx.fillText("Lights " + g.score, 16, 36);
  }
  function stepGlide(t) {
    var g = ui.glide;
    if (!g || g.done) return;
    if (!g.t0) g.t0 = t;
    var dt = Math.min(32, t - (g.last || t));
    g.last = t;
    if (!g.born) g.born = t;
    if (g.landT) {
      var lp = clamp((t - g.landT) / 1200, 0, 1);
      var ny = lerp(g.landFrom, viewH * 0.74, easeInOut(lp));
      g.vy = (ny - g.y) / Math.max(1, dt);
      g.y = ny;
      g.scrollV = 0.2;
      if (lp > 0.8 && !g.dustT) g.dustT = t;
      if (lp >= 1) endGlide();
      return;
    }
    if (t - g.born < 980) {
      var p = (t - g.born) / 980;
      if (p < 0.28) {
        g.y = viewH * 0.72 + easeInOut(p / 0.28) * 8;
        g.vy = 0.1;
        if (!g.dustT) g.dustT = t;
      } else {
        var u = easeOut((p - 0.28) / 0.72);
        var ny = lerp(viewH * 0.74, viewH * 0.24, u);
        g.vy = (ny - g.y) / Math.max(1, dt);
        g.y = ny;
      }
      g.far += 0.02 * dt; g.mid += 0.04 * dt; g.near += 0.05 * dt;
      return;
    }
    if (g.hold) g.vy -= 0.00045 * dt;
    g.vy += 0.00016 * dt;
    g.vy *= 0.992;
    g.y += g.vy * dt;
    if (g.y < 72) { g.y = 72; g.vy = 0; }
    if (g.y > viewH * 0.4) { g.y = viewH * 0.4; g.vy = 0; }
    g.rings.forEach(function (r) {
      r.x -= 0.16 * dt;
      if (!r.got && Math.abs(r.x - g.x) < 24 && Math.abs(r.y - g.y) < 26) {
        r.got = true; g.score++; burst(r.x, r.y, "#ffcf6b", 10); floatText(r.x, r.y, "+1"); tone(740, 0, 0.08, "sine", 0.03);
      }
    });
    g.far += 0.02 * dt; g.mid += 0.04 * dt; g.near += 0.035 * dt;
    if (quality !== "low" && !reduced() && Math.random() < 0.4) burst(g.x - 28, g.y + 6, "#ffd89a", 1);
    g.clouds.forEach(function (c) { c.x -= 0.05 * dt; });
    g.obstacles.forEach(function (o) {
      o.x -= 0.16 * dt;
      if (Math.abs(o.x - g.x) < 28 && Math.abs(o.y - g.y) < 36) g.vy *= 0.4;
    });
    g.rings = g.rings.filter(function (r) { return r.x > -40; });
    g.clouds = g.clouds.filter(function (c) { return c.x > -60; });
    g.obstacles = g.obstacles.filter(function (o) { return o.x > -80; });
    if (t - g.spawn > 700) {
      g.spawn = t;
      var lane = 70 + Math.random() * (viewH * 0.55);
      g.rings.push({ x: viewW + 30, y: lane, got: false });
      g.clouds.push({ x: viewW + 10, y: 30 + Math.random() * (viewH * 0.35) });
      g.obstacles.push({ x: viewW + 80, y: viewH * 0.62 + Math.random() * 40, s: 36 + Math.random() * 20, kind: Math.random() < 0.65 ? "tree" : "arch" });
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
    ui.note = "You flew the whole way and earned " + gained + (gained === 1 ? " star." : " stars.") + " Clouds only slow you. Stars now: " + st.stars + ".";
    chime();
    save(st);
    paint();
  }
  function drawHunt(t) {
    drawCover(imgs.bg);
    ctx.fillStyle = "rgba(16, 10, 28, .55)";
    round(viewW / 2 - 90, 10, 180, 56, 14);
    ctx.fill();
    ctx.fillStyle = "#fff8e8";
    ctx.font = "700 24px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.fillText("Egg garden", viewW / 2, 34);
    ctx.font = "600 15px Lexend, sans-serif";
    ctx.fillText((ui.hunt ? ui.hunt.found : 0) + " of 5", viewW / 2, 54);
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
    drawCover(meadowArt());
    if (imgs.stage) {
      var sw = viewW * 0.96;
      var sh = sw * imgs.stage.height / imgs.stage.width;
      var sy = viewH - sh + viewH * 0.02;
      ctx.drawImage(imgs.stage, (viewW - sw) / 2, sy, sw, sh);
    }
    var d = selectedDragon();
    if (d) drawCreature(d, viewW * 0.52, viewH * 0.7, Math.min(viewW, viewH) * 0.3, t, false);
    ctx.fillStyle = "rgba(16, 10, 28, .55)";
    round(viewW / 2 - 100, 8, 200, 36, 12);
    ctx.fill();
    ctx.fillStyle = "#fff6df";
    ctx.font = "700 24px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.fillText("Harvest fair", viewW / 2, 33);
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

  function ico(name) {
    var d = {
      back: '<path d="M15 5 L7 12 L15 19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
      sun: '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      moon: '<path d="M15 3.2a7.6 7.6 0 1 0 5.6 12.6A6.4 6.4 0 0 1 15 3.2z" fill="currentColor"/>',
      sound: '<path d="M4 10h3.5L13 6v12l-5.5-4H4z" fill="currentColor"/><path d="M16 9.2a4 4 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      quiet: '<path d="M4 10h3.5L13 6v12l-5.5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      egg: '<ellipse cx="12" cy="13.5" rx="6" ry="7.5" fill="currentColor"/>',
      snack: '<path d="M4 15c1.5-6 14.5-6 16 0v2H4z" fill="currentColor"/>',
      merge: '<path d="M6 17l6-10 6 10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>',
      water: '<path d="M12 3.2S18 10 18 14.2a6 6 0 0 1-12 0C6 10 12 3.2 12 3.2z" fill="currentColor"/>',
      basket: '<path d="M5 10h14l-1.4 9H6.4z" fill="currentColor"/><path d="M8 10c0-3.2 8-3.2 8 0" fill="none" stroke="currentColor" stroke-width="2"/>',
      sprout: '<path d="M12 21V11" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 13C8 12 6 8 7 5c4 .2 6 4 5 8zM12 12c4-1 6-5 5-8-4 .2-6 4-5 8z" fill="currentColor"/>',
      wing: '<path d="M3 14c5-8 13-9 18-3-6 1-11 4-13 8-1.6-1.6-3.4-3.4-5-5z" fill="currentColor"/>',
      play: '<path d="M8 5.2l11 6.8-11 6.8z" fill="currentColor"/>',
      pin: '<path d="M12 21s6.5-6.2 6.5-11A6.5 6.5 0 0 0 5.5 10C5.5 14.8 12 21 12 21z" fill="currentColor"/><circle cx="12" cy="10" r="2.1" fill="#3a2412"/>',
      home: '<path d="M4 11.5 L12 5 L20 11.5 V20 H4 Z" fill="currentColor"/>',
      kinds: '<circle cx="8" cy="12" r="3" fill="currentColor"/><circle cx="16" cy="12" r="3" fill="currentColor"/>'
    }[name] || "";
    return '<svg class="farm-ico" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  }
  function btn(cls, act, iconName, label, id) {
    return '<button class="farm-btn' + (cls ? " " + cls : "") + '"' + (id ? ' id="' + id + '"' : "") + ' data-farm="' + act + '">' + ico(iconName) + "<span>" + label + "</span></button>";
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
    var skyIcon = ui.sky === "night" ? "moon" : "sun";
    var head = '<div class="farm-top"><div><h2>' + title() + '</h2><p>' + st.dragons.length + " dragons · farm stars " + (st.stars || 0) + " · pantry " + pantryCount() + '</p></div><div class="farm-row">' + btn("", "back", "back", "Back") + btn("", "sky", skyIcon, skyWord()) + btn("", "mute", soundOn ? "sound" : "quiet", soundOn ? "Sound on" : "Sound off") + "</div></div>";
    if (ui.mode === "flight") return flightHtml(head);
    if (ui.mode === "gallery") return head + '<div class="farm-stage"><canvas aria-label="Dragon kinds"></canvas></div><p class="farm-note">Six kinds, from baby to elder. Eggs are the start. Elders wear a brighter trim. Rarity is a glow, not a rank against anyone.</p>' + btn("", "home", "home", "Back to the meadow");
    if (ui.phase === "start") return head + card(ui.mode) + btn("gold", "begin", "play", "Begin") + btn("", "home", "home", "Not now");
    if (ui.phase === "end") return head + '<article class="farm-card"><p class="farm-kicker">' + esc(title()) + " · Stars earned</p><h3>" + esc(ui.note) + '</h3><p>Stars only go up. You have ' + st.stars + ' farm stars.</p>' + btn("gold", "again", "play", "Play again") + btn("", "home", "home", "Back to the meadow") + "</article>";
    if (ui.mode === "glide" && ui.phase === "play") return head + '<div class="farm-stage"><canvas aria-label="Lantern glide"></canvas></div><p class="farm-note">Hold to rise. Let go to glide. Each light you pass adds a star at the end.</p><div class="farm-row">' + btn("gold", "rise", "wing", "Hold to rise", "farm-rise") + btn("", "glide-end", "pin", "Land softly") + "</div>";
    if (ui.mode === "hunt" && ui.phase === "play") return head + '<div class="farm-stage"><canvas aria-label="Egg garden"></canvas></div><p class="farm-note">Tap each glowing egg in the meadow. ' + (ui.hunt ? ui.hunt.found : 0) + ' of 5 found. Take your time.</p>';
    if (ui.mode === "fair" && ui.phase === "play") return head + '<div class="farm-stage"><canvas aria-label="Harvest fair"></canvas></div><p class="farm-note">One dragon, one ribbon. This is a celebration, not a race.</p><div class="farm-row">' + btn("gold", "ribbon", "pin", "Give the ribbon") + "</div>";
    var garden = ui.panel === "garden" ? '<div class="farm-sheet"><p class="farm-kicker">Plant a seed</p><p>' + esc(LESSON) + '</p><div class="farm-row">' + Object.keys(CROPS).filter(function (id) { return st.found[id]; }).map(function (id) { return '<button class="farm-btn" data-farm="plant:' + id + '">' + esc(CROPS[id].name) + " " + (st.seeds[id] || 0) + "</button>"; }).join("") + "</div></div>" : "";
    var fly = ui.panel === "fly" ? '<div class="farm-sheet"><p class="farm-kicker">Seed flights</p><p>Each landing shows the land and pockets seeds. Seeds are never taken back.</p><div class="farm-row">' + PLACES.map(function (p) { return btn("", "place:" + p.id, "pin", esc(p.name)); }).join("") + "</div></div>" : "";
    var play = ui.panel === "play" ? '<div class="farm-sheet"><p class="farm-kicker">Play</p><div class="farm-row">' + btn("gold", "glide", "wing", "Lantern glide") + btn("gold", "hunt", "egg", "Egg garden") + btn("gold", "fair", "pin", "Harvest fair") + "</div></div>" : "";
    return head
      + '<div class="farm-stage"><canvas aria-label="Dragon farm meadow"></canvas></div>'
      + '<p class="farm-note">' + esc(ui.note || "Drag a dragon onto a match. Water the soil. Everyone stays.") + "</p>"
      + '<div class="farm-row">'
      + btn("gold", "hatch", "egg", "Warm an egg")
      + btn("gold", "feed", "snack", "Share a snack")
      + btn("gold", "merge", "merge", "Welcome a bigger one")
      + btn("", "water", "water", "Water")
      + btn("", "harvest", "basket", "Gather")
      + btn("", "panel:garden", "sprout", "Plant")
      + btn("", "panel:fly", "wing", "Fly")
      + btn("", "panel:play", "play", "Play")
      + btn("", "gallery", "kinds", "Kinds")
      + "</div>" + garden + fly + play;
  }
  function skyWord() {
    return { morning: "Morning", golden: "Golden hour", night: "Starry night" }[ui && ui.sky] || "Golden hour";
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
  function drawGlobe(cx, cy, rad) {
    var globe = ctx.createRadialGradient(cx - rad * 0.35, cy - rad * 0.35, rad * 0.15, cx, cy, rad);
    globe.addColorStop(0, "#d7f1ff");
    globe.addColorStop(0.45, "#3e9a5c");
    globe.addColorStop(1, "#174e86");
    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, 6.3);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rad * 0.95, rad * 0.28, 0, 0, 6.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rad * 0.32, rad * 0.95, 0, 0, 6.3);
    ctx.stroke();
  }
  function peak(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.7, y + s * 0.35);
    ctx.lineTo(x - s * 0.7, y + s * 0.35);
    ctx.fill();
  }
  var ROUTE = {
    mexico: [0.2, 0.46], peru: [0.24, 0.62], italy: [0.48, 0.4],
    ethiopia: [0.54, 0.56], india: [0.66, 0.48], china: [0.76, 0.4], australia: [0.82, 0.64]
  };
  var FLAP_ORDER = [0, 1, 3, 2];
  function flapFrame(phase) {
    var p = phase - Math.floor(phase);
    var e = easeInOut(p);
    return FLAP_ORDER[Math.min(3, Math.floor(e * 4))];
  }
  function drawFlyer(d, x, y, size, t, rig) {
    if (!d) return;
    var sheet = d.stage ? imgs["fly:" + d.species] : null;
    if (!sheet) { drawCreature(d, x, y, size, t, false, rig ? rig.bank : -0.35); return; }
    var amp = rig && rig.flapAmp != null ? rig.flapAmp : 1;
    var rate = (rig && rig.rate) || 0.0031;
    if (rig) rig.flap = (rig.flap || 0) + frameDt * rate * (0.45 + amp);
    var frame = amp < 0.22 ? 1 : flapFrame(rig ? rig.flap : t * 0.003);
    var fw = sheet.width / 4, fh = sheet.height;
    var cycle = ((rig && rig.flap) || 0) % 1;
    var bob = Math.sin(cycle * 6.2832) * size * 0.055 * amp;
    var bank = rig ? rig.bank : -0.25;
    var tail = rig ? rig.tail : 0;
    var neck = rig ? rig.neck : 0;
    var lift = frame === 3 ? 0.07 : frame === 0 ? -0.05 : 0;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.rotate(bank + neck);
    ctx.transform(1, tail, 0, 1, 0, 0);
    var sc = (size * (rig && rig.squish > 0 ? 1 - rig.squish * 0.12 : 1)) / Math.max(fw, fh);
    var dw = fw * sc * (1 - lift), dh = fh * sc * (1 + lift * 1.4);
    blitLit(sheet, frame * fw, 0, fw, fh, -dw / 2, -dh * 0.62, dw, dh);
    ctx.restore();
    if (rig && quality !== "low" && amp > 0.4 && !reduced() && (frameDt && Math.floor(t / 40) !== Math.floor((t - frameDt) / 40))) {
      sparks.push({ x: x - size * 0.42, y: y + bob, vx: -1.4, vy: (Math.random() - 0.4) * 0.4, life: 0.7, color: ui && ui.sky === "night" ? "rgba(190,210,255,.85)" : "rgba(255,214,150,.8)", size: 3 });
    }
  }
  function stepSprings(rig) {
    var target = clamp((rig.vy || 0) * 0.85 - 0.2, -0.62, 0.48);
    rig.bank += (target - rig.bank) * 0.14;
    var tailAim = -(rig.vy || 0) * 0.35 - rig.bank * 0.45;
    rig.tail += (tailAim - rig.tail) * 0.07;
    rig.neck += (-rig.bank * 0.22 - rig.neck) * 0.1;
  }
  function paintCloud(c, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    var sky = (ui && ui.sky) || "golden";
    ctx.fillStyle = sky === "night" ? "rgba(232, 228, 255, .95)" : sky === "morning" ? "rgba(255, 250, 245, .95)" : "rgba(255, 236, 214, .95)";
    var s = c.s;
    ctx.beginPath();
    ctx.arc(c.x, c.y, s * 0.42, 0, 6.2832);
    ctx.arc(c.x - s * 0.38, c.y + s * 0.08, s * 0.32, 0, 6.2832);
    ctx.arc(c.x + s * 0.36, c.y + s * 0.06, s * 0.28, 0, 6.2832);
    ctx.arc(c.x - s * 0.08, c.y - s * 0.22, s * 0.26, 0, 6.2832);
    ctx.arc(c.x + s * 0.12, c.y + s * 0.16, s * 0.3, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  }
  function ensureSkyBits(rig) {
    if (rig.clouds) return;
    rig.clouds = [];
    var n = quality === "low" ? 5 : 11;
    for (var i = 0; i < n; i++) {
      var layer = i % 3;
      rig.clouds.push({
        x: Math.random() * viewW * 2.4,
        y: viewH * (layer === 2 ? 0.55 + Math.random() * 0.3 : 0.06 + Math.random() * 0.48),
        s: layer === 2 ? 18 + Math.random() * 16 : 26 + Math.random() * 28,
        layer: layer
      });
    }
    rig.wind = [];
    for (var w = 0; w < (quality === "high" ? 9 : 0); w++) rig.wind.push({ x: Math.random() * viewW, y: Math.random() * viewH * 0.8, len: 16 + Math.random() * 36 });
  }
  function drawSkyBits(rig, which) {
    if (!rig.clouds) return;
    var speed = (rig.scrollV || 0) * frameDt;
    rig.clouds.forEach(function (c) {
      var front = c.layer === 2;
      var par = c.layer === 0 ? 0.28 : c.layer === 1 ? 0.62 : 1.15;
      if (which === "back") {
        c.x -= speed * par;
        if (c.x < -c.s * 2) c.x += viewW * 2.4;
      }
      if ((which === "back" && front) || (which === "front" && !front)) return;
      paintCloud(c, front ? 0.42 : c.layer === 0 ? 0.28 : 0.4);
    });
    if (which === "front" && rig.wind) {
      ctx.strokeStyle = ui && ui.sky === "night" ? "rgba(210,220,255,.35)" : "rgba(255,255,255,.45)";
      ctx.lineWidth = 1.5;
      rig.wind.forEach(function (w) {
        w.x -= speed * 1.8;
        if (w.x < -40) { w.x = viewW + 20; w.y = Math.random() * viewH * 0.75; }
        ctx.beginPath();
        ctx.moveTo(w.x, w.y);
        ctx.lineTo(w.x + w.len, w.y + 2);
        ctx.stroke();
      });
    }
  }
  function panCover(img, zoom, panX, panY) {
    var z = zoom < 1.08 ? 1.08 : zoom;
    var ir = img.width / img.height, cr = viewW / Math.max(1, viewH), dw, dh;
    if (ir > cr) { dh = viewH * z; dw = dh * ir; }
    else { dw = viewW * z; dh = dw / ir; }
    var px = clamp(panX, 0.1, 0.9), py = clamp(panY, 0.1, 0.9);
    return { x: -(dw - viewW) * px, y: -(dh - viewH) * py, w: dw, h: dh };
  }
  var fadeScratch = null;
  function blitSoft(img, rect, topFade, alpha) {
    if (!img) return;
    if (!fadeScratch) fadeScratch = document.createElement("canvas");
    var w = Math.max(2, viewW | 0), h = Math.max(2, viewH | 0);
    if (fadeScratch.width !== w || fadeScratch.height !== h) { fadeScratch.width = w; fadeScratch.height = h; }
    var g = fadeScratch.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, w, h);
    g.drawImage(img, rect.x, rect.y, rect.w, rect.h);
    if (topFade > 0) {
      g.globalCompositeOperation = "destination-in";
      var grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(topFade * 0.4, "rgba(0,0,0,.45)");
      grad.addColorStop(topFade, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = "source-over";
    }
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(fadeScratch, 0, 0, viewW, viewH);
    ctx.restore();
  }
  function drawFarRange(scroll) {
    var sky = (ui && ui.sky) || "golden";
    var g = ctx.createLinearGradient(0, 0, 0, viewH);
    if (sky === "night") { g.addColorStop(0, "#070b22"); g.addColorStop(0.55, "#1a2458"); g.addColorStop(1, "#121a38"); }
    else if (sky === "morning") { g.addColorStop(0, "#8ebbe6"); g.addColorStop(0.5, "#f6e2c4"); g.addColorStop(1, "#d5e4c8"); }
    else { g.addColorStop(0, "#e8894a"); g.addColorStop(0.45, "#f6d7a2"); g.addColorStop(1, "#f0c27a"); }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, viewW, viewH);
    var img = imgs.glideSky;
    if (!img) return;
    var wave = 0.5 + Math.sin(scroll * 0.003) * 0.22;
    var rect = panCover(img, 1.4, wave, 0.35);
    ctx.save();
    ctx.globalAlpha = sky === "night" ? 0.38 : sky === "morning" ? 0.72 : 0.9;
    ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
  }
  function drawDustPuff(x, y, t0, t) {
    if (!t0) return;
    var age = t - t0;
    if (age < 0 || age > 680) return;
    var u = age / 680;
    ctx.fillStyle = "rgba(164, 122, 74, " + (0.4 * (1 - u)) + ")";
    ctx.beginPath();
    ctx.ellipse(x - 18 - u * 36, y, 8 + u * 18, 4 + u * 2, 0, 0, 6.2832);
    ctx.ellipse(x + 14 + u * 32, y + 2, 7 + u * 14, 3.5, 0, 0, 6.2832);
    ctx.fill();
  }
  function drawLandmark(scroll, approach) {
    var place = ui.flightPlace;
    var img = place && imgs["land:" + place.id];
    if (!img || approach <= 0.02) return;
    var pan = 0.5 + Math.sin(scroll * 0.0022) * 0.18;
    var rect = panCover(img, 1.28, pan, 0.55);
    blitSoft(img, rect, 0.46, Math.min(1, approach));
  }
  function freshAir() {
    var d = selectedDragon();
    return {
      phase: "takeoff", t0: performance.now(), dragon: d,
      x: viewW * 0.36, y: viewH * 0.74, vy: 0, bank: 0.05, tail: 0, neck: 0,
      flap: 0, flapAmp: 0.15, rate: 0.0042, scroll: 0, scrollV: 0, zoom: 1,
      camX: viewW * 0.36, camY: viewH * 0.74, squish: 0, dustT: 0, y0: viewH * 0.74
    };
  }
  function drawRoute(t) {
    if (reduced()) { drawCover(imgs.map || imgs.bg); return; }
    if (!ui.air) ui.air = freshAir();
    var rig = ui.air;
    var elapsed = t - rig.t0;
    if (rig.phase === "takeoff") {
      var p = clamp(elapsed / 1500, 0, 1);
      var ground = viewH * 0.74;
      if (p < 0.26) {
        rig.y = ground + easeInOut(p / 0.26) * 12;
        rig.vy = 0.15;
        rig.flapAmp = 0.12;
        rig.squish = easeInOut(p / 0.26);
        rig.rate = 0.002;
      } else if (p < 0.64) {
        var u = easeOut((p - 0.26) / 0.38);
        var ny = lerp(ground + 12, viewH * 0.4, u);
        rig.vy = (ny - rig.y) / Math.max(1, frameDt);
        rig.y = ny;
        rig.flapAmp = 1;
        rig.squish = -0.18 * (1 - u);
        rig.rate = 0.0052;
        if (!rig.dustT) rig.dustT = t;
      } else {
        rig.vy = (viewH * 0.4 - rig.y) / 80;
        rig.y += (viewH * 0.4 - rig.y) * 0.12;
        rig.flapAmp = 1;
        rig.squish = 0;
        rig.scrollV += (1.15 - rig.scrollV) * 0.08;
      }
      rig.x += (viewW * 0.46 - rig.x) * 0.06;
      if (p >= 1) { rig.phase = "cruise"; rig.t0 = t; rig.dustT = 0; }
    } else if (rig.phase === "landing") {
      var lp = clamp(elapsed / 1500, 0, 1);
      var e = easeInOut(lp);
      var ny = lerp(rig.y0, viewH * 0.76, e);
      rig.vy = (ny - rig.y) / Math.max(1, frameDt);
      rig.y = ny;
      rig.flapAmp = 1 - e * 0.72;
      rig.rate = 0.0022;
      rig.scrollV += (0.12 - rig.scrollV) * 0.12;
      rig.x += (viewW * 0.42 - rig.x) * 0.05;
      if (lp > 0.78) {
        rig.squish = (lp - 0.78) / 0.22;
        if (!rig.touch) { rig.touch = t; rig.dustT = t; }
      }
      if (lp >= 1 && !ui.flightLanded) { ui.flightLanded = true; ui.flightPhase = "landed"; paint(); return; }
    } else {
      var aim = viewH * (0.38 + Math.sin(t / 1300) * 0.055);
      var prev = rig.y;
      rig.y += (aim - rig.y) * 0.07;
      rig.vy = (rig.y - prev) / Math.max(1, frameDt);
      rig.x += (viewW * 0.48 - rig.x) * 0.05;
      rig.flapAmp = 1;
      rig.rate = 0.0034;
      rig.scrollV += (1.25 - rig.scrollV) * 0.04;
      rig.squish = 0;
    }
    rig.scroll += rig.scrollV * frameDt;
    stepSprings(rig);
    rig.camX += (rig.x - rig.camX) * 0.08;
    rig.camY += (rig.y - rig.camY) * 0.08;
    var wantZ = rig.phase === "landing" ? 1.14 : rig.phase === "takeoff" ? 1.04 : 1.08;
    rig.zoom += (wantZ - (rig.zoom || 1)) * 0.06;
    ensureSkyBits(rig);
    var skyMix = 1;
    if (rig.phase === "takeoff") skyMix = clamp((elapsed / 1500 - 0.42) / 0.4, 0, 1);
    if (rig.phase === "takeoff" && skyMix < 1) drawCover(meadowArt());
    if (skyMix > 0) {
      ctx.save();
      ctx.globalAlpha = skyMix;
      drawFarRange(rig.scroll);
      var approach = rig.phase === "cruise" ? clamp((t - rig.t0 - 400) / 1600, 0, 1) : rig.phase === "landing" ? 1 : 0;
      drawLandmark(rig.scroll * 1.4, approach);
      if (quality !== "low") drawSkyBits(rig, "back");
      ctx.restore();
    }
    ctx.save();
    ctx.translate(viewW * 0.46 - rig.camX, viewH * 0.4 - rig.camY);
    drawDustPuff(rig.x, rig.phase === "takeoff" ? viewH * 0.8 : rig.y + 70, rig.dustT, t);
    var flyer = rig.dragon && rig.dragon.stage ? rig.dragon : selectedDragon();
    drawFlyer(flyer, rig.x, rig.y, Math.min(viewW, viewH) * 0.38, t, rig);
    ctx.restore();
    if (skyMix > 0.35 && quality !== "low") drawSkyBits(rig, "front");
    if (ui.flightPlace) {
      ctx.fillStyle = "rgba(16, 12, 28, .55)";
      round(12, 12, Math.min(240, viewW - 24), 36, 12);
      ctx.fill();
      ctx.fillStyle = "#fff8e8";
      ctx.font = "700 20px Cinzel, serif";
      ctx.textAlign = "left";
      var word = rig.phase === "takeoff" ? "Lifting off" : rig.phase === "landing" ? "Coming in" : ui.flightPlace.name;
      ctx.fillText(word, 24, 36);
    }
  }
  function flightHtml(head) {
    var p = ui.flightPlace;
    var img = imgs["land:" + p.id];
    if (!ui.flightLanded) return head + '<div class="farm-stage"><canvas aria-label="Flight to ' + esc(p.name) + '"></canvas></div><p class="farm-note">Wings up, then down. The land of ' + esc(p.name) + ' comes closer. Land when you want the seeds.</p>' + btn("gold", "arrive", "pin", "Land in " + esc(p.name));
    return head + '<article class="farm-card">' + (img ? '<img alt="The lands of ' + esc(p.name) + '" src="farm/art/land-' + p.id + '.jpg">' : "") + '<p class="farm-kicker">Seed card</p><h3>' + esc(p.name) + "</h3><p>" + esc(p.fact) + '</p>' + btn("gold", "pocket", "basket", "Pocket the seeds") + "</article>";
  }

  function bind() {
    root.onclick = function (e) {
      var el = e.target.closest("[data-farm]");
      if (!el) return;
      act(el.getAttribute("data-farm"));
    };
    cv = root.querySelector("canvas");
    var stage = root.querySelector(".farm-stage");
    if (stage && ui) stage.setAttribute("data-sky", ui.sky || "golden");
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
    if (name === "sky") {
      var order = ["morning", "golden", "night"];
      ui.sky = order[(order.indexOf(ui.sky) + 1) % 3];
      try { localStorage.setItem("starblade-farm-sky", ui.sky); } catch (e) {}
      paint();
      return;
    }
    if (name.indexOf("panel:") === 0) { ui.panel = name.slice(6); ui.mode = "farm"; ui.phase = ""; paint(); return; }
    if (name === "hatch") return hatch();
    if (name === "feed") return feed();
    if (name === "merge") return mergeButton();
    if (name === "water") return water();
    if (name === "harvest") return harvest();
    if (name.indexOf("plant:") === 0) return plant(name.slice(6));
    if (name === "gallery") { ui.mode = "gallery"; ui.panel = ""; paint(); return; }
    if (name.indexOf("place:") === 0) return openFlight(name.slice(6));
    if (name === "arrive") {
      if (ui.flightLanded) return;
      if (!ui.air) { ui.flightLanded = true; paint(); return; }
      if (ui.air.phase === "landing") return;
      ui.air.phase = "landing";
      ui.air.t0 = performance.now();
      ui.air.y0 = ui.air.y;
      ui.air.dustT = 0;
      ui.air.touch = 0;
      return;
    }
    if (name === "pocket") { pocket(ui.flightPlace.id); ui.mode = "farm"; ui.panel = "garden"; ui.note = st.note; paint(); return; }
    if (name === "glide" || name === "hunt" || name === "fair") { ui.mode = name; ui.phase = "start"; ui.panel = ""; paint(); return; }
    if (name === "begin" || name === "again") return beginPlay();
    if (name === "glide-end") {
      if (ui.glide && !ui.glide.done && !ui.glide.landT) { ui.glide.landT = performance.now(); ui.glide.landFrom = ui.glide.y; ui.glide.dustT = 0; return; }
      return endGlide();
    }
    if (name === "ribbon") return giveRibbon();
    if (name === "bed") return addBed();
  }
  function openFlight(id) {
    var p = placeBy(id);
    if (!p) return;
    ui.mode = "flight";
    ui.flightPlace = p;
    ui.flightLanded = !!reduced();
    ui.flightPhase = ui.flightLanded ? "landed" : "takeoff";
    ui.air = null;
    ui.panel = "";
    paint();
  }
  function beginPlay() {
    ui.phase = "play";
    if (ui.mode === "glide") {
      var d = selectedDragon() || st.dragons[0];
      ui.glide = { x: 110, y: 150, vy: 0, hold: false, score: 0, rings: [], clouds: [], obstacles: [], far: 0, mid: 0, near: 0, spawn: 0, t0: 0, last: 0, done: false, dragon: d };
      ui.note = "Hold to rise. Let go to glide.";
    } else if (ui.mode === "hunt") {
      var spots = [];
      for (var i = 0; i < 5; i++) spots.push({ i: i, x: 0.18 + Math.random() * 0.64, y: 0.2 + Math.random() * 0.55, found: false, hint: false });
      ui.hunt = { spots: spots, found: 0, first: !(st.best.hunt >= 5) };
      ui.note = "Five eggs are glowing. Tap them. A hint appears if you wait.";
      setTimeout(function () { if (ui && ui.hunt) { var left = ui.hunt.spots.filter(function (s) { return !s.found; })[0]; if (left) left.hint = true; paint(); } }, 7000);
    } else if (ui.mode === "fair") {
      ui.note = "One dragon stands in the lantern light. The ribbon celebrates that dragon alone.";
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
    if (window.FarmFX) FarmFX.burst(viewW / 2, viewH * 0.4, 0xffe7a0, 36);
    chime();
    save(st); paint();
  }

  function mount(el) {
    unmount();
    root = el;
    if (root) root.classList.add("farm-app");
    try { soundOn = localStorage.getItem("starblade-farm-mute") !== "1"; } catch (e) { soundOn = true; }
    st = load();
    var savedSky = "";
    try { savedSky = localStorage.getItem("starblade-farm-sky") || ""; } catch (e) {}
    ui = { mode: "farm", panel: "", phase: "", sky: savedSky || skyFromClock(), selected: st.dragons[0] ? st.dragons[0].id : null, note: st.hello || st.note || "The meadow kept everyone safe." };
    var boot = function () { ready = true; paint(); startMusic(); };
    if (reduced()) quality = "low";
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
    counts: function () { return { species: SPECIES.length, stages: STAGE.length, rarities: 4, plants: Object.keys(CROPS).length, countries: PLACES.length }; },
    perf: perfNow
  };
})();
