// (function () {
//   const DURATION = 3200;

//   function goToEnvelope() {
//     $('#splash').removeClass('active');
//     setTimeout(() => $('#envelope').addClass('active'), 420);
//   }

//   $(document).ready(function () {
//     const timer = setTimeout(goToEnvelope, DURATION);

//     $('#splash').one('click touchstart', function () {
//       clearTimeout(timer);
//       goToEnvelope();
//     });
//   });
// })();

gsap.fromTo('.splash-blur',
  {
    opacity: 1
  },
  {
    opacity: 0,
    duration: 2.8,
    ease: 'power2.out'
  }
);

gsap.to('#splash', {
  opacity: 1,
},
{
  scale: 1,
  duration: 1.8,
  ease: 'power2.out'
});

$(function () {

  $('#splash').on('click', function () {

    // splash → envelope 전환
    $(this).removeClass('active');
    $('#envelope').addClass('active');

  });

});


// 화면전환 효과 1
$(function () {

  let isAnimating = false;

  $('#splash').on('click', function () {

    if (isAnimating) return;
    isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        $('#splash').removeClass('active');
        $('#envelope').addClass('active');
        isAnimating = false;
      }
    });

    // 1. 텍스트 사라짐
    tl.to('.splash-inner > *', {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    })

      // 2. 화면 위로 올라감 (핵심)
      .to('#splash', {
        y: "-100%",
        duration: 1,
        ease: "power4.inOut"
      }, "-=0.3")

      // 3. envelope 미리 준비
      .from('#envelope', {
        y: "100%",
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.8");

  });

});