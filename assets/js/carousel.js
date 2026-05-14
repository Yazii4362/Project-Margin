(function () {
  var OFFSET = 328;
  var SWIPE_TH = 50;
  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  var cur = 0;
  var total = 0;
  var expanded = false;
  var dragging = false;
  var didDrag = false;
  var startX = 0;
  var $cards = null;
  var hintShown = false;
  var touchBound = false;

  function build() {
    if (typeof window.CARDS_DATA === 'undefined' || !window.CARDS_DATA.length) {
      return;
    }

    var $track = $('#carouselTrack');
    $track.empty();
    total = window.CARDS_DATA.length;

    window.CARDS_DATA.forEach(function (d, i) {
      var cls = d.type === 'special' ? 'card card--special' : 'card';
      var linkBtn = d.link
        ? '<a class="card-link-btn" href="' +
          d.link +
          '" target="_blank" rel="noopener">바로가기 →</a>'
        : '';

      var preview =
        d.type === 'special'
          ? '<div class="card-preview"><p class="special-question">?</p></div>'
          : '<div class="card-preview">' +
            '<div class="env-body"><div class="env-seal"></div></div>' +
            '<p class="env-name">' +
            d.name +
            '</p>' +
            '</div>';

      $track.append(
        $('<div>')
          .addClass(cls)
          .attr('data-i', i)
          .html(
            '<div class="card-bg" style="background-image:url(\'' +
              d.bgImage +
              '\')"></div>' +
              '<div class="card-grain"></div>' +
              preview +
              '<div class="card-opened">' +
              '<button class="card-close" aria-label="닫기">✕</button>' +
              '<p class="letter-name">' +
              d.name +
              '</p>' +
              '<p class="letter-msg">' +
              d.message +
              '</p>' +
              linkBtn +
              '</div>'
          )
      );
    });

    $cards = $track.find('.card');
    cur = 0;
    place(false);

    setTimeout(swipeHint, 2000);
  }

  function swipeHint() {
    if (hintShown || expanded || !$cards) return;
    hintShown = true;
    var $active = $cards.filter('.is-active');
    $active.addClass('hint-nudge');
    setTimeout(function () {
      $active.removeClass('hint-nudge');
    }, 1000);
  }

  function place(anim, drag) {
    if (!$cards || !total) return;

    var half = Math.floor(total / 2);

    $cards.each(function (i) {
      if (expanded && $(this).hasClass('is-open')) return;

      var rel = i - cur;
      if (rel > half) rel -= total;
      if (rel < -half) rel += total;

      var x = rel * OFFSET + (drag || 0);
      var abs = Math.abs(rel);

      $(this).removeClass('is-active is-prev is-next is-far');
      if (rel === 0) $(this).addClass('is-active');
      else if (rel === -1) $(this).addClass('is-prev');
      else if (rel === 1) $(this).addClass('is-next');
      else $(this).addClass('is-far');

      $(this).css({
        transition: anim
          ? 'transform 0.65s ' + EASE + ', opacity 0.5s ' + EASE + ', filter 0.5s ' + EASE
          : 'none',
        transform: 'translateX(' + x + 'px)',
        zIndex: total - abs,
      });
    });

    updateBar();
  }

  function updateBar() {
    if (!total) return;
    $('#progressFill').css('width', ((cur + 1) / total) * 100 + '%');
    var isSpecial = $cards && $cards.eq(cur).hasClass('card--special');
    $('body').toggleClass('dark-theme', !!isSpecial);
  }

  function go(dir) {
    if (!total) return;
    cur = ((cur + dir) % total + total) % total;
    place(true);
  }

  function open() {
    if (expanded || !$cards) return;
    expanded = true;
    var $c = $cards.filter('.is-active');
    $c.addClass('is-open').css({
      transition: 'transform 0.45s ' + EASE + ', width 0.45s ' + EASE + ', height 0.45s ' + EASE + ', top 0.45s ' + EASE + ', left 0.45s ' + EASE,
      zIndex: 999,
    });
    $('#carousel').addClass('has-open');
  }

  function close() {
    if (!expanded) return;
    expanded = false;
    if ($cards) $cards.removeClass('is-open');
    $('#carousel').removeClass('has-open');
    if ($cards) {
      $cards.css({ transition: '', transform: '', zIndex: '' });
    }
    place(true);
  }

  function onStart(x) {
    if (expanded) return;
    startX = x;
    dragging = true;
    didDrag = false;
  }

  function onMove(x) {
    if (!dragging) return;
    var dx = x - startX;
    place(false, dx * (Math.abs(dx) > 100 ? 0.4 : 0.8));
  }

  function onEnd(x) {
    if (!dragging) return;
    dragging = false;
    var diff = startX - x;
    if (diff > SWIPE_TH) {
      didDrag = true;
      go(1);
    } else if (diff < -SWIPE_TH) {
      didDrag = true;
      go(-1);
    } else {
      place(true);
    }
  }

  function bindCarouselTouch() {
    var el = document.getElementById('carousel');
    if (!el || touchBound) return;
    touchBound = true;

    el.addEventListener(
      'touchstart',
      function (e) {
        onStart(e.touches[0].clientX);
      },
      { passive: true }
    );

    el.addEventListener(
      'touchmove',
      function (e) {
        if (dragging) e.preventDefault();
        onMove(e.touches[0].clientX);
      },
      { passive: false }
    );

    el.addEventListener(
      'touchend',
      function (e) {
        onEnd(e.changedTouches[0].clientX);
      },
      { passive: true }
    );
  }

  $(document).ready(function () {
    $(document).on('carousel:init', build);

    $(document).on('click', '#carouselTrack .card.is-active', function (e) {
      if ($(e.target).hasClass('card-close') || $(e.target).closest('.card-close').length)
        return;
      if ($(e.target).hasClass('card-link-btn') || $(e.target).closest('.card-link-btn').length)
        return;
      if (didDrag) {
        didDrag = false;
        return;
      }
      expanded ? close() : open();
    });

    $(document).on('click', '.card-close', function (e) {
      e.stopPropagation();
      close();
    });

    $(document).on('click', '#carousel', function (e) {
      if (!expanded) return;
      if (!$(e.target).closest('.card').length) close();
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (!$('#carousel').hasClass('active')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });

    bindCarouselTouch();

    $(document).on('mousedown', '#carousel', function (e) {
      onStart(e.clientX);
    });
    $(document).on('mousemove', '#carousel', function (e) {
      onMove(e.clientX);
    });
    $(document).on('mouseup', function (e) {
      if (dragging) onEnd(e.clientX);
    });
  });
})();
