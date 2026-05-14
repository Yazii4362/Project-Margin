(function () {
  var OFFSET   = 328;
  var SWIPE_TH = 50;
  var EASE     = 'cubic-bezier(0.22, 1, 0.36, 1)';

  var cur        = 0;
  var total      = 0;
  var expanded   = false;
  var dragging   = false;
  var didDrag    = false;
  var startX     = 0;
  var $cards     = null;
  var hintShown  = false;
  var touchBound = false;
  var visited    = [];
  var specialIndexes = [];

  /* ─── BUILD ─── */
  function build() {
    if (typeof window.CARDS_DATA === 'undefined' || !window.CARDS_DATA.length) return;

    var $track = $('#carouselTrack');
    $track.empty();

    var normalItems  = [];
    var specialItems = [];

    window.CARDS_DATA.forEach(function (d) {
      // maker / cheerleader 는 캐러셀 제외
      if (d.type === 'maker' || d.type === 'cheerleader') return;
      if (d.type === 'special') specialItems.push(d);
      else                      normalItems.push(d);
    });

    var orderedItems = normalItems.concat(specialItems);
    total = orderedItems.length;
    specialIndexes = [];
    for (var si = 0; si < specialItems.length; si++) {
      specialIndexes.push(normalItems.length + si);
    }
    visited = new Array(total).fill(false);

    orderedItems.forEach(function (d, i) {
      var cls     = d.type === 'special' ? 'card card--special' : 'card';
      var linkBtn = d.link
        ? '<a class="card-link-btn" href="' + d.link + '" target="_blank" rel="noopener">바로가기 →</a>'
        : '';

      var preview = d.type === 'special'
        ? '<div class="card-preview"><p class="special-question">?</p></div>'
        : '<div class="card-preview">'
            + '<div class="env-body"><div class="env-seal"></div></div>'
            + '<p class="env-name">' + d.name + '</p>'
          + '</div>';

      $track.append(
        $('<div>').addClass(cls).attr('data-i', i).html(
          '<div class="card-bg" style="background-image:url(\'' + d.bgImage + '\')"></div>'
          + '<div class="card-grain"></div>'
          + preview
          + '<div class="card-opened">'
            + '<button class="card-nav card-nav--prev" aria-label="이전 카드">←</button>'
            + '<button class="card-nav card-nav--next" aria-label="다음 카드">→</button>'
            + '<p class="letter-name">' + d.name + '</p>'
            + '<p class="letter-msg">' + d.message + '</p>'
            + linkBtn
          + '</div>'
        )
      );
    });

    $cards = $track.find('.card');
    cur    = 0;
    markVisited(0);
    place(false);
    setTimeout(swipeHint, 2000);
  }

  /* ─── VISITED ─── */
  function markVisited(idx) {
    if (idx >= 0 && idx < total) visited[idx] = true;
  }

  function allRegularVisited() {
    if (!specialIndexes.length) return true;
    return visited.every(function (v, i) {
      return specialIndexes.indexOf(i) !== -1 || v;
    });
  }

  function getNextIndex(dir) {
    var next = ((cur + dir) % total + total) % total;
    if (!allRegularVisited() && specialIndexes.indexOf(next) !== -1) {
      do { next = ((next + dir) % total + total) % total; }
      while (specialIndexes.indexOf(next) !== -1 && next !== cur);
    }
    return next;
  }

  /* ─── HINT ─── */
  function swipeHint() {
    if (hintShown || expanded || !$cards) return;
    hintShown = true;
    var $a = $cards.filter('.is-active');
    $a.addClass('hint-nudge');
    setTimeout(function () { $a.removeClass('hint-nudge'); }, 1000);
  }

  /* ─── PLACE ─── */
  function place(anim, drag) {
    if (!$cards || !total) return;
    var half = Math.floor(total / 2);

    $cards.each(function (i) {
      if (expanded && $(this).hasClass('is-open')) return;

      var rel = i - cur;
      if (rel >  half) rel -= total;
      if (rel < -half) rel += total;

      var x   = rel * OFFSET + (drag || 0);
      var abs = Math.abs(rel);

      $(this).removeClass('is-active is-prev is-next is-far');
      if      (rel === 0)  $(this).addClass('is-active');
      else if (rel === -1) $(this).addClass('is-prev');
      else if (rel ===  1) $(this).addClass('is-next');
      else                 $(this).addClass('is-far');

      $(this).css({
        transition: anim
          ? 'transform 0.65s ' + EASE + ', opacity 0.5s ' + EASE + ', filter 0.5s ' + EASE
          : 'none',
        transform : 'translateX(' + x + 'px)',
        zIndex    : total - abs
      });
    });

    updateBar();
  }

  /* ─── PROGRESS ─── */
  function updateBar() {
    if (!total) return;
    $('#progressFill').css('width', ((cur + 1) / total) * 100 + '%');
    var isSpecial = $cards && $cards.eq(cur).hasClass('card--special');
    $('body').toggleClass('dark-theme', !!isSpecial);
  }

  /* ─── NAVIGATE ─── */
  function go(dir) {
    if (!total) return;
    cur = getNextIndex(dir);
    markVisited(cur);
    place(true);
  }

  /* ─── EXPAND ─── */
  function open() {
    if (expanded || !$cards) return;
    expanded = true;
    var $c = $cards.filter('.is-active');
    $c.addClass('is-open').css({
      transition: 'transform 0.45s ' + EASE,
      zIndex    : 999,
      transform : 'translateX(0px) scale(1.1)'
    });
    $('#carousel').addClass('has-open');
  }

  function close() {
    if (!expanded) return;
    expanded = false;
    if ($cards) $cards.removeClass('is-open');
    $('#carousel').removeClass('has-open');
    if ($cards) $cards.css({ transition: '', transform: '', zIndex: '' });
    place(true);
  }

  /* ─── DRAG ─── */
  function onStart(x) {
    startX   = x;
    dragging = true;
    didDrag  = false;
  }

  function onMove(x) {
    if (!dragging) return;
    if (!expanded) {
      var dx = x - startX;
      place(false, dx * (Math.abs(dx) > 100 ? 0.4 : 0.8));
    }
  }

  function onEnd(x) {
    if (!dragging) return;
    dragging = false;
    var diff = startX - x;

    if (expanded) {
      if (diff > SWIPE_TH) {
        close(); setTimeout(function () { go(1);  }, 80); didDrag = true;
      } else if (diff < -SWIPE_TH) {
        close(); setTimeout(function () { go(-1); }, 80); didDrag = true;
      }
      return;
    }

    if      (diff >  SWIPE_TH) { didDrag = true; go(1);  }
    else if (diff < -SWIPE_TH) { didDrag = true; go(-1); }
    else                        { place(true); }
  }

  /* ─── TOUCH ─── */
  function bindCarouselTouch() {
    var el = document.getElementById('carousel');
    if (!el || touchBound) return;
    touchBound = true;

    el.addEventListener('touchstart', function (e) {
      onStart(e.touches[0].clientX);
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (dragging && !expanded) e.preventDefault();
      onMove(e.touches[0].clientX);
    }, { passive: false });

    el.addEventListener('touchend', function (e) {
      onEnd(e.changedTouches[0].clientX);
    }, { passive: true });
  }

  /* ─── WHEEL ─── */
  function bindCarouselWheel() {
    var $el = $('#carousel');
    if (!$el.length) return;
    var locked = false;
    $el.on('wheel', function (e) {
      if (expanded) return;
      if (Math.abs(e.originalEvent.deltaY) < 25) return;
      e.preventDefault();
      if (locked) return;
      locked = true;
      go(e.originalEvent.deltaY > 0 ? 1 : -1);
      setTimeout(function () { locked = false; }, 250);
    });
  }

  /* ─── EVENTS ─── */
  $(document).ready(function () {
    $(document).on('carousel:init', build);

    // 카드 클릭
    $(document).on('click', '#carouselTrack .card.is-active', function (e) {
      if ($(e.target).closest('.card-nav').length) return;
      if ($(e.target).closest('.card-link-btn').length) return;
      if (didDrag) { didDrag = false; return; }
      if ($(this).hasClass('card--special')) {
        if (typeof openTeamOverlay === 'function') openTeamOverlay();
        return;
      }
      expanded ? close() : open();
    });

    // 화살표 버튼
    $(document).on('click', '.card-nav--prev', function (e) {
      e.stopPropagation();
      close();
      setTimeout(function () { go(-1); }, 80);
    });
    $(document).on('click', '.card-nav--next', function (e) {
      e.stopPropagation();
      close();
      setTimeout(function () { go(1); }, 80);
    });

    // 카드 바깥 클릭 → 닫기
    $(document).on('click', '#carousel', function (e) {
      if (!expanded) return;
      if (!$(e.target).closest('.card').length) close();
    });

    // 키보드
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (!$('#carousel').hasClass('active')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    });

    bindCarouselTouch();
    bindCarouselWheel();

    // 마우스
    $(document).on('mousedown', '#carousel', function (e) { onStart(e.clientX); });
    $(document).on('mousemove', '#carousel', function (e) { onMove(e.clientX); });
    $(document).on('mouseup',               function (e) { if (dragging) onEnd(e.clientX); });
  });
})();
