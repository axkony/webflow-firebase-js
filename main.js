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

// ========================= FIREBASE CONFIG =========================
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
const itemsCol = collection(db, "items");

// ========================= Referenzen =========================

const addBtn = document.getElementById("add-item-btn");
const nameInput = document.getElementById("item-name-input");
const locationSelect = document.getElementById("item-location-select");
const kindSelect = document.getElementById("item-select-kind");
const container = document.getElementById("items-container");
const selectL = document.getElementById("Inp-Select-L");
const selectR = document.getElementById("Inp-Select-R");

const template = document.querySelector(".item-template");

if (!addBtn || !nameInput || !container || !template || !locationSelect) {
  console.error("Required elements not found");
}

//==================== Art Auswahlmöglichkeiten ====================

const ortOptions = [
  { text: "---Ort Wählen---", value: "" },
  { text: "Estrich", value: "Estrich" },
  { text: "Mansarde", value: "Mansarde" },
  { text: "Atelier Winti", value: "Atelier_Winti" },
  { text: "Arbeitszimmer", value: "Arbeitszimmer" },
  { text: "Sonstwo", value: "Sonstwo" },
];

const artOptions = [
  { text: "--- Art wählen ---", value: "" },
  { text: "Gear", value: "Gear" },
  { text: "Material", value: "Material" },
];

const artAudioOptions = [
  { text: "Audiokabel", value: "Audiokabel" },
  { text: "Stromkabel", value: "Stromkabel" },
  { text: "Mikrophon", value: "Mikrophon" },
  { text: "Synthi", value: "Synthi" },
];

// AudioKabel

const kabelAudioOptions = [
  { text: "--- AUDIO KABEL ---", value: "" },
  { text: "XLR", value: "XLR_1" },
  { text: "XLR (low profile)", value: "XLR_2" },
  { text: "TRS 1/4", value: "TRS_1" },
  { text: "TRS 3.5mm (patch)", value: "TRS_2" },
  { text: "TS 1/4", value: "TS_1" },
  { text: "TS 3.5mm (patch)", value: "TS_2" },
  { text: "RCA (Chinch)", value: "RCA" },
  { text: "SpeakON", value: "SpeakON" },
  { text: "PowerCON", value: "PowerCON" },
  { text: "--- AUDIO DATA ---", value: "" },
  { text: "Midi", value: "Midi" },
  { text: "Toslink (ADAT)", value: "Toslink" },
  { text: "Timecode", value: "Timecode" },
  { text: "Madi", value: "Madi" },
  { text: "--- PEITSCHEN ---", value: "" },
  { text: "Peitsche 2 XLR", value: "Peitsche_2_XLR" },
  { text: "Peitsche 2 TRS", value: "Peitsche_2_TRS" },
  { text: "Peitsche 4 XLR", value: "Peitsche_4_XLR" },
  { text: "Peitsche 4 TRS", value: "Peitsche_4" },
  { text: "Peitsche 8 XLR", value: "Peitsche_8_XLR" },
  { text: "Peitsche 8 TRS", value: "Peitsche_8" },
  { text: "Peitsche Multi", value: "Peitsche_Multi" },
];

const kabelStromOptions = [
  { text: "CH mit Erde", value: "CH-3" },
  { text: "CH ohne Erde", value: "CH-2" },
  { text: "CH multi 3", value: "CH-mult-3" },
  { text: "CH multi 4", value: "CH-mult-4" },
  { text: "CH multi 8", value: "CH-mult-8" },
  { text: "Schuko", value: "CH-mult-4" },
];

const kabelGenderOptions = [
  { text: "Gender wählen", value: "" },
  { text: "Male", value: "1" },
  { text: "Female", value: "2" },
];

const kabelLängeOptions = [
  { text: "Länge Wählen", value: "" },
  { text: "< 0.25", value: "kurz" },
  { text: "0.25", value: "0.25" },
  { text: "0.5", value: "0.5" },
  { text: "1m", value: "1" },
  { text: "2m", value: "2" },
  { text: "3m", value: "3" },
  { text: "4m", value: "4" },
  { text: "5m", value: "5" },
  { text: "10m", value: "10" },
  { text: "15m", value: "15" },
  { text: "20m", value: "20" },
  { text: "30m", value: "30" },
];

/* =========================
     HELPER: CHECK UNIQUE NAME
     ========================= */
async function nameExists(name) {
  const q = query(itemsCol, where("name", "==", name));
  const snap = await getDocs(q);
  return !snap.empty;
}

locationSelect.options.length = 0;
ortOptions.forEach((o) => {
  let ortOption = new Option(o.text, o.value);
  locationSelect.appendChild(ortOption);
});

locationSelect.locationSelect.addEventListener("change", () => {
  const location = locationSelect.value;
});

kindSelect.addEventListener("change", () => {
  const kind = kindSelect.value;
  console.log("––– kind:", kind);

  selectL.disabled = false;
  selectR.disabled = false;
  // alles aus select Löschen
  selectL.options.length = 0;
  selectR.options.length = 0;

  console.log("selects enabled…");

  if (kind === "Kabel") {
    console.log("_______KABEL AUSGEWÄHLT!!!!");

    kabelAudioOptions.forEach((o) => {
      let optionL = new Option(o.text, o.value);
      let optionR = new Option(o.text, o.value);
      selectL.appendChild(optionL);
      selectR.appendChild(optionR);
    });
  }
});

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
