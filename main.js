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
// ========================= ALGOLIA CONFIG =========================
const algoliaClient = algoliasearch(
  "PHKDGDHHPT",
  "10de5fef4e5080fb50378b63aa9a9761",
);

const algoliaIndex = algoliaClient.initIndex("items");

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

const queryContainer = document.getElementById("query-form");
const queryContainerButton = document.getElementById("query-form-button");

const searchInput = document.getElementById("q-text-inp");
const qLocationSelect = document.getElementById("q-sel-location");
const qCategorySelect = document.getElementById("q-sel-category");
const qSubCategorySelect = document.getElementById("q-sel-subCategory");
const qParameter1Select = document.getElementById("q-sel-parameter-1");

//helpers

function show(element) {
  element.style.display = "block";
}

function hide(element) {
  element.style.display = "none";
}

function clearSelect(sel) {
  sel.innerHTML = "";
}

function fillSelect(selectElement, options) {
  clearSelect(selectElement);
  options.forEach((o) =>
    selectElement.appendChild(new Option(o.text, o.value)),
  );
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

// hide / show query form

hide(queryContainer);

queryContainerButton.addEventListener("click", () => {
  if (queryContainer.style.display == "none") {
    show(queryContainer);
    queryContainerButton.innerHTML = "Suche verbergen";
  } else {
    hide(queryContainer);
    queryContainerButton.innerHTML = "Artikel suchen";
  }
});

// ========================= SEARCH STATE =========================
const searchState = {
  text: "",
  location: [],
  category: [],
  subCategory: [],
  parameter1: [],
  parameter2: [],
};

function buildAlgoliaFilters() {
  const filters = [];

  if (searchState.location.length) {
    filters.push(
      `(${searchState.location.map((v) => `location:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.category.length) {
    filters.push(
      `(${searchState.category.map((v) => `category:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.subCategory.length) {
    filters.push(
      `(${searchState.subCategory.map((v) => `subCategory:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.parameter1.length) {
    filters.push(
      `(${searchState.parameter1.map((v) => `parameter1:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.parameter2.length) {
    filters.push(
      `(${searchState.parameter2.map((v) => `parameter2:"${v}"`).join(" OR ")})`,
    );
  }

  return filters.join(" AND ");
}

async function runAlgoliaSearch() {
  const { hits } = await algoliaIndex.search(searchState.text, {
    filters: buildAlgoliaFilters(),
    hitsPerPage: 50,
  });

  itemsContainer.innerHTML = "";
  hits.forEach(renderAlgoliaItem);
}

searchInput.addEventListener("input", (e) => {
  searchState.text = e.target.value.trim();
  runAlgoliaSearch();
});

/* ========================= QUERY FILTER WIRES ========================= */

qLocationSelect.addEventListener("change", () => {
  searchState.location = qLocationSelect.value ? [qLocationSelect.value] : [];
  runAlgoliaSearch();
});

qCategorySelect.addEventListener("change", () => {
  searchState.category = qCategorySelect.value ? [qCategorySelect.value] : [];

  // reset dependent filters
  searchState.subCategory = [];
  qSubCategorySelect.value = "";

  runAlgoliaSearch();
});

qSubCategorySelect.addEventListener("change", () => {
  searchState.subCategory = qSubCategorySelect.value
    ? [qSubCategorySelect.value]
    : [];
  runAlgoliaSearch();
});

qParameter1Select.addEventListener("change", () => {
  searchState.parameter1 = qParameter1Select.value
    ? [qParameter1Select.value]
    : [];
  runAlgoliaSearch();
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

  // add name or make the name if none is given

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

function renderAlgoliaItem(data) {
  const clone = itemsTemplate.cloneNode(true);
  clone.style.display = "flex";
  clone.id = "";

  clone.querySelector(".item-name").textContent = data.name;
  clone.querySelector(".item-amount").textContent = data.amount;
  clone.querySelector(".item-location").textContent = data.location;
  clone.querySelector(".item-category").textContent = data.category;
  clone.querySelector(".item-subcategory").textContent = data.subCategory;
  clone.querySelector(".item-parameters").textContent = data.parameter1 ?? "";
  clone.querySelector(".item-parameters-2").textContent = data.parameter2 ?? "";

  clone.style.backgroundColor =
    cardCss.backgroundColors[data.subCategory] ?? "";

  itemsContainer.appendChild(clone);
}

if (
  qCategorySelect ||
  qLocationSelect ||
  qParameter1Select ||
  qSubCategorySelect ||
  searchInput != ""
) {
  console.log(Algoliasearch);
} else console.log(Allitems);
