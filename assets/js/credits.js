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

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     커피사주기 모달
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  var $coffeeModal = $('#coffeeModal');
  var $coffeeDesc = $('#coffeeDesc');
  var $coffeeLinks = $('#coffeeLinks');

  // 각 제작자별 커피 링크 정보
  var coffeeData = {
    'yeji': {
      name: '임예지',
      links: [
        { type: 'primary', icon: '☕', text: '카카오페이로 커피 사주기', url: 'https://qr.kakaopay.com/your-link' },
        { type: 'secondary', icon: '💝', text: '토스로 응원하기', url: 'https://toss.me/your-id' }
      ]
    },
    'jooeun': {
      name: '김주은',
      links: [
        { type: 'primary', icon: '☕', text: '카카오페이로 커피 사주기', url: 'https://qr.kakaopay.com/jooeun' },
        { type: 'secondary', icon: '💝', text: '토스로 응원하기', url: 'https://toss.me/jooeun' }
      ]
    },
    'hyein': {
      name: '신혜인',
      links: [
        { type: 'primary', icon: '☕', text: '카카오페이로 커피 사주기', url: 'https://qr.kakaopay.com/hyein' },
        { type: 'secondary', icon: '💝', text: '토스로 응원하기', url: 'https://toss.me/hyein' }
      ]
    },
    'taekyung': {
      name: '윤태경',
      links: [
        { type: 'primary', icon: '☕', text: '카카오페이로 커피 사주기', url: 'https://qr.kakaopay.com/taekyung' },
        { type: 'secondary', icon: '💝', text: '토스로 응원하기', url: 'https://toss.me/taekyung' }
      ]
    }
  };

  // 아바타 더블클릭 이벤트
  $(document).on('dblclick', '.cr-avatar', function (e) {
    e.stopPropagation();
    var $card = $(this).closest('[data-maker]');
    var maker = $card.attr('data-maker');
    
    if (!maker || !coffeeData[maker]) return;
    
    var data = coffeeData[maker];
    
    // 모달 내용 업데이트
    $coffeeDesc.text(data.name + '님에게 응원의 마음을 전해보세요');
    
    // 링크 버튼 생성
    $coffeeLinks.empty();
    data.links.forEach(function(link) {
      var $link = $('<a>')
        .addClass('cr-coffee-link')
        .addClass('cr-coffee-link--' + link.type)
        .attr('href', link.url)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .html('<span class="cr-coffee-link-icon">' + link.icon + '</span><span>' + link.text + '</span>');
      $coffeeLinks.append($link);
    });
    
    // 모달 열기
    $coffeeModal.attr('aria-hidden', 'false');
  });

  // 커피 모달 닫기
  $(document).on('click', '#coffeeBg, #coffeeClose', function () {
    closeCoffeeModal();
  });

  // ESC 키로 커피 모달 닫기
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $coffeeModal.attr('aria-hidden') === 'false') {
      closeCoffeeModal();
    }
  });

  function closeCoffeeModal() {
    $coffeeModal.attr('aria-hidden', 'true');
  }
})();
