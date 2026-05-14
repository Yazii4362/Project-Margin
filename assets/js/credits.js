(function () {
  const $credits = $('#credits');
  const $carousel = $('#carousel');
  const $modal = $('#makerCardModal');
  const $modalEnvelope = $('#modalEnvelope');
  const $modalLetterText = $('#modalLetterText');
  const $modalLetterSender = $('#modalLetterSender');

  // Navigate to Credits section
  window.openTeamOverlay = function () {
    $carousel.removeClass('active').attr('aria-hidden', 'true');
    $credits.addClass('active').attr('aria-hidden', 'false');
  };

  // Navigate back to Carousel
  $('#creditsBack').on('click', function () {
    $credits.removeClass('active').attr('aria-hidden', 'true');
    $carousel.addClass('active').attr('aria-hidden', 'false');
  });

  // Open Card Modal for Maker/Cheerleader
  $('.view-card-btn').on('click', function (e) {
    e.stopPropagation();
    const $card = $(this).closest('.profile-card, .cheerleader-card');
    const id = parseInt($card.attr('data-id'), 10);
    
    if (!window.CARDS_DATA) return;
    
    const data = window.CARDS_DATA.find(d => d.id === id);
    if (!data) return;

    // Reset envelope state
    $modalEnvelope.removeClass('is-open');
    
    // Set content
    $modalLetterText.html(data.message);
    $modalLetterSender.text(data.name);

    // Show modal
    $modal.addClass('is-active');
  });

  // Close Modal
  $('.modal-close, .modal-overlay').on('click', function () {
    $modal.removeClass('is-active');
    setTimeout(() => {
      $modalEnvelope.removeClass('is-open');
    }, 500); // Reset envelope after modal hides
  });

  // Click Envelope to Open Letter
  $('#modalEnvelope').on('click', function () {
    if (!$(this).hasClass('is-open')) {
      $(this).addClass('is-open');
    }
  });

})();
