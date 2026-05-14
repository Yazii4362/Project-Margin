/**
 * 랜덤 BGM — `khm[번호]-[이름].mp3` 트랙 배열 + 좌측 플레이리스트. 캐러셀·커서와 네임스페이스(.bgm) 분리.
 * 진입점: initRandomBGM()
 */
function initRandomBGM() {
  var $player = $('#bgmPlayer');
  var $audio = $('#bgmAudio');
  var $btn = $('#bgmBtnToggle');
  var $label = $('#bgmTrackLabel');
  var $playlist = $('#bgmPlaylist');
  var $playlistPanel = $('#bgmPlaylistPanel');
  var $playlistToggle = $('#bgmPlaylistToggle');

  if (!$player.length || !$audio.length || !$btn.length) return;
  if ($player.data('randomBgmInited')) return;

  var audio = $audio[0];

  /** @type {string[]} — 파일명만 나열 (assets/audio/ 기준) */
  var BGM_TRACK_FILES = [
    'khm1-hyein.mp3',
    'khm2-hyein.mp3',
    'khm3-jueun.mp3',
    'khm4-jueun.mp3',
  ];

  var BGM_BASE = 'assets/audio/';
  var BGM_MAKER_LABELS = {
    hyein: '혜인',
    jueun: '주은',
  };

  var KHM_FILE_RE = /^khm(\d+)-([^.]+)\.mp3$/i;

  var deferredPlay = false;
  var userExplicitPause = false;
  /** 캐러셀 진입 후 자동 재생 1회만 시도(봉투 클릭 제스처 이후 비동기 재생) */
  var carouselBgmAutoplayAttempted = false;
  var currentIndex = -1;
  var errorRetries = 0;
  var maxErrorRetries = 6;

  audio.loop = false;
  audio.preload = 'none';

  function parseTrackMeta(filename) {
    var m = filename.match(KHM_FILE_RE);
    if (!m) {
      return { num: '', slug: '', line: filename };
    }
    var slug = m[2].toLowerCase();
    var who = BGM_MAKER_LABELS[slug] || m[2];
    return {
      num: m[1],
      slug: slug,
      line: who + '님의 곡 · #' + m[1],
    };
  }

  /** UI 리스트용: "Track 1 - hyein" */
  function formatPlaylistTitle(filename) {
    var m = filename.match(KHM_FILE_RE);
    if (!m) {
      return filename.replace(/\.mp3$/i, '');
    }
    return 'Track ' + m[1] + ' - ' + m[2].toLowerCase();
  }

  function setTrackLabel(filename) {
    if (!$label.length) return;
    var meta = parseTrackMeta(filename);
    $label.text(meta.line);
    $player.attr('data-bgm-track', filename);
  }

  function clearTrackLabel() {
    if (!$label.length) return;
    $label.text('');
    $player.removeAttr('data-bgm-track');
  }

  function syncPlaylistHighlight() {
    if (!$playlist.length) return;
    var playing = !audio.paused && !audio.ended;
    $playlist.find('.bgm-playlist-row').each(function () {
      var $row = $(this);
      var idx = parseInt($row.attr('data-index'), 10);
      $row.toggleClass('is-current', idx === currentIndex);
      $row.toggleClass('is-playing', idx === currentIndex && playing);
    });
  }

  function buildPlaylist() {
    if (!$playlist.length) return;
    $playlist.empty();
    BGM_TRACK_FILES.forEach(function (file, idx) {
      var title = formatPlaylistTitle(file);
      var $row = $(
        '<li class="bgm-playlist-item">' +
          '<button type="button" class="bgm-playlist-row" data-index="' +
          idx +
          '">' +
          '<span class="bgm-playlist-row__mark" aria-hidden="true">▶</span>' +
          '<span class="bgm-playlist-row__title"></span>' +
          '</button>' +
          '</li>'
      );
      $row.find('.bgm-playlist-row__title').text(title);
      $playlist.append($row);
    });
  }

  function setPlaylistOpen(open) {
    $player.toggleClass('bgm-player--playlist-open', open);
    if ($playlistToggle.length) {
      $playlistToggle.attr('aria-expanded', open ? 'true' : 'false');
      $playlistToggle.attr('aria-label', open ? '재생 목록 접기' : '재생 목록 펼치기');
    }
    if ($playlistPanel.length) {
      $playlistPanel.attr('aria-hidden', open ? 'false' : 'true');
    }
  }

  function randomIndex(exclude) {
    var n = BGM_TRACK_FILES.length;
    if (n <= 0) return -1;
    if (n === 1) return 0;
    var idx;
    var guard = 0;
    do {
      idx = Math.floor(Math.random() * n);
      guard++;
    } while (idx === exclude && guard < 16);
    return idx;
  }

  function applySrcByIndex(idx) {
    if (idx < 0 || idx >= BGM_TRACK_FILES.length) return false;
    var file = BGM_TRACK_FILES[idx];
    var url = BGM_BASE + file;
    if (audio.getAttribute('src') !== url) {
      audio.src = url;
    }
    audio.preload = 'metadata';
    currentIndex = idx;
    setTrackLabel(file);
    try {
      audio.load();
    } catch (e) {
      /* noop */
    }
    syncPlaylistHighlight();
    return true;
  }

  function applyUiPlaying(playing) {
    $player.toggleClass('bgm-player--playing', playing);
    $player.toggleClass('bgm-player--paused', !playing);
    $btn.attr('aria-pressed', playing ? 'true' : 'false');
    $btn.attr('aria-label', playing ? '배경 음악 일시정지' : '배경 음악 재생');
  }

  function syncUiFromAudio() {
    applyUiPlaying(!audio.paused && !audio.ended);
    syncPlaylistHighlight();
  }

  function attemptPlay() {
    var p = audio.play();
    if (p !== undefined) {
      p.then(function () {
        deferredPlay = false;
        errorRetries = 0;
        applyUiPlaying(true);
        syncPlaylistHighlight();
      }).catch(function () {
        deferredPlay = true;
        applyUiPlaying(false);
        syncPlaylistHighlight();
      });
    } else {
      applyUiPlaying(!audio.paused);
      syncPlaylistHighlight();
    }
  }

  function tryResumeAfterGesture() {
    if (!deferredPlay) return;
    attemptPlay();
  }

  function onDocumentGestureForResume() {
    tryResumeAfterGesture();
  }

  function playTrackByIndex(idx) {
    if (idx < 0 || idx >= BGM_TRACK_FILES.length) return;
    userExplicitPause = false;
    if (!applySrcByIndex(idx)) return;
    attemptPlay();
  }

  function tryAutoplayWhenCarouselReady() {
    if (carouselBgmAutoplayAttempted) return;
    if (!$('#carousel').hasClass('active')) return;
    if (userExplicitPause) return;
    carouselBgmAutoplayAttempted = true;
    playRandomTrack(-1);
  }

  function playRandomTrack(excludeIdx) {
    if (!BGM_TRACK_FILES.length) return;
    var idx = randomIndex(typeof excludeIdx === 'number' ? excludeIdx : currentIndex);
    if (!applySrcByIndex(idx)) return;
    attemptPlay();
  }

  function onEnded() {
    if (userExplicitPause) return;
    if (!BGM_TRACK_FILES.length) return;
    playRandomTrack(currentIndex);
  }

  function onError() {
    deferredPlay = false;
    applyUiPlaying(false);
    errorRetries++;
    if (errorRetries <= maxErrorRetries && BGM_TRACK_FILES.length > 1) {
      playRandomTrack(currentIndex);
      return;
    }
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[BGM] 트랙을 불러오지 못했습니다. assets/audio/ 및 파일명을 확인하세요.');
    }
    clearTrackLabel();
    currentIndex = -1;
    syncPlaylistHighlight();
  }

  $btn.off('click.bgm').on('click.bgm', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (audio.paused) {
      userExplicitPause = false;
      if (!audio.src || audio.ended) {
        playRandomTrack(currentIndex);
      } else {
        attemptPlay();
      }
    } else {
      audio.pause();
      deferredPlay = false;
      userExplicitPause = true;
      applyUiPlaying(false);
      syncPlaylistHighlight();
    }
  });

  $playlistToggle.off('click.bgm').on('click.bgm', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setPlaylistOpen(!$player.hasClass('bgm-player--playlist-open'));
  });

  $playlist.off('click.bgm', '.bgm-playlist-row').on('click.bgm', '.bgm-playlist-row', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var idx = parseInt($(this).attr('data-index'), 10);
    if (isNaN(idx)) return;
    playTrackByIndex(idx);
  });

  $(document)
    .off('click.bgmPlClose')
    .on('click.bgmPlClose', function (ev) {
      if (!$player.hasClass('bgm-player--playlist-open')) return;
      if ($(ev.target).closest('#bgmPlayer').length) return;
      setPlaylistOpen(false);
    });

  $audio.off('.bgm')
    .on('play.bgm pause.bgm', syncUiFromAudio)
    .on('ended.bgm', onEnded)
    .on('error.bgm', onError);

  $(document)
    .off('click.bgmResume touchend.bgmResume')
    .on('click.bgmResume touchend.bgmResume', onDocumentGestureForResume);

  $(document).off('carousel:init.bgm').on('carousel:init.bgm', tryAutoplayWhenCarouselReady);

  buildPlaylist();
  setPlaylistOpen(false);
  syncUiFromAudio();
  clearTrackLabel();
  syncPlaylistHighlight();
  $player.data('randomBgmInited', true);
}

$(function () {
  initRandomBGM();
});

/** 메인(히어로) 구간에서만 플레이어 숨김 — 캐러셀·크레딧 활성 시 표시 */
$(function () {
  var $p = $('#bgmPlayer');
  if (!$p.length) return;

  function syncBgmPlayerMainVisibility() {
    var show = $('#carousel').hasClass('active') || $('#credits').hasClass('active');
    $p.toggleClass('bgm-player--hidden-main-screen', !show);
  }

  syncBgmPlayerMainVisibility();

  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(syncBgmPlayerMainVisibility);
    ['hero', 'carousel', 'credits'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        obs.observe(el, { attributes: true, attributeFilter: ['class'] });
      }
    });
  } else {
    $(document).on('carousel:init', syncBgmPlayerMainVisibility);
    setInterval(syncBgmPlayerMainVisibility, 250);
  }
});
