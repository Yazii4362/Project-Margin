(function () {
  let opened = false;

  function skipToCarousel() {
    $('#hero').removeClass('active').hide();
    $('#carousel').addClass('active').attr('aria-hidden', 'false');
    $(document).trigger('carousel:init');
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;

    // StateManager 우선, 없으면 localStorage 폴백
    if (window.StateManager) {
      window.StateManager.saveScreen('carousel');
    } else {
      localStorage.setItem('envelopeOpened', 'true');
    }

    document.body.style.cursor = 'grab';

    const $env  = $('#envelopeEl');
    const $seal = $('#envelopeSeal');

    $env.addClass('peeling');

    setTimeout(function () {
      var sealRect = document.getElementById('envelopeSeal').getBoundingClientRect();
      var envRect  = document.getElementById('envelopeEl').getBoundingClientRect();
      var $mark = $('<div class="envelope-seal-mark"></div>').css({
        position: 'absolute',
        top:    sealRect.top  - envRect.top,
        left:   sealRect.left - envRect.left,
        width:  sealRect.width,
        height: sealRect.height
      });
      $seal.after($mark);
    }, 350);

    setTimeout(function () { $env.addClass('open'); }, 500);

    setTimeout(function () {
      $('#hero').removeClass('active');
      setTimeout(function () {
        $('#hero').hide();
        $('#carousel').addClass('active').attr('aria-hidden', 'false');
        $(document).trigger('carousel:init');
        document.body.style.cursor = 'default';
      }, 900);
    }, 1100);
  }

  $(document).ready(function () {
    // 이미 봉투를 열었던 세션이면 바로 캐러셀로
    var alreadyOpened = (window.StateManager && window.StateManager.getScreen())
      || localStorage.getItem('envelopeOpened') === 'true';

    if (alreadyOpened) {
      skipToCarousel();
      return;
    }

    $('#envelopeEl').on('click', openEnvelope);

    $(document).on('carousel:init', function () {
      document.body.style.cursor = 'default';
    });
  });
})();