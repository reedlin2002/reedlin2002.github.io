(function () {
  var apInstance = null;

  function initMusicPlayer() {
    var root = document.getElementById('music-player');
    if (!root) return;

    var toggle = root.querySelector('.music-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        root.classList.toggle('is-collapsed');
      });
    }

    if (!window.APlayer) return;

    var el = document.getElementById('aplayer');
    if (!el) return;

    if (apInstance) return;

    apInstance = new APlayer({
      container: el,
      fixed: false,
      mini: false,
      autoplay: false,
      theme: '#72cecf',
      loop: 'all',
      order: 'list',
      preload: 'none',
      volume: 0.7,
      listFolded: false,
      listMaxHeight: 180,
      audio: [
        {
          name: 'Sample Track 1',
          artist: 'Reedlin2002',
          url: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'music/track-1.mp3',
          cover: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'images/avatar.png'
        },
        {
          name: 'Sample Track 2',
          artist: 'Reedlin2002',
          url: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'music/track-2.mp3',
          cover: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'images/avatar.png'
        }
      ]
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        root.classList.add('is-collapsed');
      }
    });

    // Do NOT lock page scroll.
    apInstance.on('play', function () {
      document.body && (document.body.style.overflow = '');
    });
  }

  window.addEventListener('DOMContentLoaded', initMusicPlayer);
  window.addEventListener('pjax:success', initMusicPlayer);
  document.addEventListener('pjax:complete', initMusicPlayer);
})();
