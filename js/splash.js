(function () {
  const DURATION = 3200;

  function goToEnvelope() {
    $('#splash').removeClass('active');
    setTimeout(() => $('#envelope').addClass('active'), 420);
  }

  $(document).ready(function () {
    const timer = setTimeout(goToEnvelope, DURATION);

    $('#splash').one('click touchstart', function () {
      clearTimeout(timer);
      goToEnvelope();
    });
  });
})();
