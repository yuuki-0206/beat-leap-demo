window.gameScore = 0;
var gameContainer = document.getElementById("gameContainer");
var gameButton = document.getElementById("gameButton");
var scoreElement = document.getElementById("score");
var hitArea = document.querySelector(".hitArea");
var feedbackElement = document.getElementById("feedback");

let currentBeat = null;
const noteSpeed = 7;

player.addListener({
  onTimeUpdate(position) {
    let beat = player.findBeat(position);
    if (currentBeat !== beat) {
      if (beat && (Math.random() > 0.4 || beat.position % 4 === 0)) {
        createNote();
      }
      currentBeat = beat;
    }
  },
});

function createNote() {
  var note = document.createElement("div");
  note.className = "note";
  note.style.left = "0px";
  gameContainer.appendChild(note);

  var noteFallInterval = setInterval(function () {
    note.style.left = note.offsetLeft + noteSpeed + "px";
    if (note.offsetLeft + note.offsetWidth > gameContainer.offsetWidth) {
      clearInterval(noteFallInterval);
      gameContainer.removeChild(note);
      updateScore(-10, "miss");
    }
  }, 20);
}

gameButton.addEventListener("mousedown", function () {
  var notes = document.getElementsByClassName("note");
  var hitAreaLeft = hitArea.offsetLeft;
  var hitAreaRight = hitArea.offsetLeft + hitArea.offsetWidth;
  var hit = false;

  hitArea.classList.add("hitAreaGlow");

  setTimeout(function () {
    hitArea.classList.remove("hitAreaGlow");
  }, 200);

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    var noteLeft = note.offsetLeft;
    var noteRight = note.offsetLeft + note.offsetWidth;

    if (noteLeft < hitAreaRight && noteRight > hitAreaLeft) {
      gameContainer.removeChild(note);
      hit = true;
      updateScore(10, "OK!");
      break;
    }
  }

  if (!hit) {
    updateScore(-10, "miss");
  }
});

function updateScore(change, feedback) {
  window.gameScore += change;
  scoreElement.innerText = "Score: " + window.gameScore;
  feedbackElement.innerText = feedback;
}
