const columns = document.querySelectorAll(".column");
const cardInput = document.getElementById("cardInput");
const addCardBtn = document.getElementById("addCardBtn");
const todoColumn = document.getElementById("todo");

let draggedCard = null;

// Load board from storage
let boardData = JSON.parse(localStorage.getItem("dragify-board")) || [];

//  Save board
function saveBoard() {
  localStorage.setItem("dragify-board", JSON.stringify(boardData));
}

//  Add drag events
function addDragEvents(card) {
  card.addEventListener("dragstart", function () {
    draggedCard = this;
    this.style.opacity = "0.5";
  });

  card.addEventListener("dragend", function () {
    this.style.opacity = "1";
    draggedCard = null;
    updateBoardData();
  });
}

//  Create card
function createCard(text) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.innerText = text;

  addDragEvents(card);
  return card;
}

//  Update board data
function updateBoardData() {
  boardData = [];

  columns.forEach(column => {
    const columnId = column.id;
    const cards = column.querySelectorAll(".card");

    cards.forEach(card => {
      boardData.push({
        text: card.innerText,
        column: columnId
      });
    });
  });

  saveBoard();
}

//  Render board on load
function renderBoard() {
  boardData.forEach(item => {
    const card = createCard(item.text);
    document.getElementById(item.column).appendChild(card);
  });
}

//  Column drag logic
columns.forEach(column => {
  column.addEventListener("dragover", function (e) {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", function () {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", function (e) {
    e.preventDefault();
    column.classList.remove("drag-over");

    const targetColumn = e.target.closest(".column");
    if (targetColumn && draggedCard) {
      targetColumn.appendChild(draggedCard);
      updateBoardData();
    }
  });
});

//  Add new card
addCardBtn.addEventListener("click", function () {
  const text = cardInput.value;
  if (text === "") return;

  const card = createCard(text);
  todoColumn.appendChild(card);

  boardData.push({ text, column: "todo" });
  saveBoard();

  cardInput.value = "";
});

//  Initial render
renderBoard();
