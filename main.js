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
const container = document.getElementById("items-container");
const template = document.querySelector(".item-template");

if (!addBtn || !nameInput || !container || !template) {
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
  if (!name) return;

  if (await nameExists(name)) {
    alert("Bereits inventarisiert unter selbem Namen");
    return;
  }

  await addDoc(itemsCol, {
    name,
    count: 0,
    createdAt: serverTimestamp(),
  });

  nameInput.value = "";
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

  // Clone the hidden template
  const clone = template.cloneNode(true);
  clone.style.display = "flex"; // make it visible
  clone.id = ""; // remove duplicate ID if any

  // Find elements inside clone
  const titleEl = clone.querySelector(".counter-title");
  const countEl = clone.querySelector(".counter-value");
  const incBtn = clone.querySelector(".inc");
  const decBtn = clone.querySelector(".dec");

  // Set initial content
  titleEl.textContent = data.name;
  countEl.textContent = data.count;

  // Button handlers
  incBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { count: increment(1) });
  decBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { count: increment(-1) });

  // Live updates for count
  onSnapshot(doc(db, "items", id), (snap) => {
    countEl.textContent = snap.data().count;
  });

  container.appendChild(clone);
}
