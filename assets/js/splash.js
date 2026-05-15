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
  onComplete: function() {
    // 스플래시 애니메이션 완료 후 커서 표시
    document.documentElement.classList.add('splash-complete');
  }
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
  // Hero game-screen only displays the initial greeting and envelope.
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SILING HOVER TOOLTIP
   랜덤 문구와 위치, 자동 표시 + 호버
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function () {
  // 가중치: 배열에 여러 번 넣어서 확률 조정
  var TOOLTIPS = [
    // 최고빈도 - NAGA (×10)
    'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA', 'NAGA',
    
    // 높은빈도 - 긴 멘트들 (×7)
    '점심 뭐먹니', '점심 뭐먹니', '점심 뭐먹니', '점심 뭐먹니', '점심 뭐먹니', '점심 뭐먹니', '점심 뭐먹니',
    '엎드려뻗쳐.', '엎드려뻗쳐.', '엎드려뻗쳐.', '엎드려뻗쳐.', '엎드려뻗쳐.', '엎드려뻗쳐.', '엎드려뻗쳐.',
    '언제까지 지각할래?', '언제까지 지각할래?', '언제까지 지각할래?', '언제까지 지각할래?', '언제까지 지각할래?', '언제까지 지각할래?', '언제까지 지각할래?',
    
    // 중간빈도 - 혜인, 태경 (×5)
    '혜인아!!!', '혜인아!!!', '혜인아!!!', '혜인아!!!', '혜인아!!!',
    '태경아!!', '태경아!!', '태경아!!', '태경아!!', '태경아!!',
    
    // 중간빈도 - 가은, 신비, 지원 (×4)
    '가은아!', '가은아!', '가은아!', '가은아!',
    '신비야!', '신비야!', '신비야!', '신비야!',
    '지원아!', '지원아!', '지원아!', '지원아!',
    
    // 낮은빈도 - 주은, 예지, 기훈 (×2)
    '주은아!', '주은아!',
    '예지야!', '예지야!',
    '기훈아!!!!', '기훈아!!!!',
    
    // 기본빈도 - 나머지 (×1)
    '수연아!', '정수야!', '태연아!', '연수야!', '선규야!'
  ];

  var lastText = '';
  var $tooltip  = $('#iosTooltip');
  var $target   = $('#silingImg');
  var hideTimer = null;
  var autoTimer = null;

  function pickRandom() {
    var candidates = TOOLTIPS.filter(function (t) { return t !== lastText; });
    var text = candidates[Math.floor(Math.random() * candidates.length)];
    lastText = text;
    return text;
  }

  function showTooltip() {
    clearTimeout(hideTimer);

    // 매 호버마다 새 문구 + 랜덤 방향
    var text = pickRandom();
    $tooltip.text(text);

    var rect = $target[0].getBoundingClientRect();
    $tooltip.css({ left: '-9999px', top: '-9999px', display: 'block' });
    var tw = $tooltip[0].offsetWidth;
    var th = $tooltip[0].offsetHeight;

    // 0=위, 1=좌, 2=우 랜덤
    var dir = Math.floor(Math.random() * 3);
    var x, y;
    var jitter = (Math.random() - 0.5) * 50;

    $tooltip.removeClass('tooltip-top tooltip-left tooltip-right');

    if (dir === 0) {
      x = rect.left + rect.width / 2 - tw / 2 + jitter;
      y = rect.top - th - 12;
      $tooltip.addClass('tooltip-top');
    } else if (dir === 1) {
      x = rect.left - tw - 14;
      y = rect.top + rect.height / 2 - th / 2 + jitter * 0.5;
      $tooltip.addClass('tooltip-left');
    } else {
      x = rect.right + 14;
      y = rect.top + rect.height / 2 - th / 2 + jitter * 0.5;
      $tooltip.addClass('tooltip-right');
    }

    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - th - 8));

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
      showTooltip();
      setTimeout(function () {
        $tooltip.removeClass('is-visible');
      }, 2000);
    }
    autoTimer = setTimeout(autoShow, 5000);
  }

  $(document).ready(function () {
    $target.on('mouseenter', function () {
      showTooltip();
    });
    $target.on('mouseleave', hideTooltip);

    $target.on('touchstart', function () {
      showTooltip();
      setTimeout(function () { $tooltip.removeClass('is-visible'); }, 2000);
    });

    setTimeout(function () { autoShow(); }, 3000);

    // carousel 진입 시 툴팁 숨기고 타이머 멈춤
    $(document).on('carousel:init', function () {
      clearTimeout(autoTimer);
      $tooltip.removeClass('is-visible');
    });
  });
})();
