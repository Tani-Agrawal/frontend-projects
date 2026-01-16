// DOM Elements
const slotsContainer = document.getElementById("slotsContainer");
const bookBtn = document.getElementById("bookBtn");
const datePicker = document.getElementById("datePicker");
const loader = document.getElementById("loader");

// Time slot data
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

//FAKE API
function fakeFetch(data, delay = 800) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

async function getBookings() {
  showLoader();
  const data =
    JSON.parse(localStorage.getItem("quickslot-bookings")) || {};
  const result = await fakeFetch(data);
  hideLoader();
  return result;
}

async function saveBookings(data) {
  showLoader();
  localStorage.setItem(
    "quickslot-bookings",
    JSON.stringify(data)
  );
  const result = await fakeFetch({ success: true });
  hideLoader();
  return result;
}

//STATE
let bookings = {};
let selectedSlot = null;
let selectedDate = null;

// Set today's date
const today = new Date().toISOString().split("T")[0];
datePicker.value = today;
selectedDate = today;

// Initial button state
bookBtn.disabled = true;

//LOADER HELPERS
function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

//RENDER SLOTS
function renderSlots() {
  slotsContainer.innerHTML = "";

  const bookedSlots = bookings[selectedDate] || [];

  timeSlots.forEach((time) => {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.innerText = time;

    if (bookedSlots.includes(time)) {
      slot.classList.add("booked");
    }

    slot.addEventListener("click", async function () {
      // Cancel booking
      if (bookedSlots.includes(time)) {
        const confirmed = confirm(
          `Cancel booking for ${time} on ${selectedDate}?`
        );

        if (confirmed) {
          bookings[selectedDate] = bookedSlots.filter(
            (t) => t !== time
          );

          await saveBookings(bookings);

          selectedSlot = null;
          bookBtn.disabled = true;

          console.log("Cancelled:", selectedDate, time);
          renderSlots();
        }
        return;
      }

      // Select slot
      document
        .querySelectorAll(".slot")
        .forEach((s) => s.classList.remove("active"));

      slot.classList.add("active");
      selectedSlot = time;
      bookBtn.disabled = false;

      console.log("Selected:", selectedDate, selectedSlot);
    });

    slotsContainer.appendChild(slot);
  });
}

//BOOK SLOT
bookBtn.addEventListener("click", async function () {
  if (!selectedSlot) return;

  if (
    bookings[selectedDate] &&
    bookings[selectedDate].includes(selectedSlot)
  ) {
    alert("Slot already booked");
    return;
  }

  if (!bookings[selectedDate]) {
    bookings[selectedDate] = [];
  }

  bookings[selectedDate].push(selectedSlot);

  await saveBookings(bookings);

  console.log("Booked:", selectedDate, selectedSlot);

  selectedSlot = null;
  bookBtn.disabled = true;

  renderSlots();
});

//DATE CHANGE
datePicker.addEventListener("change", function () {
  selectedDate = this.value;
  selectedSlot = null;
  bookBtn.disabled = true;

  renderSlots();
});

//INITIAL LOAD
(async function init() {
  bookings = await getBookings();
  renderSlots();
})();
