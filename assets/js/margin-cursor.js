/**
 * Margin SVG 프레임 커스텀 커서 (7장 루프).
 * 모든 화면에서 표시, 시스템 커서는 none. rAF 위치 + setInterval 프레임.
 */
(function () {
  var frameMs = 125;
  /** 전 페이지 동일 표시 크기(px) — 핫스팟은 VIEWBOX 대비 자동 스케일 */
  var CURSOR_SIZE = 64;
  var VIEWBOX = 150;
  /** viewBox 기준 엄지 끝 — 클릭 핫스팟(전 페이지 동일) */
  var HOTSPOT_VX = 28;
  var HOTSPOT_VY = 48;
  /** 삼각형 꼭짓점을 핫스팟(엄지 끝)에서 화면 위·왼쪽으로 띄워 손가락과 겹치지 않게 함 (CSS px) */
  var TIP_APEX_OFFSET_UP_PX = 16;
  var TIP_APEX_OFFSET_LEFT_PX = 5;

  var PATH = 'assets/images/cursor/margin-cursor';
  var COUNT = 7;

  var el = null;
  var frames = [];
  var frameIndex = 0;
  var tickId = null;
  var rafId = null;
  var lastX = 0;
  var lastY = 0;
  var grabMode = false;
  var hx = 0;
  var hy = 0;

  function applyCursorMetrics() {
    hx = (HOTSPOT_VX * CURSOR_SIZE) / VIEWBOX;
    hy = (HOTSPOT_VY * CURSOR_SIZE) / VIEWBOX;

    var tipX = Math.max(4, hx - TIP_APEX_OFFSET_LEFT_PX);
    var tipY = Math.max(4, hy - TIP_APEX_OFFSET_UP_PX);

    if (el) {
      el.style.setProperty('--cursor-hotspot-x', hx.toFixed(2) + 'px');
      el.style.setProperty('--cursor-hotspot-y', hy.toFixed(2) + 'px');
      el.style.setProperty('--cursor-tip-x', tipX.toFixed(2) + 'px');
      el.style.setProperty('--cursor-tip-y', tipY.toFixed(2) + 'px');
    }
  }

  var POINTER_SEL = [
    'a',
    'game-button',
    '[role="game-button"]',
    'label',
    '[tabindex]:not([tabindex="-1"])',
    'input',
    'textarea',
    'select',
    '.card',
    '.envelope',
    '.envelope-seal',
  ].join(',');

  function buildUrls() {
    var u = [];
    for (var i = 1; i <= COUNT; i++) {
      u.push(PATH + i + '.svg');
    }
    return u;
  }

  function preload(urls, cb) {
    var n = urls.length;
    var done = 0;
    if (!n) {
      cb();
      return;
    }
    urls.forEach(function (src) {
      var im = new Image();
      im.onload = im.onerror = function () {
        done++;
        if (done >= n) cb();
      };
      im.src = src;
    });
  }

  function createDom() {
    el = document.createElement('div');
    el.className = 'margin-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--margin-cursor-size', CURSOR_SIZE + 'px');

    var stack = document.createElement('div');
    stack.className = 'margin-cursor__stack';

    var urls = buildUrls();
    for (var i = 0; i < urls.length; i++) {
      var img = document.createElement('img');
      img.className = 'margin-cursor__frame';
      img.src = urls[i];
      img.alt = '';
      img.draggable = false;
      if (i === 0) img.classList.add('is-active');
      stack.appendChild(img);
      frames.push(img);
    }
    el.appendChild(stack);

    var tip = document.createElement('span');
    tip.className = 'margin-cursor__tip';
    tip.setAttribute('aria-hidden', 'true');
    el.appendChild(tip);

    document.body.appendChild(el);
    applyCursorMetrics();
  }

  function setActiveFrame(i) {
    for (var k = 0; k < frames.length; k++) {
      frames[k].classList.toggle('is-active', k === i);
    }
  }

  function tickFrame() {
    frameIndex = (frameIndex + 1) % COUNT;
    setActiveFrame(frameIndex);
  }

  function updatePosition() {
    rafId = null;
    if (!el || !document.documentElement.classList.contains('margin-cursor-active')) return;
    el.style.transform =
      'translate3d(' + (lastX - hx) + 'px,' + (lastY - hy) + 'px,0)';
    syncPointerState();
  }

  function schedulePosition() {
    if (rafId != null) return;
    rafId = window.requestAnimationFrame(updatePosition);
  }

  function syncPointerState() {
    if (!el) return;
    if (grabMode) {
      el.classList.remove('margin-cursor--pointer');
      return;
    }
    var hit = null;
    try {
      hit = document.elementFromPoint(lastX, lastY);
    } catch (e) {
      return;
    }
    var pointer = !!(hit && hit.closest && hit.closest(POINTER_SEL));
    el.classList.toggle('margin-cursor--pointer', pointer);
  }

  function onMove(ev) {
    lastX = ev.clientX;
    lastY = ev.clientY;
    schedulePosition();
  }

  function onTouch(ev) {
    var t = ev.touches && ev.touches[0];
    if (!t) return;
    lastX = t.clientX;
    lastY = t.clientY;
    schedulePosition();
  }

  function onLeave() {
    if (el) el.classList.add('margin-cursor--out');
  }

  function onEnter() {
    if (el) el.classList.remove('margin-cursor--out');
  }

  function start() {
    if (tickId != null || frameMs <= 0) return;
    tickId = window.setInterval(tickFrame, frameMs);
  }

  function stop() {
    if (tickId != null) {
      window.clearInterval(tickId);
      tickId = null;
    }
    if (rafId != null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function enable() {
    document.documentElement.classList.add('margin-cursor-active');
    start();
    updatePosition();
  }

  function disable() {
    document.documentElement.classList.remove('margin-cursor-active');
    stop();
    if (el) {
      el.classList.remove('margin-cursor--out', 'margin-cursor--pointer');
    }
  }

  function enterGrabMode() {
    grabMode = true;
    document.body.classList.add('margin-cursor-grab-mode');
    if (!document.documentElement.classList.contains('margin-cursor-active')) {
      document.body.style.cursor = 'grab';
    }
    syncPointerState();
  }

  function exitGrabMode() {
    grabMode = false;
    document.body.classList.remove('margin-cursor-grab-mode');
    document.body.style.cursor = '';
    syncPointerState();
  }

  window.MarginCursor = {
    enterGrabMode: enterGrabMode,
    exitGrabMode: exitGrabMode,
  };

  function init() {
    var reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      frameMs = 0;
    }

    preload(buildUrls(), function () {
      createDom();
      enable();
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('touchstart', onTouch, { passive: true });
      document.addEventListener('touchmove', onTouch, { passive: true });
      document.addEventListener('mouseleave', onLeave, { passive: true });
      document.addEventListener('mouseenter', onEnter, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
