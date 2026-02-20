const navMenuToggleHandle = function (event) {
  if (event) event.preventDefault();

  const nav = $('#nav');
  if (!nav) return;

  const opened = nav.hasClass('open');
  nav.toggleClass('open', !opened);
  menuToggle.toggleClass('close', !opened);

  if (!opened && sideBar && sideBar.hasClass('on')) {
    sideBarToggleHandle(null, 1);
  }
}

var spotifyEmbedController = null;

const spotifyPlayerInit = function () {
  if (!CONFIG || !CONFIG.spotify || !CONFIG.spotify.enable) return;
  if ($('#spotify-widget')) return;

  var widget = BODY.createChild('div', {
    id: 'spotify-widget',
    innerHTML: '<button class="spotify-btn" type="button" aria-label="Play/Pause">Play</button><div id="spotify-embed"></div>'
  });

  var script = document.createElement('script');
  script.src = 'https://open.spotify.com/embed/iframe-api/v1';
  script.async = true;
  document.body.appendChild(script);

  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    var element = document.getElementById('spotify-embed');
    if (!element) return;

    var options = {
      uri: CONFIG.spotify.uri,
      theme: CONFIG.spotify.theme,
      view: CONFIG.spotify.view
    };

    IFrameAPI.createController(element, options, function (EmbedController) {
      spotifyEmbedController = EmbedController;

      var btn = widget.child('.spotify-btn');
      var playing = false;

      btn.addEventListener('click', function () {
        if (!spotifyEmbedController) return;
        if (playing) {
          spotifyEmbedController.pause();
        } else {
          spotifyEmbedController.play();
        }
      });

      spotifyEmbedController.addListener('playback_update', function (e) {
        playing = !!(e && e.data && e.data.isPaused === false);
        btn.innerText = playing ? 'Pause' : 'Play';
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', spotifyPlayerInit);
