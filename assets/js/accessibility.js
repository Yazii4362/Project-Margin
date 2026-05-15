/**
 * 접근성 개선 스크립트
 * - 키보드 네비게이션 강화
 * - 포커스 관리
 * - ARIA 속성 동적 업데이트
 * - 스크린 리더 지원
 */
(function() {
  'use strict';

  var A11y = {
    // 현재 포커스 가능한 요소들
    focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    
    // 포커스 트랩 (모달용)
    trapFocus: function(container) {
      var $container = $(container);
      var $focusable = $container.find(this.focusableElements).filter(':visible');
      var $first = $focusable.first();
      var $last = $focusable.last();

      $container.on('keydown.focustrap', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === $first[0]) {
            e.preventDefault();
            $last.focus();
          }
        } else {
          // Tab
          if (document.activeElement === $last[0]) {
            e.preventDefault();
            $first.focus();
          }
        }
      });
    },

    // 포커스 트랩 해제
    releaseFocus: function(container) {
      $(container).off('keydown.focustrap');
    },

    // 포커스 표시 강화
    enhanceFocusIndicators: function() {
      // 마우스 클릭 시 포커스 링 숨김
      $(document).on('mousedown', function() {
        $('body').addClass('using-mouse');
      });

      // 키보드 사용 시 포커스 링 표시
      $(document).on('keydown', function(e) {
        if (e.key === 'Tab') {
          $('body').removeClass('using-mouse');
        }
      });
    },

    // 스킵 링크 추가
    addSkipLink: function() {
      var $skipLink = $('<a href="#carousel" class="skip-link">본문으로 건너뛰기</a>');
      $('body').prepend($skipLink);
    },

    // 라이브 리전 업데이트 (스크린 리더용)
    announce: function(message, priority) {
      var $liveRegion = $('#a11y-live-region');
      if (!$liveRegion.length) {
        $liveRegion = $('<div id="a11y-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>');
        $('body').append($liveRegion);
      }
      
      if (priority === 'assertive') {
        $liveRegion.attr('aria-live', 'assertive');
      } else {
        $liveRegion.attr('aria-live', 'polite');
      }
      
      $liveRegion.text(message);
      
      // 메시지 초기화
      setTimeout(function() {
        $liveRegion.text('');
      }, 1000);
    },

    // 카드 상태 업데이트
    updateCardState: function(cardIndex, totalCards) {
      this.announce(totalCards + '개 중 ' + (cardIndex + 1) + '번째 편지');
    },

    // 모달 열림/닫힘 관리
    handleModalOpen: function(modalId) {
      var $modal = $(modalId);
      $modal.attr('aria-hidden', 'false');
      this.trapFocus(modalId);
      
      // 첫 번째 포커스 가능한 요소에 포커스
      var $firstFocusable = $modal.find(this.focusableElements).filter(':visible').first();
      setTimeout(function() {
        $firstFocusable.focus();
      }, 100);
    },

    handleModalClose: function(modalId) {
      var $modal = $(modalId);
      $modal.attr('aria-hidden', 'true');
      this.releaseFocus(modalId);
    }
  };

  // 전역으로 노출
  window.A11y = A11y;

  // 초기화
  $(document).ready(function() {
    A11y.enhanceFocusIndicators();
    A11y.addSkipLink();

    // 카드 네비게이션 키보드 지원 강화
    $(document).on('keydown', function(e) {
      var $activeScreen = $('.screen.active');
      
      // 캐러셀 섹션에서만 작동
      if ($activeScreen.attr('id') !== 'carousel') return;

      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          A11y.announce('편지를 넘깁니다');
          break;
        case 'Enter':
        case ' ':
          if ($(e.target).hasClass('card')) {
            e.preventDefault();
            A11y.announce('편지를 엽니다');
          }
          break;
        case 'Escape':
          A11y.announce('편지를 닫습니다');
          break;
      }
    });

    // 모달 관리
    $(document).on('modal:open', function(e, modalId) {
      A11y.handleModalOpen(modalId);
    });

    $(document).on('modal:close', function(e, modalId) {
      A11y.handleModalClose(modalId);
    });

    // 섹션 전환 시 알림
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          var $target = $(mutation.target);
          if ($target.hasClass('screen') && $target.hasClass('active')) {
            var sectionName = $target.attr('id');
            var sectionLabel = {
              'hero': '편지함',
              'carousel': '편지 읽기',
              'credits': '만든이들'
            }[sectionName] || sectionName;
            
            A11y.announce(sectionLabel + ' 섹션으로 이동했습니다');
          }
        }
      });
    });

    $('.screen').each(function() {
      observer.observe(this, { attributes: true });
    });
  });

})();
