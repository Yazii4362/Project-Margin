/**
 * 스플래시 → 봉투 전환
 * #envelope에 .active가 없으면 GSAP .from()의 목표 opacity가 항상 0이라
 * 인라인 opacity:0이 남아 봉투가 영구히 안 보이는 문제가 생김 → fromTo + 타이밍으로 복구
 */
gsap.fromTo(
  '.splash-blur',
  { opacity: 1 },
  { opacity: 0, duration: 2.8, ease: 'power2.out' }
);

gsap.to('#splash', {
  opacity: 1,
  scale: 1,
  duration: 1.8,
  ease: 'power2.out',
});

$(function () {
  var isAnimating = false;

  $('#splash').on('click', function () {
    if (isAnimating) return;
    isAnimating = true;

    var tl = gsap.timeline({
      onComplete: function () {
        $('#splash').removeClass('active');
        $('#envelope').addClass('active');
        gsap.set('#envelope', { clearProps: 'opacity,transform' });
        gsap.set('#splash', { clearProps: 'opacity,transform' });
        isAnimating = false;
      },
    });

    tl.to('.splash-inner > *', {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    })
      .to(
        '#splash',
        {
          y: '-100%',
          duration: 1,
          ease: 'power4.inOut',
        },
        '-=0.3'
      )
      .add(function () {
        $('#envelope').addClass('active');
      }, '-=0.8')
      .fromTo(
        '#envelope',
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
        },
        '<'
      );
  });
});
