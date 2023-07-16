const overlay = document.querySelector("#overlay");
const bar = document.querySelector("#bar");
const textContainer = document.querySelector("#text");
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
let b, c;

// YouTube Player
let youtubePlayer;
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtube-player", {
    height: "360",
    width: "640",
    videoId: "IsxdBZ0wgq8",
    playerVars: {
      controls: "0",
      fs: "0",
      iv_load_policy: "0",
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady() {
  youtubePlayer.mute();
}

async function onPlayerStateChange(event) {
  try {
    if (event.data == YT.PlayerState.PLAYING) {
      await player.requestPlay();
    } else if (event.data == YT.PlayerState.PAUSED) {
      await player.requestPause();
    } else if (event.data == YT.PlayerState.ENDED) {
      await player.requestStop();
    }
  } catch (err) {
    console.error(err);
  }
}

// TextAlive Player
const { Player } = TextAliveApp;
const player = new Player({
  app: {
    token: "ypbHXyartRCAZHaI",
    parameters: [
      {
        title: "Gradation start color",
        name: "gradationStartColor",
        className: "Color",
        initialValue: "#63d0e2",
      },
      {
        title: "Gradation end color",
        name: "gradationEndColor",
        className: "Color",
        initialValue: "#ff9438",
      },
    ],
  },
  mediaElement: document.querySelector("#media"),
  mediaBannerPosition: "bottom right",
});

player.addListener({
  onAppReady(app) {
    if (app.managed) {
      document.querySelector("#control").className = "disabled";
    }
    if (!app.songUrl) {
      document.querySelector("#media").className = "disabled";

      player.createFromSongUrl("https://piapro.jp/t/ucgN/20230110005414", {
        video: {
          beatId: 4267297,
          chordId: 2405019,
          repetitiveSegmentId: 2475577,
          lyricId: 56092,
          lyricDiffId: 9636,
        },
      });
    }
  },

  onAppParameterUpdate: () => {
    const params = player.app.options.parameters;
    const sc = player.app.parameters.gradationStartColor,
      scString = sc ? `rgb(${sc.r}, ${sc.g}, ${sc.b})` : params[0].initialValue;
    const ec = player.app.parameters.gradationEndColor,
      ecString = ec ? `rgb(${ec.r}, ${ec.g}, ${ec.b})` : params[1].initialValue;
    document.body.style.backgroundColor = ecString;
    document.body.style.backgroundImage = `linear-gradient(0deg, ${ecString} 0%, ${scString} 100%)`;
  },

  onAppMediaChange() {
    overlay.className = "";
    bar.className = "";
    resetChars();
  },

  onVideoReady() {
    const artistSpan = document.querySelector("#artist span");
    artistSpan.textContent = player.data.song.artist.name;
    document.querySelector("#song span").textContent = player.data.song.name;
    c = null;
  },

  onTimerReady() {
    let playControl = document.querySelector("#control > a#play");
    let stopControl = document.querySelector("#control > a#stop");
    if (overlay) {
      overlay.className = "disabled";
    }
    if (playControl) {
      playControl.className = "";
    }
    if (stopControl) {
      stopControl.className = "";
    }
  },

  onTimeUpdate(position) {
    paintedSeekbar.style.width = `${
      parseInt((position * 1000) / player.video.duration) / 10
    }%`;
    const currentTime = position / 1000;
    function isSpecialEffectTime(currentTime) {
      return (
        (currentTime >= 44 && currentTime <= 74) ||
        (currentTime >= 116 && currentTime <= 147) ||
        (currentTime >= 187 && currentTime <= 218)
      );
    }

    const bgImage = document.querySelector("#bg-image");

    if (isSpecialEffectTime(currentTime) && window.gameScore > 0) {
      bar.style.display = "none";
      document.querySelector("#bg-overlay").style.opacity = 1;
      bgImage.style.display = "block";
    } else {
      bar.style.display = "block";
      document.querySelector("#bg-overlay").style.opacity = 0;
      bgImage.style.display = "none";
    }

    if (currentTime >= 238) {
      resetChars();
      const div = document.createElement("div");
      div.appendChild(document.createTextNode("SOLD OUT"));
      div.className = "sold-out";
      const container = document.createElement("div");
      container.appendChild(div);
      textContainer.appendChild(container);
      bgImage.style.display = "none";
      document.querySelector("#bg-overlay").style.opacity = 1;
      return;
    }

    // Beat
    let beat = player.findBeat(position);
    if (b !== beat) {
      if (beat) {
        const currentTime = player.timer.position / 1000;
        if (isSpecialEffectTime(currentTime)) {
          bar.style.display = "none";
        } else {
          requestAnimationFrame(() => {
            bar.className = "active";
            requestAnimationFrame(() => {
              bar.className = "active beat";
            });
          });
        }
      }
      b = beat;
    }

    if (!player.video.firstChar) {
      return;
    }

    if (c && c.startTime > position + 1000) {
      resetChars();
    }

    let current = c || player.video.firstChar;
    while (current && current.startTime < position + 500) {
      if (c !== current) {
        newChar(current);
        c = current;
      }
      current = current.next;
    }
  },

  onPlay() {
    if (
      youtubePlayer &&
      youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING
    ) {
      youtubePlayer.playVideo();
    }
  },

  onPause() {
    if (
      youtubePlayer &&
      youtubePlayer.getPlayerState() !== YT.PlayerState.PAUSED
    ) {
      youtubePlayer.pauseVideo();
    }
  },
  onStop() {
    if (youtubePlayer) {
      youtubePlayer.stopVideo();
    }
  },
});

//chorus .etc
function newChar(current) {
  const classes = [];
  if (
    current.parent.pos === "N" ||
    current.parent.pos === "PN" ||
    current.parent.pos === "X"
  ) {
    classes.push("noun");
  }

  if (current.parent.parent.firstChar === current) {
    resetChars();
  }

  if (current.parent.parent.lastChar === current) {
    classes.push("lastChar");
  }

  if (current.parent.language === "en") {
    if (current.parent.lastChar === current) {
      classes.push("lastCharInEnglishWord");
    } else if (current.parent.firstChar === current) {
      classes.push("firstCharInEnglishWord");
    }
  }

  const div = document.createElement("div");
  div.appendChild(document.createTextNode(current.text));

  const container = document.createElement("div");
  container.className = classes.join(" ");

  const currentTime = player.timer.position / 1000;
  if (
    (currentTime >= 44 && currentTime <= 74) ||
    (currentTime >= 116 && currentTime <= 147) ||
    (currentTime >= 187 && currentTime <= 218) ||
    currentTime >= 238
  ) {
    div.className = "neon";

    if (current.parent.firstChar === current) {
      container.style.opacity = "0";
      container.style.transition = "opacity 0.5s";
      setTimeout(() => {
        container.style.opacity = "1";
      }, 0);
    }
  }

  container.appendChild(div);
  textContainer.appendChild(container);
}

function resetChars() {
  c = null;
  while (textContainer.firstChild)
    textContainer.removeChild(textContainer.firstChild);
}
