const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const uploadInput = document.getElementById("upload");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const grayscaleBtn = document.getElementById("grayscaleBtn");
const rotateBtn = document.getElementById("rotateBtn");
const flipHBtn = document.getElementById("flipHBtn");
const flipVBtn = document.getElementById("flipVBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

let history = [];
let redoStack = [];

let originalImageData = null;
let currentImageData = null;

/*HELPERS*/
function saveState() {
  history.push(
    ctx.getImageData(0, 0, canvas.width, canvas.height)
  );
  redoStack = [];
}

function clamp(value) {
  return Math.min(255, Math.max(0, value));
}

/*UPLOAD*/
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    history = [];
    redoStack = [];

    brightnessSlider.value = 0;
    contrastSlider.value = 0;
  };
});

/*BRIGHTNESS*/
brightnessSlider.addEventListener("input", () => {
  if (!currentImageData) return;

  saveState();

  const value = parseInt(brightnessSlider.value);
  const imageData = new ImageData(
    new Uint8ClampedArray(currentImageData.data),
    currentImageData.width,
    currentImageData.height
  );

  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] + value);
    d[i + 1] = clamp(d[i + 1] + value);
    d[i + 2] = clamp(d[i + 2] + value);
  }

  ctx.putImageData(imageData, 0, 0);
  currentImageData = imageData;
});

/*CONTRAST*/
contrastSlider.addEventListener("input", () => {
  if (!currentImageData) return;

  saveState();

  const contrast = parseInt(contrastSlider.value);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  const imageData = new ImageData(
    new Uint8ClampedArray(currentImageData.data),
    currentImageData.width,
    currentImageData.height
  );

  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(factor * (d[i] - 128) + 128);
    d[i + 1] = clamp(factor * (d[i + 1] - 128) + 128);
    d[i + 2] = clamp(factor * (d[i + 2] - 128) + 128);
  }

  ctx.putImageData(imageData, 0, 0);
  currentImageData = imageData;
});

/*GRAYSCALE*/
grayscaleBtn.addEventListener("click", () => {
  if (!currentImageData) return;

  saveState();

  const imageData = new ImageData(
    new Uint8ClampedArray(currentImageData.data),
    currentImageData.width,
    currentImageData.height
  );

  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  currentImageData = imageData;
});

/*ROTATE*/
rotateBtn.addEventListener("click", () => {
  if (!currentImageData) return;

  saveState();

  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.height;
  tempCanvas.height = canvas.width;

  tctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tctx.rotate(Math.PI / 2);
  tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);

  currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

/*FLIP*/
flipHBtn.addEventListener("click", () => {
  if (!currentImageData) return;
  saveState();

  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();

  currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

flipVBtn.addEventListener("click", () => {
  if (!currentImageData) return;
  saveState();

  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();

  currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

/*UNDO / REDO*/
undoBtn.addEventListener("click", () => {
  if (!history.length) return;
  redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const prev = history.pop();
  ctx.putImageData(prev, 0, 0);
  currentImageData = prev;
});

redoBtn.addEventListener("click", () => {
  if (!redoStack.length) return;
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const next = redoStack.pop();
  ctx.putImageData(next, 0, 0);
  currentImageData = next;
});

/*RESET*/
resetBtn.addEventListener("click", () => {
  if (!originalImageData) return;

  ctx.putImageData(originalImageData, 0, 0);
  currentImageData = originalImageData;

  brightnessSlider.value = 0;
  contrastSlider.value = 0;

  history = [];
  redoStack = [];
});

/*DOWNLOAD*/
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "photonlab-image.png";
  link.href = canvas.toDataURL();
  link.click();
});
