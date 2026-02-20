(function () {
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

    if (el.__inited) return;
    el.__inited = true;

    var ap = new APlayer({
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
          url: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'audio/sample-1.mp3',
          cover: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'images/avatar.png'
        },
        {
          name: 'Sample Track 2',
          artist: 'Reedlin2002',
          url: (window.CONFIG && CONFIG.root ? CONFIG.root : '/') + 'audio/sample-2.mp3',
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
    ap.on('play', function () {
      document.body && (document.body.style.overflow = '');
    });
  }

  window.addEventListener('DOMContentLoaded', initMusicPlayer);
  window.addEventListener('pjax:success', initMusicPlayer);
})();
