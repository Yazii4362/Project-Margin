(function () {
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    const $env  = $('#envelopeEl');
    const $seal = $('#envelopeSeal');

    // 1. 씰 떼기 시작
    $env.addClass('peeling');

    // 2. 씰 사라지는 중간쯤 자국 추가
    setTimeout(function () {
      $seal.after('<div class="envelope-seal-mark"></div>');
    }, 350);

    // 3. 씰 다 날아간 후 플랩 열기
    setTimeout(function () {
      $env.addClass('open');
    }, 500);

    // 4. 화면 전환
    setTimeout(function () {
      $('#envelope').removeClass('active');
      setTimeout(function () {
        $('#carousel').addClass('active');
        $(document).trigger('carousel:init');
      }, 400);
    }, 1100);
  }

  $(document).ready(function () {
    $('#envelopeEl').on('click', openEnvelope);
  });
})();
