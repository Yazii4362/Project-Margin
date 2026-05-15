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

  /* ─── BGM 상태 추적 변수 ─── */
  var bgmWasPlayingBeforeCredits = false;

  /* ─── 시크릿카드 → 크레딧 섹션 전환 ─── */
  window.openTeamOverlay = function () {
    // BGM 현재 재생 상태 저장 및 일시정지
    var $audio = $('#bgmAudio');
    if ($audio.length) {
      var audio = $audio[0];
      bgmWasPlayingBeforeCredits = !audio.paused && !audio.ended;
      if (bgmWasPlayingBeforeCredits) {
        audio.pause();
      }
    }

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

    // BGM 재생 재개 (크레딧 진입 전에 재생 중이었다면)
    var $audio = $('#bgmAudio');
    if ($audio.length && bgmWasPlayingBeforeCredits) {
      var audio = $audio[0];
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(function() {
          // 자동 재생 실패 시 무시 (사용자가 수동으로 재생 가능)
        });
      }
      bgmWasPlayingBeforeCredits = false;
    }
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

  // 각 제작자별 테마 색상 (티켓 디자인용 - 상징색 적용)
  var ticketThemes = {
    'yeji':     { bg: '#87CEEB', text: '#0F172A' }, // 스카이블루 & 네이비
    'jooeun':   { bg: '#FF69B4', text: '#FFFFFF' }, // 핑크 & 화이트
    'hyein':    { bg: '#222222', text: '#FFFFFF' }, // 블랙 & 화이트
    'taekyung': { bg: '#4ADE80', text: '#064E3B' }  // 그린 & 다크그린
  };

  // 아바타 더블클릭 이벤트
  $(document).on('dblclick', '.cr-avatar', function (e) {
    e.stopPropagation();
    var $card = $(this).closest('[data-maker]');
    var maker = $card.attr('data-maker');
    
    if (!maker || !coffeeData[maker]) return;
    
    var data = coffeeData[maker];
    var theme = ticketThemes[maker] || { bg: '#FF5A36', text: '#FFFFFF' };
    
    // 모달 내용 업데이트
    $('#coffeeTitle').text(data.name);
    $coffeeDesc.html('☕ 마음을 전하는 커피 쿠폰<br><br>커피챗을 통해 가벼운 이야기를 나누거나,<br>따뜻한 커피 한 잔을 선물하며 응원해주세요!');
    
    // 테마 컬러 적용
    $('.cr-coffee-box.cr-ticket')[0].style.setProperty('--ticket-bg', theme.bg);
    $('.cr-coffee-box.cr-ticket')[0].style.setProperty('--ticket-text', theme.text);
    
    // 링크 버튼 생성
    $coffeeLinks.empty();
    data.links.forEach(function(link) {
      var $link = $('<a>')
        .addClass('cr-coffee-link')
        .addClass('cr-coffee-link--' + link.type)
        .attr('href', link.url)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .html('<span>' + link.text + '</span>');
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
