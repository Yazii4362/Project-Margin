(function () {
  var $credits  = $('#credits');
  var $carousel = $('#carousel');
  var $modal    = $('#makerCardModal');
  var $envelope = $('#modalEnvelope');
  var $txtEl    = $('#modalLetterText');
  var $fromEl   = $('#modalLetterSender');

  /* ─── ScrollTrigger 초기화 ─── */
  function initScrollAnimations() {
    // GSAP ScrollTrigger 플러그인 등록
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 크레딧 섹션이 활성화될 때만 애니메이션 실행
    if (!$credits.hasClass('active')) return;

    // ScrollTrigger 컨텍스트 설정 (스크롤 컨테이너 지정)
    var scrollContainer = $credits.find('.cr-scroll')[0];
    
    // 헤더 애니메이션
    gsap.to('.cr-header', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cr-header',
        scroller: scrollContainer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 카드 순차 애니메이션
    gsap.to('.cr-card', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cr-grid',
        scroller: scrollContainer,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    // 치어리더 애니메이션
    gsap.to('.cr-cheer', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cr-cheer',
        scroller: scrollContainer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 푸터 애니메이션
    gsap.to('.cr-footer', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cr-footer',
        scroller: scrollContainer,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ─── 시크릿카드 → 크레딧 섹션 전환 ─── */
  window.openTeamOverlay = function () {
    $carousel.removeClass('active').attr('aria-hidden', 'true');
    $credits.addClass('active').attr('aria-hidden', 'false');
    
    // 스크롤 상단으로 리셋
    var scroll = $credits.find('.cr-scroll')[0];
    if (scroll) scroll.scrollTop = 0;

    // 애니메이션 초기 상태로 리셋
    gsap.set(['.cr-header', '.cr-card', '.cr-cheer', '.cr-footer'], {
      opacity: 0,
      y: function(index, target) {
        if (target.classList.contains('cr-header')) return 30;
        if (target.classList.contains('cr-card')) return 40;
        if (target.classList.contains('cr-cheer')) return 30;
        if (target.classList.contains('cr-footer')) return 20;
        return 0;
      }
    });

    // ScrollTrigger 초기화 및 애니메이션 시작
    setTimeout(function() {
      ScrollTrigger.refresh();
      initScrollAnimations();
    }, 100);
  };

  /* ─── 처음으로 버튼 ─── */
  $(document).on('click', '#creditsBack', function () {
    // ScrollTrigger 인스턴스 제거
    ScrollTrigger.getAll().forEach(function(trigger) {
      trigger.kill();
    });
    
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
