/* Dragon Farm
   Kinder rules, recorded in the parent report:
   - A merge never removes dragons. Three that match welcome one new dragon.
   - Care only raises wellness. A missed day does not lower it.
   - Upgrades spend harvested food, never stars.
   - No dragon dies, leaves, or is punished.
*/
(function () {
  "use strict";
  var SPECIES = {
    cinder: { name: "Cinderling", a: "#ffb15a", b: "#e24a2a", mark: "flame" },
    ripple: { name: "Ripplet", a: "#8ee7ff", b: "#2a6fdd", mark: "drop" },
    moss: { name: "Mosslet", a: "#b6f27a", b: "#2f8a45", mark: "leaf" },
    cloud: { name: "Cloudlet", a: "#e6d9ff", b: "#7a6adf", mark: "swirl" },
    pebble: { name: "Pebblet", a: "#f0d2a0", b: "#a67c52", mark: "stone" },
    bloom: { name: "Bloomlet", a: "#ffc2de", b: "#e2589a", mark: "flower" }
  };
  var SPECIES_IDS = Object.keys(SPECIES);
  var STAGES = ["egg", "baby", "teen", "adult", "elder"];
  var STAGE_LABEL = { egg: "egg", baby: "baby", teen: "teen", adult: "adult", elder: "elder" };
  var RARITY = ["common", "bright", "rare", "gleam"];
  var GLOW = ["Ready for a treat", "Nibbling", "Comfy", "Bright", "Thriving", "Gleaming"];
  var LESSON = "Roots grow into the soil. Tiny root hairs take in water and minerals. The stem carries water up to the leaves. Leaves use sunlight, water, and air to make sugar. That is photosynthesis. Soil holds the water and minerals, and it needs air too, so most plants should not sit in soggy mud.";

  function C(id, name, part, partLine, needs, season, extra) {
    return { id: id, name: name, part: part, partLine: partLine, needs: needs, season: season, extra: extra };
  }
  var CROPS = {
    carrot: C("carrot", "Carrot", "root", "The orange part we eat is a root. It stores sugar the leaves made. The feathery leaves grow above the soil.", "Sun, water, and loose soil.", "Cool season.", "Your body can turn the orange color, beta-carotene, into vitamin A."),
    lettuce: C("lettuce", "Lettuce", "leaf", "We eat the leaves. Leaves catch sunlight and make the plant's sugar.", "Sun, steady water, and soil.", "Cool season.", "Leaves give vitamins, including vitamin K and folate."),
    tomato: C("tomato", "Tomato", "fruit", "A tomato is a fruit. It grows from a flower and holds seeds.", "Lots of sun, water, and soil.", "Warm season.", "Tomatoes have vitamin C."),
    bean: C("bean", "Bean", "seed", "We eat the seeds. The pod is a fruit. On the roots, helpful bacteria turn nitrogen from the air into food the plant can use.", "Sun, water, and soil.", "Warm season.", "Beans have protein and fiber."),
    basil: C("basil", "Basil", "leaf", "Basil is an herb. We eat the leaves.", "Sun, water, and soil.", "Warm season.", "The smell comes from oils stored in the leaves."),
    wheat: C("wheat", "Wheat", "seed", "Wheat is a grass. The grain is the seed.", "Sun, water, and soil.", "It starts in cool weather and ripens as the days warm.", "The grain is mostly starch, which people use for energy."),
    rice: C("rice", "Rice", "seed", "Rice is a grass. The grain is the seed. A lot of rice grows in a shallow layer of water. Some kinds grow on dry ground.", "Sun, plenty of water, and soil.", "Warm season.", "The grain is mostly starch."),
    apple: C("apple", "Apple", "fruit", "We eat the fruit. A flower becomes the apple. Many apple trees need a cold winter before they bloom. A real tree takes years. This farm shows the idea faster so you can learn today.", "Sun, water, and soil.", "A cold winter, then spring bloom.", "Apples have fiber and some vitamin C."),
    maize: C("maize", "Maize", "seed", "Maize, also called corn, is a grass. Each kernel is a seed. People in Mexico domesticated it thousands of years ago.", "Sun, water, and soil.", "Warm season.", "The kernels are mostly starch."),
    avocado: C("avocado", "Avocado", "fruit", "We eat the fruit. The large pit is the seed. Avocados come from Central America, and people in southern Mexico were growing them thousands of years ago.", "Sun, water, and soil.", "Warm places.", "The fruit has more oil than most fruits."),
    chili: C("chili", "Chili pepper", "fruit", "The pepper is a fruit. People in Mexico were using chili peppers thousands of years ago.", "Sun, water, and soil.", "Warm season.", "The heat comes from a chemical called capsaicin. Sweet peppers are the same kind of fruit without that heat."),
    potato: C("potato", "Potato", "tuber", "A potato is a tuber, a fat underground stem, not a root. The eyes are buds that can grow a new shoot. People in the Andes, including Peru, domesticated potatoes.", "Sun, water, and loose soil.", "Cool season.", "Potatoes are mostly starch, with some vitamin C."),
    quinoa: C("quinoa", "Quinoa", "seed", "We eat the seed. Quinoa is not a grass. It was grown in the high Andes, including Peru.", "Sun, water, and soil.", "Cool highlands.", "The seeds contain protein."),
    cacao: C("cacao", "Cacao", "seed", "Cacao is native to the Amazon, including Peru. The part people roast is the seed, which grows inside a pod. People in Mexico grew cacao later. It did not start there.", "Warmth, rain, soil, and some shade.", "Warm, wet forests.", "The seed is what becomes cocoa."),
    coffee: C("coffee", "Coffee", "seed", "The coffee bean is a seed inside a red fruit called a cherry. Coffea arabica comes from the highlands of Ethiopia and nearby Sudan.", "Water, soil, and sun or light shade.", "Warm highlands.", "The seed is roasted before people brew it."),
    teff: C("teff", "Teff", "seed", "Teff is a tiny grass seed. It was domesticated in Ethiopia, where almost all of its variety is found.", "Sun, water, and soil.", "Warm season.", "The whole tiny grain is eaten, which keeps its fiber."),
    soybean: C("soybean", "Soybean", "seed", "A soybean is a legume seed, domesticated in China. Like beans, its roots can host bacteria that add nitrogen to the soil.", "Sun, water, and soil.", "Warm season.", "Soybeans have protein."),
    tea: C("tea", "Tea", "leaf", "We steep the young leaves. Tea plants come from the hills of southwestern China and the highlands next to them.", "Water, soil, warmth, and often some shade.", "Warm hills.", "The leaf is dried, not eaten like lettuce."),
    mango: C("mango", "Mango", "fruit", "We eat the fruit. Mangoes come from South Asia, including India. A real tree takes years. This farm shows the idea faster.", "Sun, water, and soil.", "Warm places.", "Mangoes have vitamin C."),
    pepper: C("pepper", "Black pepper", "fruit", "A peppercorn is a dried unripe fruit, not a bare seed. The plant is a vine from the wet forests of southern India, including the Malabar coast.", "Warmth, water, soil, and something to climb.", "Warm, wet forests.", "People grind the dried fruit as a spice."),
    olive: C("olive", "Olive", "fruit", "We eat the fruit, and people press oil from it. Olives come from the lands around the Mediterranean Sea, including Italy. A real tree takes years.", "Sun and soil. Deep roots can reach water through a dry summer.", "Sunny, dry summers.", "The fruit is full of oil."),
    grape: C("grape", "Grape", "fruit", "We eat the fruit. Grapevines come from the Mediterranean and nearby western Asia. Italy has grown them for a very long time.", "Sun, water, and soil, plus a place to climb.", "Warm season.", "The fruit holds natural sugars."),
    macadamia: C("macadamia", "Macadamia", "seed", "The nut we eat is a seed. Macadamia trees are native to the rainforests of eastern Australia. A real tree takes years.", "Sun or part shade, water, and soil.", "Warm rainforests.", "The seed has a lot of oil."),
    fingerlime: C("fingerlime", "Finger lime", "fruit", "Finger limes are native to the rainforests of eastern Australia. Inside the fruit, the juice sits in tiny pearls.", "Sun or part shade, water, and soil.", "Warm rainforests.", "Like other citrus fruits, it has vitamin C.")
  };
  var STARTER_SEEDS = ["carrot", "lettuce", "tomato", "bean", "basil", "wheat", "rice", "apple"];
  var PLACES = [
    { id: "mexico", atlas: "mexico", name: "Mexico", crops: ["maize", "avocado", "chili"], fact: "Maize was domesticated in Mexico. Avocados come from Central America, and people in southern Mexico grew them thousands of years ago. Chili peppers are fruits people in Mexico used very early. Cacao is not on this card, because cacao is native to the Amazon." },
    { id: "peru", atlas: "peru", name: "Peru", crops: ["potato", "quinoa", "cacao"], fact: "Potatoes and quinoa come from the Andes, including Peru. A potato is an underground stem. Quinoa is a seed, not a grass. Cacao is native to the Amazon, including Peru. Its seed is what people roast for cocoa." },
    { id: "ethiopia", atlas: null, name: "Ethiopia", crops: ["coffee", "teff"], fact: "Coffee plants come from the highlands of Ethiopia and nearby Sudan. The bean is a seed inside a fruit. Teff is a tiny grain domesticated in Ethiopia." },
    { id: "china", atlas: "china", name: "China", crops: ["soybean", "tea"], fact: "Soybeans were domesticated in China. Tea plants come from the hills of southwestern China and the highlands beside them. We use the young tea leaves." },
    { id: "india", atlas: "india", name: "India", crops: ["mango", "pepper"], fact: "Mangoes come from South Asia, including India. Black pepper is a vine from southern India. A peppercorn is a dried unripe fruit." },
    { id: "italy", atlas: "italy", name: "Italy", crops: ["olive", "grape"], fact: "Olive trees and grapevines come from around the Mediterranean Sea. Italy has grown both for a very long time. Olives and grapes are both fruits." },
    { id: "australia", atlas: "australia", name: "Australia", crops: ["macadamia", "fingerlime"], fact: "Macadamia trees and finger limes are native to the rainforests of eastern Australia. The macadamia we eat is the seed. The finger lime is a fruit." }
  ];

  var root = null, raf = 0, st = null, ui = null, cv = null, ctx = null, hit = [], viewW = 360, viewH = 240;
  var particles = [];

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dayGap(a, b) {
    var ms = new Date(b + "T12:00:00") - new Date(a + "T12:00:00");
    return Math.max(0, Math.round(ms / 86400000));
  }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function profileId() {
    try {
      var p = JSON.parse(localStorage.getItem("starblade-academy-profiles") || "{}");
      return (p && p.last) || "main";
    } catch (e) { return "main"; }
  }
  function key() { return "starblade-farm-v1:" + profileId(); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function make(species, stage, rarity) {
    var spec = SPECIES[species];
    return {
      id: uid(), species: species, stage: stage, rarity: rarity || 0,
      wellness: 1, name: spec.name, phase: Math.random() * 6, cared: ""
    };
  }
  function blank() {
    return {
      v: 1, dragons: [], seeds: {}, pantry: {}, plots: [], found: {}, visited: {},
      upgrades: { beds: 4, lanterns: 1 }, best: { glide: 0, hunt: 0, fair: 0 },
      ribbons: {}, lastGift: "", hello: "", note: ""
    };
  }
  function starter() {
    var s = blank();
    s.dragons = [make("cinder", 0, 0), make("cinder", 0, 0), make("cinder", 0, 0), make("ripple", 1, 1)];
    STARTER_SEEDS.forEach(function (id) { s.seeds[id] = id === "apple" ? 1 : id === "basil" || id === "wheat" || id === "rice" ? 2 : 3; });
    s.seeds.carrot = 4;
    s.plots = [null, null, null, null];
    s.found = {};
    STARTER_SEEDS.forEach(function (id) { s.found[id] = true; });
    s.lastGift = today();
    s.hello = "Three Cinderling eggs and a Ripplet are here. They are safe. A missed day never takes a dragon or a star away.";
    return s;
  }
  function save(s) {
    s.v = 1;
    try { localStorage.setItem(key(), JSON.stringify(s)); } catch (e) {}
  }
  function welcome(s) {
    var t = today();
    if (s.lastGift && s.lastGift !== t) {
      var n = Math.min(3, dayGap(s.lastGift, t) || 1);
      for (var i = 0; i < n; i++) s.dragons.push(make(SPECIES_IDS[i % SPECIES_IDS.length], 0, 0));
      s.hello = n > 1
        ? "Welcome back. Eggs from the days you were away are here. Your dragons stayed cozy. Nothing was lost."
        : "A new day. A new egg is here. Your dragons stayed cozy.";
    }
    s.lastGift = t;
  }
  function migrate(raw) {
    var s = blank();
    if (!raw || typeof raw !== "object") return starter();
    s.dragons = Array.isArray(raw.dragons) ? raw.dragons.filter(function (d) { return d && SPECIES[d.species] && STAGES[d.stage] != null; }) : [];
    s.seeds = raw.seeds && typeof raw.seeds === "object" ? raw.seeds : {};
    s.pantry = raw.pantry && typeof raw.pantry === "object" ? raw.pantry : {};
    s.plots = Array.isArray(raw.plots) ? raw.plots : [];
    s.found = raw.found && typeof raw.found === "object" ? raw.found : {};
    s.visited = raw.visited && typeof raw.visited === "object" ? raw.visited : {};
    s.best = Object.assign({ glide: 0, hunt: 0, fair: 0 }, raw.best || {});
    s.ribbons = raw.ribbons && typeof raw.ribbons === "object" ? raw.ribbons : {};
    s.upgrades = Object.assign({ beds: 4, lanterns: 1 }, raw.upgrades || {});
    if (s.upgrades.beds < 4) s.upgrades.beds = 4;
    if (s.upgrades.beds < s.plots.length) s.upgrades.beds = s.plots.length;
    while (s.plots.length < s.upgrades.beds) s.plots.push(null);
    s.lastGift = raw.lastGift || "";
    s.hello = raw.hello || "";
    s.note = raw.note || "";
    s.dragons.forEach(function (d) {
      if (d.wellness == null || d.wellness < 0) d.wellness = 1;
      if (d.wellness > 5) d.wellness = 5;
      if (!d.name) d.name = SPECIES[d.species].name;
      if (d.phase == null) d.phase = 0;
      if (!d.id) d.id = uid();
    });
    STARTER_SEEDS.forEach(function (id) { s.found[id] = true; });
    if (!s.dragons.length && !raw.lastGift) return starter();
    welcome(s);
    return s;
  }
  function load() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(key()) || "null"); } catch (e) { raw = null; }
    var s = raw ? migrate(raw) : starter();
    save(s);
    return s;
  }
  function burst(x, y, color, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.28, sp = 0.4 + Math.random() * 1.4;
      particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.4, life: 1, color: color, size: 2 + Math.random() * 3 });
    }
    if (particles.length > 80) particles.splice(0, particles.length - 80);
  }
  function pantryTotal() {
    return Object.keys(st.pantry).reduce(function (n, k) { return n + (st.pantry[k] || 0); }, 0);
  }
  function takeFood(n) {
    var left = n;
    Object.keys(st.pantry).sort(function (a, b) { return (st.pantry[b] || 0) - (st.pantry[a] || 0); }).forEach(function (k) {
      while (left && st.pantry[k]) { st.pantry[k]--; left--; }
    });
    return left === 0;
  }
  function firstFood() {
    var best = null, n = 0;
    Object.keys(st.pantry).forEach(function (k) { if ((st.pantry[k] || 0) > n) { best = k; n = st.pantry[k]; } });
    return best;
  }

  function hatch() {
    var egg = st.dragons.filter(function (d) { return d.stage === 0; })[0];
    if (!egg) { ui.note = "No eggs are waiting. Your dragons are still here. A new day can bring an egg, or try the egg garden."; paint(); return; }
    egg.stage = 1;
    if (egg.wellness < 2) egg.wellness = 2;
    ui.note = egg.name + " hatched. The baby stays. Nothing was taken.";
    ui.selected = egg.id;
    burst(120, 80, SPECIES[egg.species].a, 18);
    save(st); paint();
  }
  function feed() {
    var d = st.dragons.filter(function (x) { return x.id === ui.selected; })[0] || st.dragons.filter(function (x) { return x.stage > 0; })[0];
    if (!d) { ui.note = "Hatch an egg first. The egg is safe while you wait."; paint(); return; }
    if (d.stage === 0) { ui.note = "Warm the egg to hatch it. Eggs do not need food yet."; paint(); return; }
    var food = firstFood();
    if (!food) { ui.note = "The pantry is empty, and that is okay. " + d.name + " is still cozy. Harvest a plant when you want to share a snack."; paint(); return; }
    if (d.wellness >= 5) { ui.note = d.name + " is already gleaming. Save that food. Glow does not go backward."; paint(); return; }
    st.pantry[food]--;
    d.wellness++;
    var c = CROPS[food];
    ui.note = d.name + " nibbled " + c.name.toLowerCase() + ". " + c.partLine + " Glow is now " + GLOW[d.wellness] + ".";
    ui.selected = d.id;
    save(st); paint();
  }
  function findTrio() {
    var groups = {};
    st.dragons.forEach(function (d) {
      var k = d.species + ":" + d.stage;
      (groups[k] = groups[k] || []).push(d);
    });
    var found = null;
    Object.keys(groups).forEach(function (k) { if (!found && groups[k].length >= 3) found = groups[k]; });
    return found;
  }
  function merge() {
    var group = findTrio();
    if (!group) { ui.note = "When three dragons match in element and stage, you can welcome a bigger one. All three stay."; paint(); return; }
    var a = group[0];
    var rarity = Math.max(group[0].rarity, group[1].rarity, group[2].rarity);
    var baby;
    if (a.stage >= 4) baby = make(a.species, 0, 3);
    else baby = make(a.species, a.stage + 1, rarity);
    baby.wellness = 2;
    st.dragons.push(baby);
    ui.selected = baby.id;
    ui.note = a.stage >= 4
      ? "Three elders welcomed a gleam egg. All three elders stay."
      : "Three matching " + SPECIES[a.species].name + " " + STAGE_LABEL[STAGES[a.stage]] + " dragons welcomed a " + STAGE_LABEL[STAGES[baby.stage]] + ". All three stay.";
    burst(180, 90, SPECIES[a.species].a, 24);
    save(st); paint();
  }
  function plant(id) {
    if (!st.seeds[id]) { ui.note = "You do not have that seed yet. A flight can bring new ones."; paint(); return; }
    var i = st.plots.indexOf(null);
    if (i < 0) { ui.note = "Every bed is full. Harvest what is ready, or add a bed at the Harvest fair. Nothing is thrown out."; paint(); return; }
    st.seeds[id]--;
    st.plots[i] = { crop: id, step: 0 };
    var c = CROPS[id];
    ui.note = "You planted " + c.name.toLowerCase() + ". " + c.partLine + " It needs " + c.needs + " " + c.season;
    save(st); paint();
  }
  function water() {
    var n = 0;
    st.plots.forEach(function (p) { if (p && p.step < 2) { p.step++; n++; } });
    ui.note = n ? "You watered " + n + " bed" + (n > 1 ? "s" : "") + ". " + LESSON : "Nothing is thirsty. Ready plants can be gathered. The rest can keep growing.";
    save(st); paint();
  }
  function harvest() {
    var names = [];
    st.plots.forEach(function (p, i) {
      if (p && p.step >= 2) {
        st.pantry[p.crop] = (st.pantry[p.crop] || 0) + 1;
        names.push(CROPS[p.crop].name);
        st.plots[i] = null;
      }
    });
    if (!names.length) { ui.note = "Nothing is ready yet. Water the beds. Waiting is not a failure."; paint(); return; }
    var grown = CROPS[Object.keys(st.pantry).filter(function (k) { return st.pantry[k]; })[0]];
    ui.note = "You gathered " + names.join(", ") + ". The food is in the pantry." + (grown && grown.extra ? " " + grown.extra : "");
    save(st); paint();
  }
  function placeById(id) { return PLACES.filter(function (p) { return p.id === id || p.atlas === id; })[0] || null; }
  function pocket(countryId) {
    var place = placeById(countryId);
    if (!place) return;
    var s = load();
    var fresh = 0;
    place.crops.forEach(function (cid) {
      var have = s.seeds[cid] || 0;
      s.seeds[cid] = have + (have ? 1 : 3);
      if (!s.found[cid]) { s.found[cid] = true; fresh++; }
    });
    s.visited[place.id] = today();
    s.note = fresh
      ? "Seeds from " + place.name + " are in your pouch: " + place.crops.map(function (id) { return CROPS[id].name; }).join(", ") + "."
      : "You already carry the " + place.name + " seeds. A few more were added. None were taken.";
    save(s);
    if (st && key() === "starblade-farm-v1:" + profileId()) { st = s; if (ui) { ui.note = s.note; paint(); } }
  }
  function addBed() {
    if (st.upgrades.beds >= 8) { ui.note = "The garden already has 8 beds. That is enough for now."; paint(); return; }
    if (pantryTotal() < 4) { ui.note = "A new bed costs 4 gathered foods, not stars. Harvest a little more when you are ready."; paint(); return; }
    takeFood(4);
    st.upgrades.beds++;
    st.plots.push(null);
    ui.note = "A new bed is ready. Your stars were not used.";
    save(st); paint();
  }

  function layout(w, h) {
    hit = [];
    var shown = st.dragons.slice(0, 24);
    shown.forEach(function (d, i) {
      var col = i % 6, row = Math.floor(i / 6);
      hit.push({ id: d.id, x: 48 + col * ((w - 70) / 6), y: h * 0.36 + row * 62, dragon: d });
    });
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawEgg(x, y, d, s) {
    var g = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
    g.addColorStop(0, SPECIES[d.species].a);
    g.addColorStop(1, SPECIES[d.species].b);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.62, s * 0.82, 0, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.beginPath();
    ctx.ellipse(x - s * 0.15, y - s * 0.25, s * 0.12, s * 0.22, -0.4, 0, 6.3);
    ctx.fill();
  }
  function wing(x, y, s, side, flap, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(side * (0.5 + flap));
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(side * s * 0.9, -s * 0.2, side * s, s * 0.15);
    ctx.quadraticCurveTo(side * s * 0.4, s * 0.35, 0, s * 0.1);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawDragon(d, x, y, t) {
    var s = [20, 28, 36, 44, 52][d.stage] || 28;
    var bob = reduced() ? 0 : Math.sin(t / 400 + d.phase) * 3;
    var yy = y + bob;
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath();
    ctx.ellipse(x, y + s * 0.65, s * 0.75, s * 0.16, 0, 0, 6.3);
    ctx.fill();
    if (d.stage === 0) { drawEgg(x, yy, d, s); return; }
    var flap = reduced() ? 0.2 : Math.sin(t / 180 + d.phase) * 0.45;
    wing(x, yy - s * 0.1, s, -1, flap, SPECIES[d.species].a);
    wing(x, yy - s * 0.1, s, 1, flap, SPECIES[d.species].a);
    var g = ctx.createLinearGradient(x - s, yy - s, x + s, yy + s);
    g.addColorStop(0, SPECIES[d.species].a);
    g.addColorStop(1, SPECIES[d.species].b);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, yy, s * 0.72, s * 0.5, 0, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.beginPath();
    ctx.ellipse(x, yy + s * 0.12, s * 0.38, s * 0.24, 0, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x + s * 0.42, yy - s * 0.28, s * 0.28, 0, 6.3);
    ctx.fill();
    ctx.fillStyle = "#1b1230";
    ctx.beginPath();
    ctx.arc(x + s * 0.5, yy - s * 0.32, Math.max(1.5, s * 0.06), 0, 6.3);
    ctx.fill();
    if (d.stage === 4) {
      ctx.strokeStyle = "rgba(255,207,107,.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, yy, s + 6, 0, 6.3);
      ctx.stroke();
    }
    if (ui.selected === d.id) {
      ctx.strokeStyle = "#ffcf6b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, yy, s + 10, 0, 6.3);
      ctx.stroke();
    }
    var sparks = [0, 2, 4, 7][d.rarity] || 0;
    for (var i = 0; i < sparks; i++) {
      var ang = t / 500 + i;
      ctx.fillStyle = "#fff6c2";
      ctx.fillRect(x + Math.cos(ang) * (s + 4), yy + Math.sin(ang * 1.3) * (s * 0.6), 2, 2);
    }
  }
  function drawPlant(plot, x, y, w) {
    var c = CROPS[plot.crop];
    var step = plot.step;
    var soilTop = y;
    ctx.fillStyle = "#6b4428";
    roundRect(x, soilTop, w, 28, 6);
    ctx.fill();
    ctx.fillStyle = "#8d5a32";
    ctx.fillRect(x + 4, soilTop, w - 8, 6);
    var h = 10 + step * 16;
    if (c.part === "root" || c.part === "tuber") {
      ctx.fillStyle = c.part === "root" ? "#ff8a2a" : "#e2c07a";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, soilTop + 16, 6 + step * 2, 6 + step * 3, 0, 0, 6.3);
      ctx.fill();
      ctx.strokeStyle = "#2f8a45";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, soilTop + 8);
      ctx.lineTo(x + w / 2, soilTop - h);
      ctx.stroke();
    } else if (c.part === "leaf") {
      ctx.fillStyle = "#3eaf55";
      for (var i = 0; i < 2 + step; i++) {
        ctx.beginPath();
        ctx.ellipse(x + w / 2 + (i - 1) * 7, soilTop - 8 - i * 4, 8, 5, 0, 0, 6.3);
        ctx.fill();
      }
    } else if (c.part === "fruit") {
      ctx.strokeStyle = "#2f8a45";
      ctx.beginPath();
      ctx.moveTo(x + w / 2, soilTop);
      ctx.lineTo(x + w / 2, soilTop - h);
      ctx.stroke();
      if (step === 2) {
        ctx.fillStyle = c.id === "grape" ? "#7a4ea3" : c.id === "olive" ? "#7d9a3a" : c.id === "avocado" ? "#355e2b" : "#e23b3b";
        ctx.beginPath();
        ctx.arc(x + w / 2 + 6, soilTop - h + 4, 5 + (c.id === "avocado" ? 2 : 0), 0, 6.3);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = "#d8b15a";
      ctx.beginPath();
      ctx.moveTo(x + w / 2, soilTop);
      ctx.lineTo(x + w / 2, soilTop - h);
      ctx.stroke();
      if (step === 2) {
        ctx.fillStyle = "#f2d48a";
        ctx.fillRect(x + w / 2 - 4, soilTop - h - 6, 8, 6);
      }
    }
  }
  function drawFarm(t) {
    var w = viewW, h = viewH;
    var sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#241448");
    sky.addColorStop(0.55, "#6a3a62");
    sky.addColorStop(1, "#e39a55");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    var sun = ctx.createRadialGradient(w * 0.78, h * 0.22, 8, w * 0.78, h * 0.22, w * 0.45);
    sun.addColorStop(0, "rgba(255,214,120,.95)");
    sun.addColorStop(1, "rgba(255,214,120,0)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#3c6b45";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.62);
    ctx.quadraticCurveTo(w * 0.3, h * 0.5, w * 0.6, h * 0.6);
    ctx.quadraticCurveTo(w * 0.85, h * 0.68, w, h * 0.56);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.fillStyle = "#2f7a43";
    ctx.fillRect(0, h * 0.7, w, h);
    var beds = st.plots.length;
    var bw = Math.min(54, (w - 24) / beds - 6);
    st.plots.forEach(function (p, i) {
      var x = 12 + i * (bw + 6);
      var y = h * 0.74;
      if (!p) {
        ctx.fillStyle = "rgba(80,50,30,.55)";
        roundRect(x, y, bw, 28, 6);
        ctx.fill();
      } else drawPlant(p, x, y, bw);
    });
    layout(w, h);
    hit.forEach(function (item) { drawDragon(item.dragon, item.x, item.y, t); });
    if (ui.mode === "hunt" && ui.hunt) {
      ui.hunt.spots.forEach(function (s) {
        if (s.found) return;
        var pulse = 0.4 + Math.sin(t / 200 + s.i) * 0.3;
        ctx.fillStyle = "rgba(255,207,107," + pulse + ")";
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.hint ? 16 : 9, 0, 6.3);
        ctx.fill();
      });
    }
    particles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.life -= 0.02; p.vy += 0.02;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 6.3);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(function (p) { return p.life > 0; });
    if (st.upgrades.lanterns) {
      for (var i = 0; i < 4 + st.upgrades.lanterns * 3; i++) {
        var fx = (Math.sin(t / 900 + i) * 0.5 + 0.5) * w;
        var fy = h * 0.3 + Math.cos(t / 700 + i * 2) * 20;
        ctx.fillStyle = "rgba(255,220,140,.8)";
        ctx.fillRect(fx, fy, 2, 2);
      }
    }
  }
  function drawGlide(t) {
    var w = viewW, h = viewH, g = ui.glide;
    if (!g) return;
    ctx.fillStyle = "#1a1440";
    ctx.fillRect(0, 0, w, h);
    var glow = ctx.createRadialGradient(g.x, g.y, 4, g.x, g.y, 90);
    glow.addColorStop(0, "rgba(255,207,107,.35)");
    glow.addColorStop(1, "rgba(255,207,107,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    g.rings.forEach(function (r) {
      ctx.strokeStyle = r.got ? "rgba(255,255,255,.25)" : "#ffcf6b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 16, 0, 6.3);
      ctx.stroke();
    });
    g.clouds.forEach(function (c) {
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, 28, 12, 0, 0, 6.3);
      ctx.fill();
    });
    drawDragon(g.dragon, g.x, g.y, t);
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
    viewH = Math.max(180, rect.height || 240);
    if (cv.width !== Math.floor(viewW * dpr) || cv.height !== Math.floor(viewH * dpr)) {
      cv.width = Math.floor(viewW * dpr);
      cv.height = Math.floor(viewH * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    if (ui.mode === "glide") drawGlide(t);
    else drawFarm(t);
    if (ui.mode === "glide") stepGlide(t);
    raf = requestAnimationFrame(frame);
  }
  function stepGlide(t) {
    var g = ui.glide;
    if (!g || g.done) return;
    if (!g.t0) g.t0 = t;
    var dt = Math.min(32, t - (g.last || t));
    g.last = t;
    if (g.hold) g.vy -= 0.0016 * dt;
    g.vy += 0.0009 * dt;
    g.vy *= 0.98;
    g.y += g.vy * dt;
    var h = cv.getBoundingClientRect().height;
    if (g.y < 24) { g.y = 24; g.vy = 0; }
    if (g.y > h - 24) { g.y = h - 24; g.vy = 0; }
    g.rings.forEach(function (r) {
      r.x -= 0.12 * dt;
      if (!r.got && Math.abs(r.x - g.x) < 20 && Math.abs(r.y - g.y) < 22) { r.got = true; g.score++; burst(r.x, r.y, "#ffcf6b", 8); }
    });
    g.clouds.forEach(function (c) {
      c.x -= 0.08 * dt;
      if (Math.abs(c.x - g.x) < 30 && Math.abs(c.y - g.y) < 20) g.vy *= 0.4;
    });
    g.rings = g.rings.filter(function (r) { return r.x > -30; });
    g.clouds = g.clouds.filter(function (c) { return c.x > -40; });
    if (t - g.spawn > 700) {
      g.spawn = t;
      var y = 40 + Math.random() * (viewH - 80);
      g.rings.push({ x: viewW + 20, y: y, got: false });
      if (Math.random() < 0.7) g.clouds.push({ x: viewW + 40, y: 30 + Math.random() * (viewH - 60) });
    }
    if (t - g.t0 > 18000) finishGlide();
  }
  function finishGlide() {
    if (!ui.glide || ui.glide.done) return;
    ui.glide.done = true;
    if (ui.glide.score > st.best.glide) st.best.glide = ui.glide.score;
    ui.note = "You flew the whole way. Lanterns lit: " + ui.glide.score + ". Best: " + st.best.glide + ". Clouds only slow you. They never stop you.";
    save(st);
    ui.mode = "farm";
    paint();
  }

  function paint() {
    if (!root || !st) return;
    var hello = st.hello || st.note;
    if (st.hello || st.note) { st.hello = ""; st.note = ""; save(st); }
    if (hello && !ui.note) ui.note = hello;
    var eggs = st.dragons.filter(function (d) { return d.stage === 0; }).length;
    var trio = findTrio();
    root.innerHTML = shell(eggs, trio);
    cv = root.querySelector("canvas");
    ctx = cv ? cv.getContext("2d") : null;
    if (cv && ui.hunt) cv.setAttribute("data-spots", JSON.stringify(ui.hunt.spots.map(function (s) { return { x: s.x, y: s.y, found: s.found }; })));
    bind();
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function shell(eggs, trio) {
    if (ui.mode === "flight") return flightShell();
    if (ui.mode === "fair") return fairShell();
    var chips = st.dragons.map(function (d) {
      return '<button class="farm-chip' + (ui.selected === d.id ? " on" : "") + '" data-farm="sel:' + d.id + '">' + esc(d.name) + " " + esc(STAGE_LABEL[STAGES[d.stage]]) + "</button>";
    }).join("");
    var crops = Object.keys(CROPS).filter(function (id) { return st.found[id]; }).map(function (id) {
      return '<button class="farm-chip" data-farm="plant:' + id + '">' + esc(CROPS[id].name) + " " + (st.seeds[id] || 0) + "</button>";
    }).join("");
    var places = PLACES.map(function (p) {
      var label = p.atlas ? "Fly Dragon Skies to " + p.name : "Fly to " + p.name;
      return '<button class="farm-chip" data-farm="place:' + p.id + '">' + label + "</button>";
    }).join("");
    var panel = ui.panel === "garden"
      ? '<div class="farm-sheet"><p class="farm-kicker">Garden</p><p>' + esc(LESSON) + "</p><div class=\"farm-row\">" + crops + "</div></div>"
      : ui.panel === "fly"
        ? '<div class="farm-sheet"><p class="farm-kicker">Seed flights</p><p>Six countries use the Dragon Skies flight you already know. Ethiopia is not on that map, so that flight stays here. Seeds you pocket are never taken back.</p><div class="farm-row">' + places + "</div></div>"
        : ui.panel === "play"
          ? '<div class="farm-sheet"><p class="farm-kicker">Play</p><div class="farm-row"><button class="farm-btn gold" data-farm="glide">Lantern glide</button><button class="farm-btn gold" data-farm="hunt">Egg garden</button><button class="farm-btn gold" data-farm="fair">Harvest fair</button></div><p>Glide through lanterns. Clouds cushion you. The egg garden hides five eggs. The fair celebrates one dragon. It is not a contest.</p></div>'
          : "";
    var glideBtn = ui.mode === "glide" ? '<button class="farm-btn gold" data-farm="rise" id="farm-rise">Hold to rise</button><button class="farm-btn" data-farm="glide-end">Land softly</button>' : "";
    return '<div class="farm-top"><button class="farm-btn" data-farm="back">Back</button><div><h2>Dragon Farm</h2><p>' + st.dragons.length + " dragons · pantry " + pantryTotal() + " · " + eggs + " eggs</p></div></div>"
      + '<div class="farm-stage"><canvas aria-label="Dragon farm meadow"></canvas></div>'
      + '<p class="farm-note">' + esc(ui.note || "Tap a dragon, tend a bed, or fly for seeds. Everyone stays.") + "</p>"
      + '<div class="farm-row">' + chips + "</div>"
      + '<div class="farm-row">'
      + '<button class="farm-btn gold" data-farm="hatch">Warm an egg</button>'
      + '<button class="farm-btn gold" data-farm="feed">Share a snack</button>'
      + '<button class="farm-btn gold" data-farm="merge"' + (trio ? "" : " disabled") + ">Welcome a bigger one</button>"
      + '<button class="farm-btn" data-farm="water">Water</button>'
      + '<button class="farm-btn" data-farm="harvest">Gather</button>'
      + '<button class="farm-btn" data-farm="panel:garden">Plant</button>'
      + '<button class="farm-btn" data-farm="panel:fly">Fly</button>'
      + '<button class="farm-btn" data-farm="panel:play">Play</button>'
      + '<button class="farm-btn" data-farm="lesson">How plants work</button>'
      + glideBtn
      + "</div>" + panel;
  }
  function flightShell() {
    var p = ui.flightPlace;
    return '<div class="farm-top"><button class="farm-btn" data-farm="panel:fly">Back</button><div><h2>Flying to ' + esc(p.name) + "</h2><p>Wings up. This flight stays on the farm.</p></div></div>"
      + '<div class="farm-fly"><i class="cloud" style="width:70px;top:24px;left:20%"></i><i class="cloud" style="width:90px;top:70px;left:60%"></i><div class="farm-dragon-float" aria-hidden="true">🐉</div></div>'
      + (ui.flightLanded
        ? '<article class="farm-card"><p class="farm-kicker">Seed card</p><h3>' + esc(p.name) + "</h3><p>" + esc(p.fact) + '</p><button class="farm-btn gold" data-farm="pocket">Pocket the seeds</button></article>'
        : '<p class="farm-note">Hold on. The meadow will be here when you land. Your dragons are not in any danger.</p><button class="farm-btn gold" id="farm-land" data-farm="arrive">Land in ' + esc(p.name) + "</button>");
  }
  function fairShell() {
    var d = st.dragons.filter(function (x) { return x.id === ui.selected; })[0] || st.dragons.filter(function (x) { return x.stage > 0; })[0];
    var ribbon = d ? GLOW[d.wellness] || "Cozy" : "Cozy";
    return '<div class="farm-top"><button class="farm-btn" data-farm="panel:play">Back</button><div><h2>Harvest fair</h2><p>A celebration, not a race. No one is ranked.</p></div></div>'
      + '<div class="farm-stage"><canvas aria-label="Harvest fair"></canvas></div>'
      + '<article class="farm-card"><p class="farm-kicker">Ribbon</p><h3>' + (d ? esc(d.name) + " · " + esc(ribbon) : "Hatch a dragon first") + "</h3><p>" + (d ? "Glow only goes up. This ribbon celebrates care. It does not compare kids." : "") + '</p><button class="farm-btn gold" data-farm="ribbon">Give the ribbon</button></article>'
      + '<article class="farm-card"><p class="farm-kicker">Farm upgrades</p><p>A new bed costs 4 gathered foods. Lanterns cost 2 basil or tea leaves. Stars are never spent.</p><div class="farm-row"><button class="farm-btn" data-farm="bed">Add a bed (' + st.upgrades.beds + '/8)</button><button class="farm-btn" data-farm="lantern">Hang lanterns</button></div></article>';
  }
  function bind() {
    root.onclick = function (e) {
      var el = e.target.closest("[data-farm]");
      if (!el) return;
      act(el.getAttribute("data-farm"), el);
    };
    var rise = root.querySelector("#farm-rise");
    if (rise) {
      var down = function (e) { e.preventDefault(); if (ui.glide) ui.glide.hold = true; };
      var up = function () { if (ui.glide) ui.glide.hold = false; };
      rise.addEventListener("pointerdown", down);
      rise.addEventListener("pointerup", up);
      rise.addEventListener("pointerleave", up);
    }
    if (cv) cv.addEventListener("pointerdown", onCanvas);
  }
  function onCanvas(e) {
    var rect = cv.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (ui.mode === "hunt" && ui.hunt) {
      var hitSpot = null;
      ui.hunt.spots.forEach(function (s) {
        if (!s.found && Math.abs(s.x * rect.width - (e.clientX - rect.left)) < 28 && Math.abs(s.y * rect.height - (e.clientY - rect.top)) < 28) hitSpot = s;
      });
      if (hitSpot) {
        hitSpot.found = true;
        ui.hunt.found++;
        burst(x, y, "#ffcf6b", 12);
        if (ui.hunt.found >= 5) finishHunt();
        else ui.note = ui.hunt.found + " of 5 eggs. Take your time.";
        paint();
      }
      return;
    }
    var best = null, bestD = 28;
    hit.forEach(function (item) {
      var d = Math.hypot(item.x - x, item.y - y);
      if (d < bestD) { best = item; bestD = d; }
    });
    if (best) { ui.selected = best.id; ui.note = best.dragon.name + " the " + STAGE_LABEL[STAGES[best.dragon.stage]] + ". " + GLOW[best.dragon.wellness] + ". " + SPECIES[best.dragon.species].name + "."; paint(); }
  }
  function finishHunt() {
    if (ui.hunt.first) {
      for (var i = 0; i < 5; i++) st.dragons.push(make(SPECIES_IDS[i % SPECIES_IDS.length], 0, i === 4 ? 2 : 0));
      ui.note = "You found all five eggs. They joined the meadow. Replay later for extra seeds, not a score that can fall.";
    } else {
      var id = STARTER_SEEDS[Math.floor(Math.random() * STARTER_SEEDS.length)];
      st.seeds[id] = (st.seeds[id] || 0) + 1;
      ui.note = "You found the eggs again. An extra " + CROPS[id].name.toLowerCase() + " seed is yours.";
    }
    st.best.hunt = Math.max(st.best.hunt || 0, 5);
    ui.mode = "farm";
    ui.hunt = null;
    save(st);
  }
  function act(name) {
    if (name === "back") { if (window.go) window.go("home"); else unmount(); return; }
    if (name.indexOf("panel:") === 0) { ui.panel = name.slice(6); ui.mode = "farm"; ui.note = ui.note; paint(); return; }
    if (name.indexOf("sel:") === 0) { ui.selected = name.slice(4); paint(); return; }
    if (name === "hatch") return hatch();
    if (name === "feed") return feed();
    if (name === "merge") return merge();
    if (name === "water") return water();
    if (name === "harvest") return harvest();
    if (name.indexOf("plant:") === 0) return plant(name.slice(6));
    if (name === "lesson") { ui.note = LESSON + " A carrot is a root. A potato is an underground stem. A tomato is a fruit. Lettuce is leaves. Wheat is a seed."; paint(); return; }
    if (name.indexOf("place:") === 0) return startFlight(name.slice(6));
    if (name === "glide") return startGlide();
    if (name === "glide-end") return finishGlide();
    if (name === "hunt") return startHunt();
    if (name === "fair") { ui.mode = "fair"; ui.panel = ""; paint(); return; }
    if (name === "ribbon") return giveRibbon();
    if (name === "bed") return addBed();
    if (name === "lantern") return lantern();
    if (name === "arrive") { ui.flightLanded = true; paint(); return; }
    if (name === "pocket") { pocket(ui.flightPlace.id); ui.mode = "farm"; ui.panel = "garden"; ui.note = st.note; paint(); }
  }
  function startFlight(id) {
    var p = placeById(id);
    if (!p) return;
    if (p.atlas && window.go) {
      ui.note = "Dragon Skies will fly you to " + p.name + ". When you land, the seeds wait in your pouch.";
      save(st);
      window.go("flight", { id: p.atlas });
      return;
    }
    ui.mode = "flight";
    ui.flightPlace = p;
    ui.flightLanded = !!reduced();
    ui.panel = "";
    paint();
    if (!reduced()) setTimeout(function () { if (ui && ui.mode === "flight") { ui.flightLanded = true; paint(); } }, 2400);
  }
  function startGlide() {
    var d = st.dragons.filter(function (x) { return x.stage > 0; })[0] || st.dragons[0];
    ui.mode = "glide";
    ui.panel = "";
    ui.glide = { x: 80, y: 120, vy: 0, hold: false, score: 0, rings: [], clouds: [], spawn: 0, t0: 0, last: 0, done: false, dragon: d };
    ui.note = "Hold the button to rise. Let go to glide. Collect lanterns. Clouds only slow you.";
    paint();
  }
  function startHunt() {
    ui.mode = "hunt";
    ui.panel = "";
    var spots = [];
    for (var i = 0; i < 5; i++) spots.push({ i: i, x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6, found: false, hint: false });
    ui.hunt = { spots: spots, found: 0, first: !(st.best.hunt >= 5) };
    ui.note = "Five eggs are glowing. Tap them. A hint appears if you want one.";
    paint();
    setTimeout(function () {
      if (!ui || !ui.hunt) return;
      var left = ui.hunt.spots.filter(function (s) { return !s.found; })[0];
      if (left) left.hint = true;
      ui.note = "One egg glows brighter if you want a hint. Looking longer is fine.";
      paint();
    }, 8000);
  }
  function giveRibbon() {
    var d = st.dragons.filter(function (x) { return x.id === ui.selected; })[0] || st.dragons.filter(function (x) { return x.stage > 0; })[0];
    if (!d) { ui.note = "Hatch a dragon first. There is no rush."; paint(); return; }
    var level = d.wellness;
    if ((st.ribbons[d.id] || 0) < level) st.ribbons[d.id] = level;
    st.best.fair = Math.max(st.best.fair || 0, level);
    ui.note = d.name + " receives a " + GLOW[level] + " ribbon. It is a celebration, not a ranking. The ribbon does not go backward.";
    burst(160, 80, "#ffcf6b", 20);
    save(st); paint();
  }
  function lantern() {
    var herbs = (st.pantry.basil || 0) + (st.pantry.tea || 0);
    if (herbs < 2) { ui.note = "Lanterns use 2 basil or tea leaves, not stars. Grow those when you like."; paint(); return; }
    var need = 2;
    ["basil", "tea"].forEach(function (id) {
      while (need && st.pantry[id]) { st.pantry[id]--; need--; }
    });
    st.upgrades.lanterns = (st.upgrades.lanterns || 0) + 1;
    ui.note = "More lanterns glow over the meadow. Your stars are still yours.";
    save(st); paint();
  }

  function mount(el) {
    unmount();
    root = el;
    if (root) root.classList.add("farm-app");
    st = load();
    ui = { mode: "farm", panel: "", selected: st.dragons[0] ? st.dragons[0].id : null, note: st.hello || st.note || "The meadow kept everyone safe." };
    paint();
  }
  function unmount() {
    cancelAnimationFrame(raf);
    raf = 0;
    if (root) root.onclick = null;
    root = null;
    cv = null;
    ctx = null;
  }
  window.StarFarm = {
    mount: mount,
    unmount: unmount,
    pocket: pocket,
    counts: function () {
      return { species: SPECIES_IDS.length, stages: STAGES.length, rarities: RARITY.length, plants: Object.keys(CROPS).length, countries: PLACES.length };
    }
  };
})();
