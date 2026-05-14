(function () {
  var $credits  = $('#credits');
  var $carousel = $('#carousel');
  var $modal    = $('#makerCardModal');
  var $envelope = $('#modalEnvelope');
  var $txtEl    = $('#modalLetterText');
  var $fromEl   = $('#modalLetterSender');

  /* ─── 시크릿카드 → 크레딧 섹션 전환 ─── */
  window.openTeamOverlay = function () {
    $carousel.removeClass('active').attr('aria-hidden', 'true');
    $credits.addClass('active').attr('aria-hidden', 'false');
    // 스크롤 상단으로 리셋
    var scroll = $credits.find('.cr-scroll')[0];
    if (scroll) scroll.scrollTop = 0;
  };

  /* ─── 처음으로 버튼 ─── */
  $(document).on('click', '#creditsBack', function () {
    $credits.removeClass('active').attr('aria-hidden', 'true');
    $carousel.addClass('active').attr('aria-hidden', 'false');
  });

  /* ─── 편지 모달 열기 ─── */
  $(document).on('click', '.cr-letter-btn, .cr-cheer-btn', function (e) {
    e.stopPropagation();
    var $parent = $(this).closest('[data-id]');
    var id = parseInt($parent.attr('data-id'), 10);
    if (!window.CARDS_DATA) return;

    var data = window.CARDS_DATA.find(function (d) { return d.id === id; });
    if (!data) return;

    // 상태 초기화
    $envelope.removeClass('is-open');
    $txtEl.html('');
    $fromEl.text('');

    // 내용 세팅
    $txtEl.html(data.message);
    $fromEl.text('— ' + data.name);

    // 모달 표시
    $modal.attr('aria-hidden', 'false').addClass('is-active');
  });

  /* ─── 모달 닫기: 배경 / 닫기버튼 ─── */
  $(document).on('click', '#crModalBg, #crModalClose', function () {
    closeModal();
  });

  /* ─── 봉투 클릭 → 편지 열기 ─── */
  $(document).on('click', '#modalEnvelope', function () {
    if (!$envelope.hasClass('is-open')) {
      $envelope.addClass('is-open');
    }
  });

  /* ─── ESC 키 닫기 ─── */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.hasClass('is-active')) {
      closeModal();
    }
  });

  function closeModal() {
    $modal.removeClass('is-active').attr('aria-hidden', 'true');
    setTimeout(function () {
      $envelope.removeClass('is-open');
    }, 550);
  }
})();
