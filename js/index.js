// Get references to HTML elements
const startEl = document.getElementById("start");
const pauseEl = document.getElementById("pause");
const resetEl = document.getElementById("reset");
const timeEl = document.getElementById("time");
const countdownCircle = document.querySelector(".countdown-ring__circle");

// Variables for tracking timer state and time values
let minutesInput = document.getElementById("minutes");
let secondsInput = document.getElementById("seconds");
let interval;
let timeLeft = 0;
let initialTime = 0;
let perc;
let isPaused = false;

// Initialize the particle background effect
$("section").particleground({
  dotColor: "#0CF25D",
});

// Function to add leading zero to time values (e.g., 05 instead of 5)
function formatLeadingZero(input) {
  if (input.value.length === 1) {
    input.value = "0" + input.value;
    $(startEl).removeClass("disabled");
  }
  if (input.value.length === 0) {
    input.value = "00";
    $(startEl).removeClass("disabled");
  }
}

// Event listeners for input changes
$(document).ready(() => {
  minutesInput = $("#minutes");
  secondsInput = $("#seconds");

  minutesInput.on("change", () => {
    formatLeadingZero(minutesInput[0]);
  });

  secondsInput.on("change", () => {
    formatLeadingZero(secondsInput[0]);
  });
});

// Event listener for HTML change event (fallback for mobile devices)
$("html").change(() => {
  minutesInput = $("#minutes");
  secondsInput = $("#seconds");

  minutesInput.on("change", () => {
    formatLeadingZero(minutesInput[0]);
  });

  secondsInput.on("change", () => {
    formatLeadingZero(secondsInput[0]);
  });
});

// Function to update the displayed time and progress circle
function updateTime() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}<span class="colon">:</span>${seconds
    .toString()
    .padStart(2, "0")}`;
  $(timeEl).html(formattedTime);

  // Update the countdown circle
  const circumference = 2 * Math.PI * 175;
  const offset = circumference - (timeLeft / initialTime) * circumference;
  $(countdownCircle).css("stroke-dashoffset", offset);
}

// Event listener for the start button click
$(startEl).click(() => {
  const minutes = parseInt(minutesInput.val());
  const seconds = parseInt(secondsInput.val());

  // Validate the input values
  if (isNaN(minutes) || isNaN(seconds) || (minutes === 0 && seconds === 0)) {
    alert("Please set a valid time.");
    return;
  }

  // Initialize the timer if it hasn't been started yet
  if (timeLeft === 0) {
    initialTime = minutes * 60 + seconds;
    timeLeft = initialTime;
    perc = 100 / initialTime;
    updateTime();
  }

  // Start the timer interval
  interval = setInterval(() => {
    timeLeft--;

    // Check if the timer has reached zero
    if (timeLeft < 0) {
      clearInterval(interval);
      timeLeft = 0;
      updateTime();
      alert("Time's up!");
      return;
    }

    updateTime();
  }, 1000);

  // Update button states
  $(startEl).addClass("disabled");
  $(pauseEl).removeClass("disabled");
  $(resetEl).removeClass("disabled");
  isPaused = false;
});

// Event listener for the pause button click
$(pauseEl).click(() => {
  clearInterval(interval);
  $(startEl).removeClass("disabled");
  $(pauseEl).addClass("disabled");
  isPaused = true;
});

// Event listener for the reset button click
$(resetEl).click(() => {
  clearInterval(interval);
  timeLeft = initialTime = 0;
  updateTime();
  minutesInput.val(0);
  secondsInput.val(0);
  $(timeEl).html(
    `<span><input type="number" min="0" max="999" id="minutes" value="00"></span><span class="colon">:</span><span><input type="number" min="0" max="999" id="seconds" value="00"></span>`
  );
  countdownCircle.style.strokeDashoffset = 0;
  $(startEl).removeClass("disabled");
  $(pauseEl).addClass("disabled");
  $(resetEl).addClass("disabled");
  isPaused = false;
});
