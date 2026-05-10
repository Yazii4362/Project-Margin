(function () {
  /* ─── CONFIG ─── */
  const OFFSET = 328;
  const SWIPE_TH = 50;
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  /* ─── STATE ─── */
  let cur = 0;
  let total = 0;
  let expanded = false;
  let dragging = false;
  let didDrag = false;
  let startX = 0;
  let $cards = null;
  let hintShown = false;

  /* ─── BUILD ─── */
  function build() {
    const $track = $('#carouselTrack');
    $track.empty();
    total = CARDS_DATA.length;

    CARDS_DATA.forEach(function (d, i) {
      const cls = d.type === 'special' ? 'card card--special' : 'card';
      const linkBtn = d.link
        ? `<a class="card-link-btn" href="${d.link}" target="_blank" rel="noopener">바로가기 →</a>`
        : '';

      const preview = d.type === 'special'
        ? `<div class="card-preview"><p class="special-question">?</p></div>`
        : `<div class="card-preview">
            <div class="env-body"><div class="env-seal"></div></div>
            <p class="env-name">${d.name}</p>
          </div>`;

      $track.append(
        $('<div>').addClass(cls).attr('data-i', i).html(`
          <div class="card-bg" style="background-image:url('${d.bgImage}')"></div>
          <div class="card-grain"></div>
          ${preview}
          <div class="card-opened">
            <button class="card-close" aria-label="닫기">✕</button>
            <p class="letter-name">${d.name}</p>
            <p class="letter-msg">${d.message}</p>
            ${linkBtn}
          </div>
        `)
      );
    });

    $cards = $track.find('.card');
    cur = 0;
    place(false);

    // 첫 진입 스와이프 힌트
    setTimeout(swipeHint, 2000);
  }

  /* ─── SWIPE HINT ─── */
  function swipeHint() {
    if (hintShown || expanded) return;
    hintShown = true;
    const $active = $cards.filter('.is-active');
    $active.addClass('hint-nudge');
    setTimeout(() => $active.removeClass('hint-nudge'), 1000);
  }

  /* ─── PLACE ─── */
  function place(anim, drag) {
    const half = Math.floor(total / 2);

    $cards.each(function (i) {
      if (expanded && $(this).hasClass('is-open')) return;

      let rel = i - cur;
      if (rel > half) rel -= total;
      if (rel < -half) rel += total;

      const x = rel * OFFSET + (drag || 0);
      const abs = Math.abs(rel);

      $(this).removeClass('is-active is-prev is-next is-far');
      if (rel === 0) $(this).addClass('is-active');
      else if (rel === -1) $(this).addClass('is-prev');
      else if (rel === 1) $(this).addClass('is-next');
      else $(this).addClass('is-far');

      $(this).css({
        transition: anim ? `transform 0.65s ${EASE}, opacity 0.5s ${EASE}, filter 0.5s ${EASE}` : 'none',
        transform: `translateX(${x}px)`,
        zIndex: total - abs
      });
    });

    updateBar();
  }

  /* ─── PROGRESS ─── */
  function updateBar() {
    $('#progressFill').css('width', ((cur + 1) / total * 100) + '%');
    const isSpecial = $cards.eq(cur).hasClass('card--special');
    $('body').toggleClass('dark-theme', isSpecial);
  }

  /* ─── NAVIGATE ─── */
  function go(dir) {
    cur = ((cur + dir) % total + total) % total;
    place(true);
  }

  /* ─── EXPAND ─── */
  function open() {
    if (expanded) return;
    expanded = true;
    const $c = $cards.filter('.is-active');
    $c.addClass('is-open').css({
      transition: `transform 0.65s ${EASE}`,
      transform: 'translateX(0px) scale(1.5)',
      zIndex: 999
    });
    $('#carousel').addClass('has-open');
  }

  function close() {
    if (!expanded) return;
    expanded = false;
    $cards.removeClass('is-open');
    $('#carousel').removeClass('has-open');
    $cards.css({ transition: '', transform: '', zIndex: '' });
    place(true);
  }

  /* ─── DRAG ─── */
  function onStart(x) {
    if (expanded) return;
    startX = x;
    dragging = true;
    didDrag = false;
  }

  function onMove(x) {
    if (!dragging) return;
    const dx = x - startX;
    place(false, dx * (Math.abs(dx) > 100 ? 0.4 : 0.8));
  }

  function onEnd(x) {
    if (!dragging) return;
    dragging = false;
    const diff = startX - x;
    if (diff > SWIPE_TH) { didDrag = true; go(1); }
    else if (diff < -SWIPE_TH) { didDrag = true; go(-1); }
    else { place(true); }
  }

  /* ─── EVENTS ─── */
  $(document).ready(function () {
    $(document).on('carousel:init', build);

    // 카드 클릭 → 열기
    $(document).on('click', '#carouselTrack .card.is-active', function (e) {
      if ($(e.target).hasClass('card-close') || $(e.target).closest('.card-close').length) return;
      if ($(e.target).hasClass('card-link-btn') || $(e.target).closest('.card-link-btn').length) return;
      if (didDrag) { didDrag = false; return; }
      expanded ? close() : open();
    });

    // × 버튼 클릭 → 닫기
    $(document).on('click', '.card-close', function (e) {
      e.stopPropagation();
      close();
    });

    // 열린 상태에서 카드 바깥 클릭 → 닫기
    $(document).on('click', '#carousel', function (e) {
      if (!expanded) return;
      if (!$(e.target).closest('.card').length) close();
    });

    // Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (!$('#carousel').hasClass('active')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });

    // 터치 — passive: false로 스크롤 방지
    document.querySelector('#carousel').addEventListener('touchstart', function (e) {
      onStart(e.touches[0].clientX);
    }, { passive: true });

    document.querySelector('#carousel').addEventListener('touchmove', function (e) {
      if (dragging) e.preventDefault();
      onMove(e.touches[0].clientX);
    }, { passive: false });

    document.querySelector('#carousel').addEventListener('touchend', function (e) {
      onEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // 마우스
    $(document).on('mousedown', '#carousel', function (e) { onStart(e.clientX); });
    $(document).on('mousemove', '#carousel', function (e) { onMove(e.clientX); });
    $(document).on('mouseup', function (e) { if (dragging) onEnd(e.clientX); });
  });
})();

function dropCards() {

  const $cards = $('#carouselTrack .card');

  $cards.each(function (i, el) {

    // 현재 위치 가져오기 (place() 결과)
    const currentTransform = $(el).css('transform');

    // GSAP으로 덮어쓰기
    gsap.fromTo(el,
      {
        y: -300,
        opacity: 0,
        scale: 0.8,
        rotation: Math.random() * 20 - 10
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: Math.random() * 6 - 3,
        duration: 0.9,
        delay: i * 0.12,
        ease: "bounce.out"
      }
    );

  });

}