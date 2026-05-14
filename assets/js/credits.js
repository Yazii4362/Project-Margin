(function () {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     STATE MANAGER — 새로고침 위치 복원
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  var KEY_SCREEN = 'pm_screen';
  var KEY_CARD   = 'pm_card';

  window.StateManager = {
    saveScreen: function (name) {
      try { sessionStorage.setItem(KEY_SCREEN, name); } catch(e) {}
    },
    saveCard: function (idx) {
      try { sessionStorage.setItem(KEY_CARD, String(idx)); } catch(e) {}
    },
    getScreen: function () {
      try { return sessionStorage.getItem(KEY_SCREEN); } catch(e) { return null; }
    },
    getCard: function () {
      try { var v = sessionStorage.getItem(KEY_CARD); return v !== null ? parseInt(v, 10) : 0; }
      catch(e) { return 0; }
    }
  };

  /* ─── 복원: 새로고침 시 마지막 화면으로 점프 ─── */
  $(document).ready(function () {
    var screen = window.StateManager.getScreen();

    if (screen === 'carousel' || screen === 'credits') {
      // 스플래시/봉투 스킵 → 바로 캐러셀
      $('#hero').removeClass('active');
      $('#carousel').addClass('active').attr('aria-hidden', 'false');
      $(document).trigger('carousel:init');

      // 카드 위치 복원
      $(document).one('carousel:ready', function () {
        var idx = window.StateManager.getCard();
        if (idx > 0 && window.CarouselAPI) window.CarouselAPI.goTo(idx);
      });

      // credits 오버레이 복원
      if (screen === 'credits') {
        setTimeout(function () {
          if (typeof window.openTeamOverlay === 'function') window.openTeamOverlay();
        }, 400);
      }
    }
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CREDITS / TEAM OVERLAY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const $credits  = $('#credits');
  const $carousel = $('#carousel');

  // 뒤로가기
  $(document).on('click', '#creditsBack', function () {
    $credits.removeClass('active').attr('aria-hidden', 'true');
    $carousel.addClass('active').attr('aria-hidden', 'false');
    window.StateManager.saveScreen('carousel');
  });

})();
