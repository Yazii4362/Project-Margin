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

    // maker / cheerleader 먼저 제외
    var filtered = window.CARDS_DATA.filter(function (d) {
      return d.type !== 'maker' && d.type !== 'cheerleader';
    });

    var normalItems  = filtered.filter(function (d) { return d.type !== 'special'; });
    var specialItems = filtered.filter(function (d) { return d.type === 'special'; });

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
        ? '<div class="card-preview special-preview"><p class="special-question">?</p></div>'
        : '<div class="card-preview">'
            + '<p class="env-name">' + d.name + '</p>'
          + '</div>';

      $track.append(
        $('<div>').addClass(cls).attr('data-i', i).html(
          '<div class="card-bg" style="background-image:url(\'' + d.bgImage + '\')"></div>'
          + '<div class="card-grain"></div>'
          + preview
          + '<div class="card-opened">'
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
      if ($(e.target).closest('.card-link-btn').length) return;
      if (didDrag) { didDrag = false; return; }
      if ($(this).hasClass('card--special')) {
        if (typeof openTeamOverlay === 'function') openTeamOverlay();
        return;
      }
      expanded ? close() : open();
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

  /* ─── TEAM OVERLAY ─── */
  window.openTeamOverlay = function () {
    var makerRows = window.CARDS_DATA.filter(function (d) { return d.type === 'maker'; });
    makerRows.sort(function (a, b) {
      return (b.contribution || 0) - (a.contribution || 0);
    });
    var cheer     = window.CARDS_DATA.filter(function (d) { return d.type === 'cheerleader'; })[0];

    function makerCardHtml(d) {
      var c = typeof d.contribution === 'number' ? d.contribution : 0;
      var barPct = Math.min(100, Math.round((c / 35) * 100));
      var bio = d.teamBio || '';
      var links =
        '<div class="to-links">'
          + (d.github  ? '<a href="' + d.github  + '" target="_blank" rel="noopener" class="to-btn to-btn--gh">GitHub</a>' : '')
          + (d.tistory ? '<a href="' + d.tistory + '" target="_blank" rel="noopener" class="to-btn to-btn--ts">Blog</a>' : '')
          + (d.email   ? '<a href="mailto:' + d.email + '" class="to-btn to-btn--mail">✉</a>' : '')
        + '</div>';
      return '<article class="to-card">'
        + '<div class="to-card-top">'
          + '<div class="to-avatar" aria-hidden="true"><div class="to-avatar-init">' + d.name.slice(-1) + '</div></div>'
          + '<div class="to-card-head">'
            + '<h3 class="to-name">' + d.name + '</h3>'
            + '<p class="to-role">' + (d.role || '') + '</p>'
          + '</div>'
        + '</div>'
        + (bio ? '<p class="to-bio">' + bio + '</p>' : '')
        + '<div class="to-contrib" role="group" aria-label="기여도">'
          + '<div class="to-contrib-meta">'
            + '<span class="to-contrib-label">기여도</span>'
            + '<span class="to-contrib-num">' + c + '</span>'
          + '</div>'
          + '<div class="to-contrib-track"><div class="to-contrib-fill" style="width:' + barPct + '%"></div></div>'
        + '</div>'
        + (d.email ? '<p class="to-email">' + d.email + '</p>' : '')
        + links
        + '</article>';
    }

    var teamGridHtml = makerRows.map(makerCardHtml).join('');

    var cheerHtml = '';
    if (cheer) {
      cheerHtml =
        '<div class="to-cheer-wrap" role="region" aria-label="치어">'
          + '<p class="to-cheer-head">응원 스쿼드</p>'
          + '<div class="to-cheer-card">'
            + '<div class="to-cheer-avatar"><span class="to-cheer-initial">' + cheer.name.slice(-1) + '</span></div>'
            + '<div class="to-cheer-text">'
              + '<p class="to-cheer-kicker">치어리더</p>'
              + '<p class="to-cheer-name">' + cheer.name + '</p>'
            + '</div>'
          + '</div>'
        + '</div>';
    }

    var html = '<div id="teamOverlay" class="to-overlay">'
      + '<button type="button" class="to-close" id="teamOverlayClose" aria-label="닫기">✕</button>'
      + '<div class="to-inner">'
        + '<header class="to-hero">'
          + '<p class="to-kicker">스승의 날 · Rolling paper</p>'
          + '<img src="assets/images/margin.svg" alt="Margin" class="to-logo" />'
          + '<h2 class="to-heading">만든이들</h2>'
          + '<p class="to-lead">선생님께 전하는 마음을, 기획·디자인·개발로 하나로 엮었어요.</p>'
          + '<span class="to-divider" aria-hidden="true"></span>'
        + '</header>'
        + '<div class="to-panel">'
          + '<section class="to-section" aria-labelledby="to-team-label">'
            + '<p id="to-team-label" class="to-section-label">Team</p>'
            + '<div class="to-grid">' + teamGridHtml + '</div>'
            + '<p class="to-legend">기여도는 팀 내 상대 가중치예요. (임예지 35 · 김주은 30 · 신혜인 25 · 윤태경 20)</p>'
          + '</section>'
          + cheerHtml
        + '</div>'
        + '<p class="to-foot">ESC 또는 우측 상단 ✕ 로 닫을 수 있어요</p>'
      + '</div>'
    + '</div>';

    $('body').append(html);
    requestAnimationFrame(function () {
      $('#teamOverlay').addClass('is-open');
    });

    $('#teamOverlayClose').on('click', window.closeTeamOverlay);
    $(document).on('keydown.teamOverlay', function (e) {
      if (e.key === 'Escape') window.closeTeamOverlay();
    });
  };

  window.closeTeamOverlay = function () {
    var $o = $('#teamOverlay');
    $o.removeClass('is-open');
    setTimeout(function () { $o.remove(); }, 400);
    $(document).off('keydown.teamOverlay');
  };

})();
