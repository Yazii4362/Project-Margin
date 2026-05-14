gsap.fromTo(
  '.splash-blur',
  { opacity: 1 },
  { opacity: 0, duration: 2.8, ease: 'power2.out' }
);

gsap.from('#hero .hero-inner > *', {
  y: 24,
  opacity: 0,
  duration: 1.2,
  ease: 'power2.out',
  stagger: 0.08,
});

gsap.to('#hero', {
  opacity: 1,
  duration: 1.4,
  ease: 'power2.out',
});

if (window.ScrollSmoother && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollSmoother);
  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true,
    normalizeScroll: true,
    preventOverscroll: true,
  });
}

$(function () {
  // Hero screen only displays the initial greeting and envelope.
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SILING HOVER TOOLTIP
   가중치: NAGA/엎드려뻗쳐 = 20% 확률
           예지야!/태경아!! 등 7개 = 동일 확률
           나머지 이름들 = 기본 확률
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function () {
  // 가중치 배열: [text, weight]
  var WEIGHTED = [
    // 최고빈도 — 합산 20% (각 10%)
    ['NAGA', 10],
    ['엎드려뻗쳐.', 10],
    // 중간빈도 — 각 6%
    ['예지야!', 6],
    ['태경아!!', 6],
    ['혜인아!!!', 6],
    ['주은아!', 6],
    ['기훈아!!!!', 6],
    ['점심 뭐먹니', 6],
    ['언제까지 지각할래?', 6],
    // 기본빈도 — 각 4%
    ['가은아!', 4],
    ['수연아!', 4],
    ['정수야!', 4],
    ['지원아!', 4],
    ['태연아!', 4],
    ['선규야!', 4],
    ['신비야!', 4],
    ['연수야!', 4]
  ];

  // 가중치 누적합 빌드
  var totalWeight = 0;
  var cumulative = WEIGHTED.map(function (item) {
    totalWeight += item[1];
    return { text: item[0], cum: totalWeight };
  });

  var $tooltip  = $('#iosTooltip');
  var $target   = $('#silingImg');
  var hideTimer = null;
  var lastText  = '';

  function pickRandom() {
    var rand, picked;
    // 같은 문구 연속 방지 — 최대 3번 재시도
    for (var i = 0; i < 3; i++) {
      rand = Math.random() * totalWeight;
      picked = cumulative.find(function (c) { return rand < c.cum; });
      if (!picked) picked = cumulative[cumulative.length - 1];
      if (picked.text !== lastText) break;
    }
    lastText = picked.text;
    return picked.text;
  }

  function showTooltip() {
    clearTimeout(hideTimer);
    var text = pickRandom();
    $tooltip.text(text);

    // 위치: 씰 이미지 위 중앙
    var rect = $target[0].getBoundingClientRect();
    $tooltip.css({ left: '-9999px', top: '-9999px', display: 'block' });
    var tw = $tooltip[0].offsetWidth;
    var x  = rect.left + rect.width / 2 - tw / 2;
    var y  = rect.top - 48;

    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    $tooltip.css({ left: x + 'px', top: y + 'px' });
    $tooltip.addClass('is-visible');
  }

  function hideTooltip() {
    hideTimer = setTimeout(function () {
      $tooltip.removeClass('is-visible');
    }, 150);
  }

  $(document).ready(function () {
    $target.on('mouseenter', showTooltip);
    $target.on('mouseleave', hideTooltip);
    $target.on('touchstart', function () {
      showTooltip();
      setTimeout(function () { $tooltip.removeClass('is-visible'); }, 1400);
    });
  });
})();
