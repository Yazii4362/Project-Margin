/**
 * 햅틱 피드백 유틸리티
 * iOS Safari 및 Android Chrome 지원
 */
(function() {
  'use strict';

  var HapticFeedback = {
    // 햅틱 지원 여부 확인
    isSupported: function() {
      return 'vibrate' in navigator || ('hapticFeedback' in navigator);
    },

    // 가벼운 탭 (카드 터치, 버튼 클릭)
    light: function() {
      if (this.isSupported()) {
        navigator.vibrate && navigator.vibrate(10);
      }
    },

    // 중간 강도 (카드 넘기기, 중요한 액션)
    medium: function() {
      if (this.isSupported()) {
        navigator.vibrate && navigator.vibrate(20);
      }
    },

    // 강한 피드백 (성공, 완료)
    heavy: function() {
      if (this.isSupported()) {
        navigator.vibrate && navigator.vibrate([30, 10, 30]);
      }
    },

    // 에러/경고
    error: function() {
      if (this.isSupported()) {
        navigator.vibrate && navigator.vibrate([50, 30, 50, 30, 50]);
      }
    },

    // 성공
    success: function() {
      if (this.isSupported()) {
        navigator.vibrate && navigator.vibrate([20, 10, 20]);
      }
    }
  };

  // 전역으로 노출
  window.HapticFeedback = HapticFeedback;

  // 이벤트 리스너 등록
  $(document).ready(function() {
    
    // 봉투 클릭
    $(document).on('click', '#envelopeEl', function() {
      HapticFeedback.medium();
    });

    // 카드 클릭
    $(document).on('click', '.card.is-active', function() {
      HapticFeedback.light();
    });

    // 카드 넘기기 (스와이프 완료 시)
    var originalGo = window.carouselGo;
    if (typeof originalGo === 'function') {
      window.carouselGo = function() {
        HapticFeedback.medium();
        originalGo.apply(this, arguments);
      };
    }

    // 네비게이션 버튼
    $(document).on('click', '.sticky-nav-item', function() {
      HapticFeedback.light();
    });

    // 편지 열기 버튼
    $(document).on('click', '.cr-letter-btn, .cr-cheer-btn', function() {
      HapticFeedback.light();
    });

    // 모든 카드 읽음 (팀 페이지 잠금 해제)
    $(document).on('team:unlocked', function() {
      HapticFeedback.success();
    });

    // 링크 버튼
    $(document).on('click', 'a.cr-btn, a.to-btn', function() {
      HapticFeedback.light();
    });
  });

})();
