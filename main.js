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

// ======================= import selector options =======================

import {
  locationOptions,
  categoryOptions,
  gearSubcategoryOptions,
  gearSubSubcategoryOptions,
} from "./selector-options.js";

import { cardCss } from "./css-properties.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsCol = collection(db, "items");

// ========================= Referenzen =========================

const addItemButton = document.getElementById("inp-add-item-btn");
const itemNameInput = document.getElementById("inp-item-name");
const itemAmountInput = document.getElementById("inp-item-amount");
const locationSelect = document.getElementById("inp-item-location");
const categorySelect = document.getElementById("inp-item-category");
const subCategorySelect = document.getElementById("inp-item-subcategory");

const specificSelect = document.getElementById("item-specific-select");
const cableEndSelectLeft = document.getElementById("Inp-Select-L");
const cableEndSelectRight = document.getElementById("Inp-Select-R");
const cableEndSelectLeftGender = document.getElementById("Inp-Select-L-Gender");
const cableEndSelectRightGender = document.getElementById(
  "Inp-Select-R-Gender",
);
const specificSelectParameter1 = document.getElementById(
  "inp-select-parameter-1",
);
const specificSelectParameter2 = document.getElementById(
  "inp-select-parameter-2",
);

const itemsContainer = document.getElementById("items-container");
const itemsTemplate = document.querySelector(".item-template");

const queryContainer = document.getElementById(".query-form");
const queryContainerButton = document.getElementById(".query-form-button");

//helpers

function show(element) {
  element.style.display = "block";
}

function hide(element) {
  element.style.display = "none";
}

function clearSelect(selectElement) {
  selectElement.options.length = 0;
}

function fillSelect(selectElement, options) {
  clearSelect(selectElement);
  options.forEach((o) => {
    selectElement.appendChild(new Option(o.text, o.value));
  });
}
function resetUI(select) {
  [
    categorySelect,
    subCategorySelect,
    cableEndSelectLeft,
    cableEndSelectLeftGender,
    cableEndSelectRight,
    cableEndSelectRightGender,
    specificSelect,
    specificSelectParameter1,
    specificSelectParameter2,
  ].forEach(hide);
}
resetUI();

//initial state

//initial fill location
fillSelect(locationSelect, locationOptions);
hide(queryContainer);

queryContainerButton.addEventListener("click", () => {
  if (queryContainer.style.display == "none") {
    show(queryContainer);
    queryContainer.innerHTML = "Suche verbergen";
  } else {
    hide(queryContainer);
    queryContainer.innerHTML = "Artikel suchen";
  }
});

// LOCATION ---> CATEGORY ENABLE & FILL

locationSelect.addEventListener("change", () => {
  //hide lower selectors if no location
  if (!locationSelect.value) {
    hide(categorySelect);
    hide(subCategorySelect);
    hide(specificSelect);
    return;
  }

  fillSelect(categorySelect, categoryOptions);
  show(categorySelect);
});

// CATEGORY ---> SUBCATEGORY ENABLE & FILL
categorySelect.addEventListener("change", () => {
  const category = categorySelect.value;

  hide(subCategorySelect);
  hide(specificSelect);

  if (!category) return;
  show(subCategorySelect);

  switch (category) {
    case "Gear":
      fillSelect(subCategorySelect, gearSubcategoryOptions);
      break;

    case "Material":
      fillSelect(subCategorySelect, materialSubcategoryOptions);
      break;
  }
});

subCategorySelect.addEventListener("change", () => {
  const subCategory = subCategorySelect.value;

  hide(specificSelect);
  hide(cableEndSelectLeftGender);
  hide(cableEndSelectRight);
  hide(cableEndSelectRightGender);
  hide(specificSelectParameter1);
  hide(specificSelectParameter2);

  if (!subCategory) return;
  show(specificSelect);

  switch (subCategory) {
    case "Audiokabel":
      show(cableEndSelectLeft);
      show(cableEndSelectLeftGender);
      show(cableEndSelectRight);
      show(cableEndSelectRightGender);
      show(specificSelectParameter1);

      fillSelect(
        cableEndSelectLeft,
        gearSubSubcategoryOptions.options.audiokabel,
      );
      fillSelect(
        cableEndSelectRight,
        gearSubSubcategoryOptions.options.audiokabel,
      );
      fillSelect(
        cableEndSelectLeftGender,
        gearSubSubcategoryOptions.parameters.steckerGenderOptions,
      );
      fillSelect(
        cableEndSelectRightGender,
        gearSubSubcategoryOptions.parameters.steckerGenderOptions,
      );
      fillSelect(
        specificSelectParameter1,
        gearSubSubcategoryOptions.parameters.kabelLängeOptions,
      );
      break;

    case "Stromkabel":
      fillSelect(
        cableEndSelectLeft,
        gearSubSubcategoryOptions.options.stromkabel,
      );
      fillSelect(
        cableEndSelectRight,
        gearSubSubcategoryOptions.options.stromkabel,
      );

      fillSelect(
        cableEndSelectLeftGender,
        gearSubSubcategoryOptions.parameters.steckerGenderOptions,
      );
      fillSelect(
        cableEndSelectRightGender,
        gearSubSubcategoryOptions.parameters.steckerGenderOptions,
      );
      fillSelect(
        specificSelectParameter1,
        gearSubSubcategoryOptions.parameters.kabelLängeOptions,
      );

      show(cableEndSelectLeft);
      show(cableEndSelectLeftGender);
      show(cableEndSelectRight);
      show(cableEndSelectRightGender);
      show(specificSelectParameter1);
      break;

    case "Mikrophon":
      break;
  }
});
/*
async function runQuery() {
  let q = query(collection(db, "items"));

  if (locationSelect.value) {
    q = query(q, where("location", "==", locationSelect.value));
  }
  if (categorySelect.value) {
    q = query(q, where("category", "==", categorySelect.value));
  }
  if (subCategorySelect.value) {
    q = query(q, where("subCategory", "==", subCategorySelect.value));
  }
  if (cableEndSelectLeft.value) {
    q = query(q, where("cableEndLeft", "==", cableEndSelectLeft.value));
  }
  if (cableEndSelectRight.value) {
    q = query(q, where("cableEndRight", "==", cableEndSelectRight.value));
  }
  if (cableEndSelectRightGender.value) {
    q = query(
      q,
      where("cableEndRightGender", "==", cableEndSelectRightGender.value),
    );
  }
  if (cableEndSelectLeftGender.value) {
    q = query(
      q,
      where("cableEndLeftGender", "==", cableEndSelectLeftGender.value),
    );
  }
  const snapshot = await getDocs(q);
  renderResults(snapshot.docs);
}
*/
function renderResults(docs) {
  itemsContainer.innerHTML = "";
  if (docs.length === 0) {
    return;
  }
  docs.forEach((doc) => {
    const data = doc.data();
  });
}

// ========================= HELPER: CHECK UNIQUE NAME =========================
async function nameExists(name) {
  const q = query(itemsCol, where("name", "==", name));
  const snap = await getDocs(q);
  return !snap.empty;
}

// ========================= ADD ITEM BUTTON=========================
addItemButton.addEventListener("click", async () => {
  let name = "itemname";
  const amount = itemAmountInput.value;
  const location = locationSelect.value;
  const category = categorySelect.value;
  const subCategory = subCategorySelect.value;
  const cableEndLeft = cableEndSelectLeft.value;
  const cableEndLeftGender = cableEndSelectLeftGender.value;
  const cableEndRight = cableEndSelectRight.value;
  const cableEndRightGender = cableEndSelectRightGender.value;
  const parameter1 = specificSelectParameter1.value;
  const parameter2 = specificSelectParameter2.value;

  // add name or make the name is none is given

  if (subCategory == "Audiokabel" || subCategory == "Stromkabel") {
    name = cableEndLeft.concat(
      " ",
      cableEndLeftGender,
      " -> ",
      cableEndRight,
      " ",
      cableEndRightGender,
    );
  } else if (itemNameInput.value != "") {
    name = itemNameInput.value.trim();
  }

  /*
  if (!name || !location || !category || !subCategory) return;
  
  if (await nameExists(name)) {
    alert("Es gibt schon was mit diesem Namen");
  }
  */
  await addDoc(itemsCol, {
    name,
    amount,
    location,
    category,
    subCategory,
    cableEndLeft,
    cableEndLeftGender,
    cableEndRight,
    cableEndRightGender,
    parameter1,
    parameter2,
    createdAt: serverTimestamp(),
  });

  itemNameInput.value = "";
  locationSelect.value = ""; // reset select to placeholder
});

// ========================= LISTEN FOR CHANGES & RENDER =========================
const q = query(itemsCol, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  itemsContainer.innerHTML = ""; // clear old items
  snapshot.forEach((docSnap) => {
    renderItem(docSnap);
  });
});

// ========================= RENDER ITEM FUNCTION (CLONE itemsTemplate) =========================
function renderItem(docSnap) {
  const data = docSnap.data();
  const id = docSnap.id;

  // clone hidden itemsTemplate
  const clone = itemsTemplate.cloneNode(true);
  clone.style.display = "flex"; // make it visible
  clone.id = ""; // remove duplicate ID

  // find elements inside clone
  const nameEl = clone.querySelector(".card-info-text.item-name");
  const amountEl = clone.querySelector(".card-info-text.item-amount");
  const locationEl = clone.querySelector(".card-info-text.item-location");
  const categoryEl = clone.querySelector(".card-info-text.item-category");
  const subCategoryEl = clone.querySelector(".card-info-text.item-subcategory");
  const parameters1El = clone.querySelector(".card-info-text.item-parameters");
  const parameters2El = clone.querySelector(
    ".card-info-text.item-parameters-2",
  );

  // const incBtn = clone.querySelector(".card-info-text");
  // const decBtn = clone.querySelector(".card-info-text");
  // const deleteBtn = clone.querySelector(".card-info-text");

  // overwrite placeholder text
  if (data.subCategory == "Audiokabel" || data.subCategory == "Stromkabel") {
    nameEl.textContent = `${data.cableEndLeft} ${data.cableEndSelectLeftGender} -> ${data.cableEndRight} ${data.cableEndRightGender} [${data.parameter1}]`;
  }
  nameEl.textContent = data.name;
  amountEl.textContent = data.amount;
  locationEl.textContent = data.location;
  categoryEl.textContent = data.category;
  subCategoryEl.textContent = data.subCategory;
  parameters1El.textContent = data.parameters1;
  parameters2El.textContent = data.parameters2;

  // change background color

  clone.style.backgroundColor =
    cardCss.backgroundColors[data.subCategory] ?? "";

  /*
  if (!locationEl) {
    locationEl = document.createElement("div");
    locationEl.className = "card-info-text.item-location";
    clone.appendChild(locationEl);
  }
  locationEl.textContent = `Location: ${data.location}`;
  */
  /*
  // increment/decrement
  incBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { amount: increment(1) });
  decBtn.onclick = () =>
    updateDoc(doc(db, "items", id), { amount: increment(-1) });

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
*/

  // live updates for count & location
  onSnapshot(doc(db, "items", id), (snap) => {
    const itemData = snap.data();
    if (!itemData) return; // document might have been deleted
    amountEl.textContent = `${itemData.amount}`;
    locationEl.textContent = `${itemData.location}`;
  });

  itemsContainer.appendChild(clone);
}
