(function () {
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    const $env = $('#envelopeEl');
    const $seal = $('#envelopeSeal');

    // 1. 씰 떼기 시작
    $env.addClass('peeling');

    // 2. 씰 사라지는 중간쯤 자국 추가
    // setTimeout(function () {
    //   $seal.after('<div class="envelope-seal-mark"></div>');
    // }, 350);

    setTimeout(function () {

      const offset = $seal.position(); // 부모 기준 좌표

      const $mark = $('<div class="envelope-seal-mark"></div>').css({
        position: 'absolute',
        top: '20%',
        left: '50%',
        width: $seal.outerWidth(),
        height: $seal.outerHeight()
      });

      $seal.after($mark);

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
      }, 900);
    }, 1100);
  }

  $(document).ready(function () {
    $('#envelopeEl').on('click', openEnvelope);
  });
})();

