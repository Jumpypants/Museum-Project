const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

var smileyX = 0;
var smileyY = 0;
var smileyW = 150;
var smileyH = 150;

var inDialogue = false;
var dialogueFinished = false;
var levelIntro = true;

var smileyIsDead = false;
var endGameTimer = -1;

const smiley = new Image();
smiley.src = "assets/smiley.png";
const smileyOpen = new Image();
smileyOpen.src = "assets/smileyOpen.png";
const smileyDead = new Image();
smileyDead.src = "assets/smileyDead.png";


var levels = [
  new Level(6, 0, 1500, 1200, 200, 2001),
  new Level(7, 1, 1400, 1400, 200, 2001),
  new Level(6, 2, 1100, 900, 200, 10000000000001),
];

var intros = [
  ["Hi, Welcome to the game!", "I need someone to watch over my triangles. Can you help me?", "If one tries to escape, just click on it.", "Click anywhere to continue."],
  ["Good job!", "Those triangles are very sneaky.", "But you are faster!", "Click anywhere to continue."],
  ["You are doing great!", "Did those pesky triangles really think they could escape from you?", "Click anywhere to continue."],
];

currentLevel = 0;
levelFailed = false;

function loop() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  endGameTimer--;
  if (endGameTimer === 0) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (smileyIsDead) {
      ctx.fillText("Ending 1 / 2: You did not follow authority.", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillText("Ending 2 / 2: You followed authority.", canvas.width / 2, canvas.height / 2);
    }
    ctx.font = "30px Arial";
    ctx.fillText("Reload the page to play again", canvas.width / 2, canvas.height / 2 + 50);
    return;
  }

  if (!inDialogue) { 
    levelFailed = levels[currentLevel].tick();
  }

  // Check if all triangles are dead
  var allDead = true;
  for (const character of levels[currentLevel].characters) {
    if (character.state !== "dead") {
      allDead = false;
      break;
    }
  }
  if (allDead && endGameTimer < 0) {
    endGameTimer = 150;
  }

  if (levels[currentLevel].timeLeft <= 0) {
    currentLevel++;
    levelIntro = true;
  }

  ctx.save();

  const scaleX = canvas.width / levels[currentLevel].width;
  const scaleY = canvas.height / levels[currentLevel].height;
  const scale = Math.min(scaleX, scaleY);
  ctx.scale(scale, scale);

  const offsetX = (canvas.width / scale - levels[currentLevel].width) / 2;
  const offsetY = (canvas.height / scale - levels[currentLevel].height) / 2;
  ctx.translate(offsetX, offsetY);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  levels[currentLevel].draw(ctx);

  ctx.restore();

  if (levelFailed) {
    dialogue(["Oh noes! One of the triangles bolted.", "It's ok, we can try again.", "Click anywhere to continue."]);
  } else if (levelIntro) {
    dialogue(intros[currentLevel]);
  }

  // Display the time left
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText("Time left: " + levels[currentLevel].timeLeft, canvas.width / 2, 50);
  ctx.fillText("Time left: " + levels[currentLevel].timeLeft, canvas.width / 2, 50);

  // Display the credits
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Museum Project by Daniel Ben-Tsvi", 10, 10);
  

  requestAnimationFrame(loop);
}

document.addEventListener("click", (event) => {
  if (inDialogue) {
    if (dialogueFinished) {
      if (levelFailed) {
        if (currentLevel === 2 && mouseIsOnSmiley(event.clientX, event.clientY) && levels[currentLevel].killed) {
          levels[currentLevel].gunAnimation.reset();
          smileyIsDead = true;
          endGameTimer = 150;
        } else {
          levelFailed = false;
          levels[currentLevel].reset();
          inDialogue = false;
        }
      } else {
        levelIntro = false;
        inDialogue = false;
      }
    }
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / levels[currentLevel].width;
  const scaleY = canvas.height / levels[currentLevel].height;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (canvas.width / scale - levels[currentLevel].width) / 2;
  const offsetY = (canvas.height / scale - levels[currentLevel].height) / 2;

  const mouseX = (event.clientX - rect.left) / scale - offsetX;
  const mouseY = (event.clientY - rect.top) / scale - offsetY;

  levels[currentLevel].click(mouseX, mouseY);
});

function mouseIsOnSmiley(x, y) {
  if (x <= smileyX + smileyW && x >= smileyX && y <= smileyY + smileyH && y >= smileyY) {
    return true;
  }
  return false;
}
  
window.onload = () => {
  loop();
};

function dialogue(text) {
  if (smileyIsDead) {
    ctx.drawImage(smileyDead, smileyX, smileyY, smileyW, smileyH);
    return;
  }

  if (!inDialogue) {
    inDialogue = true;
    dialogueFinished = false;
    smileyY = canvas.height + smileyH / 2;
  }

  smileyX = canvas.width / 2 - smileyW / 2;

  if (smileyY > canvas.height / 2 - smileyH / 2) {
    smileyY -= 4;
    ctx.drawImage(smiley, smileyX, smileyY, smileyW, smileyH);
  } else {
    ctx.drawImage(smileyOpen, smileyX, smileyY, smileyW, smileyH);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < text.length; i++) {
      ctx.strokeText(text[i], smileyX + smileyW / 2, smileyY + smileyH * 1.5 + (i - text.length / 2) * 30);
      ctx.fillText(text[i], smileyX + smileyW / 2, smileyY + smileyH * 1.5 + (i - text.length / 2) * 30);
    }
    dialogueFinished = true;
  }
}