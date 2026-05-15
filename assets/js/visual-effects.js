/**
 * 시각적 효과 스크립트
 * - 리플 효과
 * - 카드 전환 애니메이션
 * - 파티클 효과
 */
(function() {
  'use strict';

  var VisualEffects = {
    // 리플 효과 생성
    createRipple: function(event, element) {
      var $element = $(element);
      var $ripple = $('<span class="ripple"></span>');
      
      var rect = element.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var x = event.clientX - rect.left - size / 2;
      var y = event.clientY - rect.top - size / 2;
      
      $ripple.css({
        width: size + 'px',
        height: size + 'px',
        left: x + 'px',
        top: y + 'px'
      });
      
      $element.append($ripple);
      
      setTimeout(function() {
        $ripple.remove();
      }, 600);
    },

    // 카드 읽음 플래시 효과
    flashCardRead: function(cardElement) {
      var $card = $(cardElement);
      $card.addClass('just-read');
      
      setTimeout(function() {
        $card.removeClass('just-read');
      }, 600);
    },

    // 파티클 버스트 효과
    createParticleBurst: function(x, y, color) {
      var particleCount = 12;
      var $container = $('<div class="particle-container"></div>').css({
        position: 'fixed',
        left: x + 'px',
        top: y + 'px',
        pointerEvents: 'none',
        zIndex: 9999
      });
      
      for (var i = 0; i < particleCount; i++) {
        var angle = (Math.PI * 2 * i) / particleCount;
        var velocity = 50 + Math.random() * 50;
        var tx = Math.cos(angle) * velocity;
        var ty = Math.sin(angle) * velocity;
        
        var $particle = $('<div class="particle"></div>').css({
          position: 'absolute',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color || 'var(--color-red)',
          '--tx': tx + 'px',
          '--ty': ty + 'px',
          animation: 'particle-burst 0.8s ease-out forwards'
        });
        
        $container.append($particle);
      }
      
      $('body').append($container);
      
      setTimeout(function() {
        $container.remove();
      }, 800);
    },

    // 카드 전환 애니메이션
    animateCardTransition: function(direction) {
      var $activeCard = $('.card.is-active');
      
      if (direction === 'next') {
        $activeCard.addClass('transitioning');
      } else {
        $activeCard.addClass('transitioning-reverse');
      }
      
      setTimeout(function() {
        $activeCard.removeClass('transitioning transitioning-reverse');
      }, 600);
    },

    // 스크롤 인디케이터 표시/숨김
    toggleScrollIndicator: function(show) {
      var $indicator = $('.scroll-indicator');
      if (!$indicator.length && show) {
        $indicator = $('<div class="scroll-indicator"></div>');
        $('#carousel').append($indicator);
      }
      
      if (show) {
        $indicator.fadeIn(300);
      } else {
        $indicator.fadeOut(300);
      }
    },

    // 종이 질감 효과 적용
    applyPaperTexture: function(element) {
      $(element).addClass('paper-texture');
    }
  };

  // 전역으로 노출
  window.VisualEffects = VisualEffects;

  // 이벤트 리스너
  $(document).ready(function() {
    
    // 버튼 클릭 시 리플 효과
    $(document).on('mousedown', 'button, .cr-btn, .sticky-nav-item', function(e) {
      if (e.which === 1) { // 좌클릭만
        VisualEffects.createRipple(e, this);
      }
    });

    // 카드 클릭 시 리플 효과
    $(document).on('mousedown', '.card.is-active', function(e) {
      if (e.which === 1) {
        VisualEffects.createRipple(e, this);
      }
    });

    // 카드 읽음 표시 시 효과
    $(document).on('card:read', function(e, cardElement) {
      VisualEffects.flashCardRead(cardElement);
      
      var rect = cardElement.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      
      VisualEffects.createParticleBurst(x, y, 'var(--color-red)');
    });

    // 모든 카드 읽음 시 축하 효과
    $(document).on('team:unlocked', function() {
      var centerX = window.innerWidth / 2;
      var centerY = window.innerHeight / 2;
      
      // 여러 번 파티클 버스트
      for (var i = 0; i < 3; i++) {
        setTimeout(function() {
          VisualEffects.createParticleBurst(centerX, centerY, '#f5c842');
        }, i * 200);
      }
    });

    // 편지지에 종이 질감 적용
    $(document).on('carousel:init', function() {
      $('.card-opened').each(function() {
        VisualEffects.applyPaperTexture(this);
      });
    });

    // 캐러셀 진입 시 스크롤 인디케이터 표시
    $(document).on('section:changed', function(e, sectionId) {
      if (sectionId === 'carousel') {
        VisualEffects.toggleScrollIndicator(true);
        
        // 3초 후 숨김
        setTimeout(function() {
          VisualEffects.toggleScrollIndicator(false);
        }, 3000);
      }
    });

    // 카드 전환 시 애니메이션
    var originalCarouselGo = window.carouselGo;
    if (typeof originalCarouselGo === 'function') {
      window.carouselGo = function(direction) {
        VisualEffects.animateCardTransition(direction);
        originalCarouselGo.apply(this, arguments);
      };
    }
  });

})();
