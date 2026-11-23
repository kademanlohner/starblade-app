/* WebGL particles and a light pass for the farm. Pixi stays off the game canvas so the painted scene can hold a steady frame rate. */
(function () {
  "use strict";
  var app = null, light = null, motes = [], tex = null, booted = false;
  var quality = "high";

  function dotTexture() {
    var c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    var g = c.getContext("2d");
    var rad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    rad.addColorStop(0, "rgba(255,255,255,1)");
    rad.addColorStop(0.45, "rgba(255,255,255,.55)");
    rad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rad;
    g.beginPath();
    g.arc(16, 16, 16, 0, 6.2832);
    g.fill();
    return PIXI.Texture.from(c);
  }

  function boot() {
    if (booted || !window.PIXI) return;
    var view = document.getElementById("fx");
    if (!view) return;
    try {
      app = new PIXI.Application({
        view: view,
        resizeTo: window,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        resolution: 1,
        powerPreference: "high-performance"
      });
      app.ticker.stop();
      tex = dotTexture();
      light = new PIXI.Graphics();
      app.stage.addChild(light);
      booted = true;
      document.documentElement.setAttribute("data-gl", "on");
    } catch (e) {
      app = null;
    }
  }

  function cap() {
    return quality === "low" ? 0 : quality === "mid" ? 28 : 64;
  }

  function spawn(x, y, color, life, vx, vy, size) {
    if (!booted || motes.length >= cap()) return;
    var s = new PIXI.Sprite(tex);
    s.anchor.set(0.5);
    s.x = x;
    s.y = y;
    s.tint = color;
    s.scale.set(size || 0.35);
    app.stage.addChild(s);
    motes.push({ s: s, vx: vx, vy: vy, life: life, max: life, size: size || 0.35 });
  }

  function burst(x, y, color, n) {
    if (!booted || quality === "low") return;
    var count = quality === "mid" ? Math.ceil(n * 0.45) : n;
    for (var i = 0; i < count; i++) {
      var a = Math.random() * 6.2832;
      var sp = 0.4 + Math.random() * 2.2;
      spawn(x, y, color, 0.7 + Math.random() * 0.5, Math.cos(a) * sp, Math.sin(a) * sp - 0.4, 0.25 + Math.random() * 0.45);
    }
  }

  function step(dt, info) {
    if (!booted) return;
    quality = (info && info.quality) || quality;
    var ms = Math.min(34, dt || 16);
    light.clear();
    if (info && info.rect && quality !== "low") {
      var r = info.rect;
      var sky = info.sky || "golden";
      var color = sky === "night" ? 0x1a2048 : sky === "morning" ? 0xfff0c8 : 0xffb25a;
      var alpha = sky === "night" ? 0.22 : sky === "morning" ? 0.08 : 0.1;
      light.beginFill(color, alpha);
      light.drawRect(r.left, r.top, r.width, r.height);
      light.endFill();
      light.blendMode = sky === "night" ? PIXI.BLEND_MODES.MULTIPLY : PIXI.BLEND_MODES.ADD;
      if (sky === "night" && quality === "high" && motes.length < 18) {
        if (Math.random() < 0.4) spawn(r.left + Math.random() * r.width, r.top + Math.random() * r.height * 0.7, 0xffe7a0, 1.6, (Math.random() - 0.5) * 0.25, -0.15, 0.22);
      } else if (sky !== "night" && quality === "high" && motes.length < 22 && Math.random() < 0.5) {
        spawn(r.left + Math.random() * r.width, r.top + r.height * (0.35 + Math.random() * 0.5), 0xfff4c4, 1.4, 0.15, -0.2, 0.16);
      }
    }
    for (var i = motes.length - 1; i >= 0; i--) {
      var m = motes[i];
      m.s.x += m.vx * ms * 0.06;
      m.s.y += m.vy * ms * 0.06;
      m.vy += 0.002 * ms;
      m.life -= ms / 1000;
      m.s.alpha = Math.max(0, m.life / m.max);
      if (m.life <= 0) {
        app.stage.removeChild(m.s);
        m.s.destroy();
        motes.splice(i, 1);
      }
    }
    app.renderer.render(app.stage);
  }

  window.FarmFX = {
    boot: boot,
    step: step,
    burst: burst,
    ready: function () { return booted; }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
