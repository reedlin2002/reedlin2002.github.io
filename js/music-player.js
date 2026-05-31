document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("mp-audio");
  const playBtn = document.getElementById("mp-play");
  if(!playBtn || !audio) return; // Player not on page
  
  const playIcon = playBtn.querySelector("i");
  const prevBtn = document.getElementById("mp-prev");
  const nextBtn = document.getElementById("mp-next");
  const progressContainer = document.getElementById("mp-progress-container");
  const progress = document.getElementById("mp-progress");
  const volIcon = document.getElementById("mp-vol-icon");
  const volContainer = document.getElementById("mp-vol-container");
  const volBar = document.getElementById("mp-vol-bar");
  const titleEl = document.getElementById("mp-title");
  const player = document.getElementById("shoka-music-player");
  const closeBtn = document.getElementById("mp-close");

  // 預設靜音
  audio.muted = true;
  audio.volume = 0;
  if (volBar) volBar.style.height = "0%";

  // 音樂清單 (對應 .deploy_git/music 下的檔案)
  const playlist = [
    "/music/一難.mp3",
    "/music/私が選んだもの  ユイカMV.mp3"
  ];
  let currentIdx = 0;

  function loadSong(idx) {
    if (playlist.length === 0) return;
    audio.src = playlist[idx];
    
    if (titleEl) {
      let songName = playlist[idx].split('/').pop().replace(/\.[^/.]+$/, "");
      titleEl.textContent = decodeURIComponent(songName);
    }

    audio.load();
    updatePlayIcon(false);
    progress.style.width = "0%";
  }

  function updatePlayIcon(isPlaying) {
    if (isPlaying) {
      playIcon.classList.replace("fa-play", "fa-pause");
    } else {
      playIcon.classList.replace("fa-pause", "fa-play");
    }
  }

  function setVolume(vol) {
    audio.volume = vol;
    if (volBar) volBar.style.height = (vol * 100) + "%";
    
    if (vol > 0 && audio.muted) {
      audio.muted = false;
      volIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else if (vol === 0 && !audio.muted) {
      audio.muted = true;
      volIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
  }

  function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().catch(e => console.log("Audio play prevented:", e));
      updatePlayIcon(true);
    } else {
      audio.pause();
      updatePlayIcon(false);
    }
  }

  playBtn.addEventListener("click", togglePlay);

  prevBtn.addEventListener("click", () => {
    currentIdx = (currentIdx - 1 + playlist.length) % playlist.length;
    loadSong(currentIdx);
    audio.play().catch(e => console.log(e));
    updatePlayIcon(true);
  });

  nextBtn.addEventListener("click", () => {
    currentIdx = (currentIdx + 1) % playlist.length;
    loadSong(currentIdx);
    audio.play().catch(e => console.log(e));
    updatePlayIcon(true);
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + "%";
    }
  });

  audio.addEventListener("ended", () => {
    nextBtn.click();
  });

  progressContainer.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  });

  volIcon.addEventListener("click", (e) => {
    if (volContainer) {
      volContainer.classList.toggle("show");
    }
  });

  volIcon.addEventListener("dblclick", () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
      volIcon.classList.replace("fa-volume-high", "fa-volume-xmark");
      if (volBar) volBar.style.height = "0%";
    } else {
      volIcon.classList.replace("fa-volume-xmark", "fa-volume-high");
      if (audio.volume === 0) {
        audio.volume = 0.5;
        if (volBar) volBar.style.height = "50%";
      } else {
        if (volBar) volBar.style.height = (audio.volume * 100) + "%";
      }
    }
  });

  if (volContainer) {
    volContainer.addEventListener("click", (e) => {
      const rect = volContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (rect.bottom - e.clientY) / rect.height));
      setVolume(pos);
    });
  }

  player.addEventListener("wheel", (e) => {
    e.preventDefault();
    let vol = audio.muted ? 0 : audio.volume;
    if (e.deltaY < 0) {
      vol = Math.min(1, vol + 0.1);
    } else {
      vol = Math.max(0, vol - 0.1);
    }
    setVolume(vol);
  }, { passive: false });

  // 關閉播放器
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      audio.pause();
      if (player) player.classList.add("dismissed");
    });
  }

  // 初始化
  loadSong(currentIdx);
});
