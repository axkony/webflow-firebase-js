// Query DOM things (fill selectors etc) in searchAgolia.js

import {
  locationOptions,
  categoryOptions,
  gearSubcategoryOptions,
} from "./selector-options.js";

const queryFormButton = document.getElementById("query-form-button");
const queryForm = document.getElementById("query-form");
const searchInput = document.getElementById("search-input");

const itemsContainer = document.getElementById("items-container");
const itemsTemplate = document.querySelector(".item-template");

const qSelectors = document.querySelector("Query Select Field");
const qLocationSelect = document.getElementById("q-sel-location");
const qCategorySelect = document.getElementById("q-sel-category");
const qSubCategorySelect = document.getElementById("q-sel-subcategory");
const qParameter1Select = document.getElementById("q-sel-parameter1");

// ================= helpers ===================

function hide(e) {
  e.style.display = "none";
}
function showFlex(e) {
  e.style.display = "flex";
}
function showBlock(e) {
  e.style.display = "block";
}

// ============== init ===============
hide(qSubCategorySelect);
hide(qParameter1Select);
hide(queryForm);

queryFormButton.addEventListener("click", () => {
  if (queryForm.style.display != "none") {
    hide(queryForm);
  } else showBlock(queryForm);
});
