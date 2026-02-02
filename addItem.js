import {
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { itemsCol } from "./firebase.js";

/* ========================= DOM ========================= */

const addItemButton = document.getElementById("inp-add-item-btn");
const itemNameInput = document.getElementById("inp-item-name");
const itemAmountInput = document.getElementById("inp-item-amount");
const locationSelect = document.getElementById("inp-item-location");
const categorySelect = document.getElementById("inp-item-category");
const subCategorySelect = document.getElementById("inp-item-subcategory");
const specificSelectParameter1 = document.getElementById(
  "inp-select-parameter-1",
);
const specificSelectParameter2 = document.getElementById(
  "inp-select-parameter-2",
);

const cableEndSelectLeft = document.getElementById("Inp-Select-L");
const cableEndSelectLeftGender = document.getElementById("Inp-Select-L-Gender");
const cableEndSelectRight = document.getElementById("Inp-Select-R");
const cableEndSelectRightGender = document.getElementById(
  "Inp-Select-R-Gender",
);

/* ========================= ADD ITEM ========================= */

addItemButton.addEventListener("click", async () => {
  let name = itemNameInput.value.trim();

  const data = {
    name,
    amount: itemAmountInput.value,
    location: locationSelect.value,
    category: categorySelect.value,
    subCategory: subCategorySelect.value,
    parameter1: specificSelectParameter1.value,
    parameter2: specificSelectParameter2.value,
    createdAt: serverTimestamp(),
  };

  if (
    !name &&
    (data.subCategory === "Audiokabel" || data.subCategory === "Stromkabel")
  ) {
    data.name = `${cableEndSelectLeft.value} ${cableEndSelectLeftGender.value} → ${cableEndSelectRight.value} ${cableEndSelectRightGender.value}`;
  }

  await addDoc(itemsCol, data);

  itemNameInput.value = "";
  itemAmountInput.value = "";
});
