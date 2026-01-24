import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  increment,
  doc,
  serverTimestamp,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
     FIREBASE CONFIG
     ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyA6ALAY6HReTmoH9lpPC1IQhVuk9qDr93U",
  authDomain: "inventarisator-a-m.firebaseapp.com",
  projectId: "inventarisator-a-m",
  storageBucket: "inventarisator-a-m.firebasestorage.app",
  messagingSenderId: "329718402578",
  appId: "1:329718402578:web:c97672be87794f717d12cb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
     DOM ELEMENTS
     ========================= */
const addBtn = document.getElementById("add-item-btn");
const nameInput = document.getElementById("item-name-input");
const locationSelect = document.getElementById("item-location-select");
const kindSelect = document.getElementById("item-select-kind");
const container = document.getElementById("items-container");
const template = document.querySelector(".item-template");

if (!addBtn || !nameInput || !container || !template || !locationSelect) {
  console.error("Required elements not found");
}

/* =========================
     FIRESTORE REFERENCE
     ========================= */
const itemsCol = collection(db, "items");

/* =========================
     HELPER: CHECK UNIQUE NAME
     ========================= */
async function nameExists(name) {
  const q = query(itemsCol, where("name", "==", name));
  const snap = await getDocs(q);
  return !snap.empty;
}

/* =========================
     ADD ITEM BUTTON
     ========================= */
addBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const location = locationSelect.value;
  const kind = kindSelect.value;
  if (!name || !location || !kind) return;

  if (await nameExists(name)) {
    alert("Item name must be unique");
    return;
  }

  await addDoc(itemsCol, {
    name,
    count: 0,
    location,
    kind,
    createdAt: serverTimestamp(),
  });

  nameInput.value = "";
  locationSelect.value = ""; // reset select to placeholder
});

/* =========================
     LISTEN FOR CHANGES & RENDER
     ========================= */
const q = query(itemsCol, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  container.innerHTML = ""; // clear old items
  snapshot.forEach((docSnap) => {
    renderItem(docSnap);
  });
});

/* =========================
     RENDER ITEM FUNCTION (CLONE TEMPLATE)
     ========================= */
function renderItem(docSnap) {
  const data = docSnap.data();
  const id = docSnap.id;

  // clone hidden template
  const clone = template.cloneNode(true);
  clone.style.display = "flex"; // make it visible
  clone.id = ""; // remove duplicate ID

  // find elements inside clone
  const titleEl = clone.querySelector(".counter-title");
  const countEl = clone.querySelector(".counter-value");
  const incBtn = clone.querySelector(".inc");
  const decBtn = clone.querySelector(".dec");
  const deleteBtn = clone.querySelector(".delete-button");

  // overwrite placeholder text
  titleEl.textContent = data.name;
  countEl.textContent = data.count;

  let locationEl = clone.querySelector(".counter-location");
  if (!locationEl) {
    locationEl = document.createElement("div");
    locationEl.className = "counter-location";
    clone.appendChild(locationEl);
  }
  locationEl.textContent = `Location: ${data.location}`;

  // increment/decrement
  incBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { count: increment(1) });
  decBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { count: increment(-1) });

  // delete item
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      const confirmed = confirm(
        `Are you sure you want to delete "${data.name}"?`,
      );
      if (confirmed) {
        deleteDoc(doc(db, "items", id));
      }
    };
  }

  // live updates for count & location
  onSnapshot(doc(db, "items", id), (snap) => {
    const itemData = snap.data();
    if (!itemData) return; // document might have been deleted
    countEl.textContent = itemData.count;
    locationEl.textContent = `Location: ${itemData.location}`;
  });

  container.appendChild(clone);
}
