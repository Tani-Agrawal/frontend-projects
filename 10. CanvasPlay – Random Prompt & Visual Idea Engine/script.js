const titleEl = document.getElementById("promptTitle");
const textEl = document.getElementById("promptText");
const generateBtn = document.getElementById("generateBtn");

const canvas = document.getElementById("ideaCanvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearBtn");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");
const saveBtn = document.getElementById("saveBtn");

let isDrawing = false;

// default pen settings
ctx.strokeStyle = "#0f172a";
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// start drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

// draw
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

// stop drawing
function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// color picker
colorPicker.addEventListener("change", () => {
  ctx.strokeStyle = colorPicker.value;
});

// pen size
sizeSlider.addEventListener("input", () => {
  ctx.lineWidth = sizeSlider.value;
});

// clear canvas
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
});

// save image
saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "canvasplay-sketch.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// generate prompt
generateBtn.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  const idea = prompts[randomIndex];

  titleEl.innerText = `${idea.category} – ${idea.title}`;
  textEl.innerText = idea.text;
});
