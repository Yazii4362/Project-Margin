(function () {
  var $stickyNav = $('#stickyNav');
  var $navItems = $('.sticky-nav-item');
  var $teamLockModal = $('#teamLockModal');
  var $teamLockProgressFill = $('#teamLockProgressFill');
  var $teamLockProgressText = $('#teamLockProgressText');

  // 읽은 카드 수 추적
  function getReadCardsCount() {
    var readCards = JSON.parse(localStorage.getItem('readCards') || '[]');
    return readCards.length;
  }

  function getTotalCards() {
    // 시크릿 카드 제외한 총 카드 수
    return window.CARDS_DATA ? window.CARDS_DATA.filter(function(card) {
      return card.type !== 'special';
    }).length : 13;
  }

  function isTeamUnlocked() {
    var readCount = getReadCardsCount();
    var totalCount = getTotalCards();
    return readCount >= totalCount;
  }

  // 네비게이션 표시 (봉투 열린 후)
  window.showStickyNav = function() {
    setTimeout(function() {
      $stickyNav.addClass('is-visible');
      updateCreditsIcon(); // 아이콘 상태 업데이트
    }, 500);
  };

  // Credits 아이콘 업데이트
  function updateCreditsIcon() {
    var $creditsIcon = $('#creditsIcon');
    if (isTeamUnlocked()) {
      $creditsIcon.text('👥');
    } else {
      $creditsIcon.text('❓');
    }
  }

  // 섹션 활성화 상태 업데이트
  function updateActiveNav(section) {
    $navItems.removeClass('active');
    $navItems.filter('[data-section="' + section + '"]').addClass('active');
  }

  // 팀 탭 아이콘 및 텍스트 업데이트 (잠금 상태에 따라)
  window.updateTeamTabUI = function() {
    var $creditsBtn = $navItems.filter('[data-section="credits"]');
    var $icon = $creditsBtn.find('.sticky-nav-icon');
    var $label = $creditsBtn.find('.sticky-nav-label');
    
    if (isTeamUnlocked()) {
      $icon.text('👥');
      $label.text('팀');
    } else {
      $icon.text('❓');
      $label.text('???');
    }
  };

  // 초기 로드 시 한 번 확인
  $(document).ready(function() {
    window.updateTeamTabUI();
  });

  // 네비게이션 클릭 이벤트
  $navItems.on('click', function() {
    var section = $(this).attr('data-section');
    
    if (section === 'hero') {
      // 편지함으로 이동
      $('.game-screen').removeClass('active').attr('aria-hidden', 'true');
      $('#hero').addClass('active').attr('aria-hidden', 'false');
      updateActiveNav('hero');
      
      // 다크 테마 해제
      $('body').removeClass('dark-theme');
    } 
    else if (section === 'carousel') {
      // 편지 섹션으로 이동
      $('.game-screen').removeClass('active').attr('aria-hidden', 'true');
      $('#carousel').addClass('active').attr('aria-hidden', 'false');
      updateActiveNav('carousel');
      
      // 안내 메시지 페이드아웃
      setTimeout(function() {
        $('.carousel-instruction').addClass('fade-out');
      }, 3000);
    } 
    else if (section === 'credits') {
      // 팀 섹션 - 잠금 확인
      if (isTeamUnlocked()) {
        // 잠금 해제됨 - 팀 페이지로 이동
        if (typeof window.openTeamOverlay === 'function') {
          window.openTeamOverlay();
          updateActiveNav('credits');
        }
      } else {
        // 잠금됨 - 모달 표시
        showTeamLockModal();
      }
    }
  });

  // 카드 읽음 상태 변경 감지 (아이콘 업데이트)
  $(document).on('card:read', function() {
    updateCreditsIcon();
  });

  // 팀 잠금 모달 표시
  function showTeamLockModal() {
    var readCount = getReadCardsCount();
    var totalCount = getTotalCards();
    var percentage = (readCount / totalCount) * 100;

    // 진행률 업데이트
    $teamLockProgressFill.css('width', percentage + '%');
    $teamLockProgressText.text(readCount + ' / ' + totalCount);

    // 모달 열기
    $teamLockModal.attr('aria-hidden', 'false');
  }

  // 팀 잠금 모달 닫기
  $('#teamLockBg, #teamLockClose').on('click', function() {
    $teamLockModal.attr('aria-hidden', 'true');
  });

  // ESC 키로 모달 닫기
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $teamLockModal.attr('aria-hidden') === 'false') {
      $teamLockModal.attr('aria-hidden', 'true');
    }
  });

  // 섹션 변경 감지 (다른 스크립트에서 호출)
  window.updateStickyNav = function(section) {
    updateActiveNav(section);
  };

  // Credits 페이지 열릴 때 네비게이션 업데이트
  var originalOpenTeamOverlay = window.openTeamOverlay;
  window.openTeamOverlay = function() {
    if (originalOpenTeamOverlay) {
      originalOpenTeamOverlay();
    }
    updateActiveNav('credits');
  };

  // Credits 페이지에서 뒤로가기 시 네비게이션 업데이트
  $(document).on('click', '#creditsBack', function() {
    updateActiveNav('carousel');
  });
})();
