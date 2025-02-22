const buttonColors = ["red", "yellow", "blue", "green"];
let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 1;

$(document).on("keypress", (e) => {
  if (e.key === "a") {
    if (!started) {
      nextSequence();
      checkAnswer();
      started = true;
    }
  } else {
    startOver();
    nextSequence();
  }
});

$(".btn").on("click", (e) => {
  const userChosenColor = e.target.id;

  userClickedPattern.push(userChosenColor);

  animateClick(userChosenColor);
  playSound(userChosenColor);
});

function randomNumber() {
  return Math.floor(Math.random() * 4);
}

function nextSequence() {
  gamePattern = []; // reset game
  userClickedPattern = []; // reset user input

  for (let i = 0; i < 4; i++) {
    const randomChosenColor = buttonColors[randomNumber()];
    gamePattern.push(randomChosenColor);
  }

  console.log(gamePattern);

  // animate level
  animateRound();

  $("#level-title").text(`Level ${level}`);
  level++;
}

function checkAnswer() {
  // Set up an interval to periodically check the answer
  const interval = setInterval(() => {
    if (!started) return; // Only check if game has started

    // Compare patterns
    if (userClickedPattern.length === gamePattern.length) {
      const compare1 = gamePattern.join();
      const compare2 = userClickedPattern.join();

      if (compare1 === compare2) {
        console.log("Success");
        gamePattern = [];
        userClickedPattern = [];
        $("body").addClass("correct-answer");

        setTimeout(() => {
          $("body").removeClass("correct-answer");
        }, 500);

        // next level
        nextSequence();
      } else {
        console.log("Wrong");
        $("#level-title").text("Game Over, Press Any Key to Restart");
        $("body").addClass("game-over");
        setTimeout(() => {
          $("body").removeClass("game-over");
        }, 1000);
        playSound("wrong");

        // Clear the interval on failure
        clearInterval(interval);
      }
    }
  }, 500);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function startOver() {
  level = 1;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
}

function animateClick(currentColor) {
  $(`#${currentColor}`).addClass("pressed");
  setTimeout(() => {
    $(`#${currentColor}`).removeClass("pressed");
  }, 100);
}

function animateRound() {
  let i = 0;

  function animateButtons(index) {
    if (index >= gamePattern.length) return; // Exit when done

    const buttonId = `#${gamePattern[index]}`;
    $(buttonId).fadeOut(100).fadeIn(100);
    playSound(gamePattern[index]);

    setTimeout(() => {
      animateButtons(index + 1); // Next iteration with a delay
    }, 1000); // Apply 100ms delay before next animation
  }

  animateButtons(i);
}

function playSound(name) {
  var audio = new Audio(`./sounds/${name}.mp3`);
  audio.play();
}
