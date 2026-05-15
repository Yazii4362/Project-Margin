(function () {
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    if (window.MarginCursor && typeof window.MarginCursor.enterGrabMode === 'function') {
      window.MarginCursor.enterGrabMode();
    } else {
      document.body.style.cursor = 'grab';
    }

    const $env = $('#envelopeEl');
    const $seal = $('#envelopeSeal');

    // 1. 씰 떼기 시작
    $env.addClass('peeling');

    // 2. 씰 사라지는 중간쯤 자국 추가 (주석 처리 - 자국 표시 안 함)
    // setTimeout(function () {
    //   var sealRect = document.getElementById('envelopeSeal').getBoundingClientRect();
    //   var envRect  = document.getElementById('envelopeEl').getBoundingClientRect();
    //   var $mark = $('<div class="envelope-seal-mark"></div>').css({
    //     position: 'absolute',
    //     top:  sealRect.top  - envRect.top,
    //     left: sealRect.left - envRect.left,
    //     width:  sealRect.width,
    //     height: sealRect.height
    //   });
    //   $seal.after($mark);
    // }, 350);

    // 3. 씰 다 날아간 후 플랩 열기
    setTimeout(function () {
      $env.addClass('open');
    }, 500);

    // 4. 화면 전환
    setTimeout(function () {
      $('#hero').removeClass('active');
      setTimeout(function () {
        $('#carousel').addClass('active').attr('aria-hidden', 'false');
        $(document).trigger('carousel:init');
        // 캐러셀 진입 상태 저장
        if (window.StateManager) window.StateManager.saveScreen('carousel');
        // Sticky Nav 표시
        if (typeof window.showStickyNav === 'function') {
          window.showStickyNav();
        }
        // 안내 메시지 3초 후 페이드아웃
        setTimeout(function() {
          $('.carousel-instruction').addClass('fade-out');
        }, 3000);
      }, 900);
    }, 1100);
  }

  $(document).ready(function () {
    $('#envelopeEl').on('click', openEnvelope);

    // carousel 진입 시 커서 리셋
    $(document).on('carousel:init', function () {
      if (window.MarginCursor && typeof window.MarginCursor.exitGrabMode === 'function') {
        window.MarginCursor.exitGrabMode();
      } else {
        document.body.style.cursor = 'default';
      }
    });
  });
})();