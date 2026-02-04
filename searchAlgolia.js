/* ========================= ALGOLIA ========================= */

const algoliaClient = algoliasearch(
  "PHKDGDHHPT",
  "10de5fef4e5080fb50378b63aa9a9761",
);

const index = algoliaClient.initIndex("items");

/* ========================= DOM ========================= */

const queryFormButton = document.getElementById("query-form-button");
const queryForm = document.getElementById("query-form");
const searchInput = document.getElementById("search-input");
const itemsContainer = document.getElementById("items-container");
const itemsTemplate = document.querySelector(".item-template");

const qLocationSelect = document.getElementById("q-sel-location");
const qCategorySelect = document.getElementById("q-sel-category");
const qSubCategorySelect = document.getElementById("q-sel-subcategory");
const qParameter1Select = document.getElementById("q-sel-parameter1");

import { cardCss } from "./css-properties.js";
import {
  locationOptions,
  categoryOptions,
  gearSubcategoryOptions,
} from "./selector-options.js";

function fillSelect(sel, options) {
  sel.innerHTML = "";
  options.forEach(({ text, value }) => {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    sel.appendChild(option);
  });
}

function hide(e) {
  e.style.display = "none";
}
function showFlex(e) {
  e.style.display = "flex";
}
function showBlock(e) {
  e.style.display = "block";
}

/* ========================= STATE ========================= */

const searchState = {
  text: "",
  location: [],
  category: [],
  subCategory: [],
  parameter1: [],
};

/* ========================= INIT ========================= */

fillSelect(qLocationSelect, locationOptions);
fillSelect(qCategorySelect, categoryOptions);

/* ========================= FILTER BUILDER ========================= */

function buildFilters() {
  const f = [];

  if (searchState.location.length) {
    f.push(
      `(${searchState.location.map((v) => `location:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.category.length) {
    f.push(
      `(${searchState.category.map((v) => `category:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.subCategory.length) {
    f.push(
      `(${searchState.subCategory.map((v) => `subCategory:"${v}"`).join(" OR ")})`,
    );
  }

  if (searchState.parameter1.length) {
    f.push(
      `(${searchState.parameter1.map((v) => `parameter1:"${v}"`).join(" OR ")})`,
    );
  }

  return f.join(" AND ");
}

/* ========================= SEARCH ========================= */

async function runSearch() {
  const { hits } = await index.search(searchState.text, {
    filters: buildFilters(),
    hitsPerPage: 50,
  });

  itemsContainer.innerHTML = "";
  hits.forEach(renderItem);
}

/* ========================= EVENTS ========================= */

searchInput.addEventListener("input", (e) => {
  searchState.text = e.target.value.trim();
  runSearch();
  console.log(e.target.value.trim());
});

qLocationSelect.addEventListener("change", () => {
  searchState.location = qLocationSelect.value ? [qLocationSelect.value] : [];
  runSearch();
});

qCategorySelect.addEventListener("change", () => {
  const v = qCategorySelect.value;

  searchState.category = v ? [v] : [];
  searchState.subCategory = [];

  if (v == "") {
    hide(qSubCategorySelect);
  } else if (v == "Gear") {
    showBlock(qSubCategorySelect);
    fillSelect(qSubCategorySelect, gearSubcategoryOptions);
  }

  runSearch();
});

qSubCategorySelect.addEventListener("change", () => {
  const v = qSubCategorySelect.value;

  searchState.subCategory = value ? [v] : [];
  searchState.parameter1 = [v];

  if (v == "") {
    hide(qParameter1Select);
  } else if (v == "Audiokabel") {
    showBlock(qParameter1Select);
    fillSelect(parameter1, gearSubSubcategoryOptions.options.audiokabel);
  }

  runSearch();
});

qParameter1Select.addEventListener("change", () => {
  searchState.parameter1 = qParameter1Select.value
    ? [qParameter1Select.value]
    : [];
  runSearch();
});

/* ========================= RENDER ========================= */

function renderItem(data) {
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
