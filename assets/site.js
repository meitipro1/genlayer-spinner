/* Page behaviour. The loaders themselves need none of this - every one of them
   runs on CSS alone. */

(function () {
  "use strict";

  /* ---------- theme ---------- */

  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function paintToggle() {
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "Light" : "Dark";
    toggle.textContent = next;
    toggle.setAttribute("aria-label", "Switch to the " + next + " theme");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("gl-theme", next);
      } catch (e) {}
      paintToggle();
    });
    paintToggle();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", paintToggle);
  }

  /* ---------- stage controls ---------- */

  var stage = document.querySelector("[data-stage]");
  if (stage) {
    var boxes = stage.querySelectorAll(".stage-box");
    var loaders = stage.querySelectorAll(".stage-box > .gl");

    var sizeInput = stage.querySelector("[data-size]");
    var sizeOut = stage.querySelector("[data-size-out]");
    if (sizeInput) {
      var applySize = function () {
        var px = sizeInput.value + "px";
        for (var i = 0; i < loaders.length; i++) {
          loaders[i].style.fontSize = px;
        }
        for (var j = 0; j < boxes.length; j++) {
          boxes[j].style.width = px;
          boxes[j].style.height = px;
        }
        if (sizeOut) sizeOut.value = sizeInput.value + "px";
        measure();
      };
      sizeInput.addEventListener("input", applySize);
      applySize();
    }

    var swatches = stage.querySelectorAll(".swatch");
    swatches.forEach(function (sw) {
      sw.addEventListener("click", function () {
        swatches.forEach(function (o) {
          o.setAttribute("aria-pressed", String(o === sw));
        });
        var value = sw.getAttribute("data-color");
        for (var i = 0; i < loaders.length; i++) {
          /* an empty value hands the variant back to its own default, which is
             the per-surface pair in genlayer-loader.css */
          loaders[i].style.color = value || "";
        }
      });
    });

    var pause = stage.querySelector("[data-pause]");
    if (pause) {
      pause.addEventListener("click", function () {
        var held = pause.getAttribute("aria-pressed") === "true";
        pause.setAttribute("aria-pressed", String(!held));
        pause.textContent = held ? "Pause" : "Play";
        for (var i = 0; i < loaders.length; i++) {
          setPlayState(loaders[i], held ? "" : "paused");
        }
      });
    }

    var outline = stage.querySelector("[data-outline]");
    if (outline) {
      outline.addEventListener("click", function () {
        var on = outline.getAttribute("aria-pressed") === "true";
        outline.setAttribute("aria-pressed", String(!on));
        for (var i = 0; i < boxes.length; i++) {
          boxes[i].classList.toggle("show-box", !on);
        }
      });
    }
  }

  function setPlayState(node, state) {
    node.style.animationPlayState = state;
    var kids = node.querySelectorAll("*");
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.animationPlayState = state;
    }
  }

  /* ---------- footprint probe ----------
     Walks the loop in 48 steps, holding each frame with a negative
     animation-delay, and unions the painted boxes. `font-size` is meant to be
     the loader's whole footprint, so anything over 1.00 is ink landing on a
     neighbour. */

  var probe = document.querySelector("[data-probe]");

  var SHAPES = { polygon: 1, path: 1, rect: 1, circle: 1, ellipse: 1, line: 1 };

  /* Does this element put ink on the screen? Wrappers that only carry a
     transform - the prism's six face holders, the orbit's arms - have no
     border, no background and no fill, and measuring them would report a
     footprint that nothing is actually painting into. */
  function paints(el, cs) {
    var tag = el.tagName.toLowerCase();
    if (SHAPES[tag] || tag === "img" || tag === "svg") return true;
    if (cs.backgroundImage !== "none") return true;
    var bg = cs.backgroundColor;
    if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return true;
    var w =
      parseFloat(cs.borderTopWidth) +
      parseFloat(cs.borderRightWidth) +
      parseFloat(cs.borderBottomWidth) +
      parseFloat(cs.borderLeftWidth);
    return w > 0;
  }

  function animated(rootEl) {
    var out = [];
    var all = rootEl.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest("defs")) continue;
      var cs = getComputedStyle(el);
      out.push({
        el: el,
        paints: paints(el, cs),
        round: /50%/.test(cs.borderRadius),
        delay: parseDelays(cs.animationDelay),
        dur: parseDurations(cs.animationDuration),
      });
    }
    return out;
  }

  function parseDurations(text) {
    return text.split(",").map(function (t) {
      return seconds(t);
    });
  }
  function parseDelays(text) {
    return text.split(",").map(function (t) {
      return seconds(t);
    });
  }
  function seconds(t) {
    t = t.trim();
    if (t.slice(-2) === "ms") return parseFloat(t) / 1000;
    return parseFloat(t) || 0;
  }

  function measure() {
    if (!probe) return;
    var target = document.querySelector("[data-probe-target]");
    if (!target) return;

    var parts = animated(target);
    var period = 0;
    parts.forEach(function (p) {
      p.dur.forEach(function (d) {
        if (d > period) period = d;
      });
    });
    if (!period) period = 2;

    var fontSize = parseFloat(getComputedStyle(target).fontSize);
    var steps = 48;
    var minL = Infinity,
      maxR = -Infinity,
      minT = Infinity,
      maxB = -Infinity;

    var host = target.getBoundingClientRect();

    for (var s = 0; s < steps; s++) {
      var t = (s / steps) * period;
      parts.forEach(function (p) {
        var delays = p.delay.map(function (d) {
          return d - t + "s";
        });
        p.el.style.animationPlayState = "paused";
        p.el.style.animationDelay = delays.join(",");
      });
      /* forces the pending style change to be applied before we read back */
      void target.offsetWidth;

      for (var i = 0; i < parts.length; i++) {
        if (!parts[i].paints) continue;
        /* A circle painted inside a square box does not move when the box
           turns, but the box's bounding rect grows by root two, which would
           report a footprint nothing paints into. Measure a round element once,
           unspun; any static tilt on it is present in that frame anyway. */
        if (parts[i].round && s > 0) continue;
        var r = parts[i].el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.left < minL) minL = r.left;
        if (r.right > maxR) maxR = r.right;
        if (r.top < minT) minT = r.top;
        if (r.bottom > maxB) maxB = r.bottom;
      }
    }

    parts.forEach(function (p) {
      p.el.style.animationPlayState = "";
      p.el.style.animationDelay = "";
    });

    var w = (maxR - minL) / fontSize;
    var h = (maxB - minT) / fontSize;
    var over = Math.max(
      (host.left - minL) / fontSize,
      (maxR - host.right) / fontSize,
      (host.top - minT) / fontSize,
      (maxB - host.bottom) / fontSize,
    );

    put("w", w.toFixed(3));
    put("h", h.toFixed(3));
    put("steps", String(steps));
    put("period", period.toFixed(2) + "s");
    put("size", Math.round(fontSize) + "px");

    var slot = probe.querySelector('[data-probe-out="verdict"]');
    if (slot) {
      var clean = over <= 0.02;
      slot.textContent = clean
        ? "inside the footprint"
        : "over by " + (over * 100).toFixed(1) + "%";
      slot.className = clean ? "pass" : "fail";
    }
  }

  function put(key, value) {
    var slot = probe && probe.querySelector('[data-probe-out="' + key + '"]');
    if (slot) slot.textContent = value;
  }

  if (probe) {
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure);
  }

  /* ---------- code tabs ---------- */

  document.querySelectorAll(".code").forEach(function (block) {
    var tabs = block.querySelectorAll(".code-tab");
    var panes = block.querySelectorAll("[data-pane]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var want = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", String(t === tab));
        });
        panes.forEach(function (p) {
          p.hidden = p.getAttribute("data-pane") !== want;
        });
      });
    });
  });

  /* ---------- copy ---------- */

  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pane = btn.closest(".code-body").querySelector(
        "[data-pane]:not([hidden]) code",
      );
      if (!pane) return;
      var text = pane.textContent;
      var done = function () {
        var was = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = was;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- the status line ----------
     The loop stays in CSS and only the words are state, so the animation never
     restarts when the text changes. */

  document.querySelectorAll("[data-states]").forEach(function (node) {
    var states = node.getAttribute("data-states").split("|");
    var every = parseInt(node.getAttribute("data-interval"), 10) || 1500;
    var slot = node.querySelector("[data-state-slot]");
    if (!slot || states.length < 2) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % states.length;
      slot.textContent = states[i];
    }, every);
  });
})();
