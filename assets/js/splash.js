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
   랜덤 문구와 위치, 자동 표시 + 호버
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function () {
  // 문구와 위치 배열: [text, topOffset, leftOffset]
  var TOOLTIPS = [
    ['NAGA', -48, 0],
    ['엎드려뻗쳐.', -60, -20],
    ['예지야!', -40, 20],
    ['태경아!!', -50, -10],
    ['혜인아!!!', -55, 10],
    ['주은아!', -45, -15],
    ['기훈아!!!!', -52, 15],
    ['점심 뭐먹니', -58, 0],
    ['언제까지 지각할래?', -42, -25],
    ['가은아!', -50, 25],
    ['수연아!', -47, -5],
    ['정수야!', -53, 5],
    ['지원아!', -49, -30],
    ['태연아!', -51, 30],
    ['선규야!', -46, 0],
    ['신비야!', -54, -8],
    ['연수야!', -44, 8]
  ];

  var $tooltip = $('#iosTooltip');
  var $target = $('#silingImg');
  var hideTimer = null;
  var autoTimer = null;

  function pickRandom() {
    return TOOLTIPS[Math.floor(Math.random() * TOOLTIPS.length)];
  }

  function showTooltip(tooltipData) {
    clearTimeout(hideTimer);
    var text = tooltipData[0];
    var topOffset = tooltipData[1];
    var leftOffset = tooltipData[2];

    $tooltip.text(text);

    // 위치 계산
    var rect = $target[0].getBoundingClientRect();
    $tooltip.css({ left: '-9999px', top: '-9999px', display: 'block' });
    var tw = $tooltip[0].offsetWidth;
    var x = rect.left + rect.width / 2 - tw / 2 + leftOffset;
    var y = rect.top + topOffset;

    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    $tooltip.css({ left: x + 'px', top: y + 'px' });
    $tooltip.addClass('is-visible');
  }

  function hideTooltip() {
    hideTimer = setTimeout(function () {
      $tooltip.removeClass('is-visible');
    }, 150);
  }

  function autoShow() {
    if (!$tooltip.hasClass('is-visible')) {
      var tooltipData = pickRandom();
      showTooltip(tooltipData);
      setTimeout(function () {
        $tooltip.removeClass('is-visible');
      }, 1000); // 1초 노출
    }
    // 다음 자동 표시: 5초마다
    autoTimer = setTimeout(autoShow, 5000);
  }

  $(document).ready(function () {
    // 호버 이벤트
    $target.on('mouseenter', function () {
      var tooltipData = pickRandom();
      showTooltip(tooltipData);
    });
    $target.on('mouseleave', hideTooltip);

    // 터치 이벤트
    $target.on('touchstart', function () {
      var tooltipData = pickRandom();
      showTooltip(tooltipData);
      setTimeout(function () { $tooltip.removeClass('is-visible'); }, 1000);
    });

    // 자동 표시 시작 (페이지 로드 후 3초부터)
    setTimeout(autoShow, 3000);
  });
})();
