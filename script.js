const itemInput = document.getElementById("item-input");
const itemForm = document.getElementById("item-form");
const list = document.getElementById("item-list");
const filter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemsToDom(item));

  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (newItem === "") {
    alert("please enter item");
    return;
  }

  if (isEditMode) {
    const itemToEdit = list.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkItemExist(newItem)) {
      alert("That Item Already Exists !");
      return;
    }
  }
  //adding elements to DOM
  addItemsToDom(newItem);

  //adding to Local Storage
  addItemToStorage(newItem);
  checkUI();

  itemInput.value = "";
}

function addItemsToDom(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //Adding item
  list.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;

  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  list.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.background = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("are you sure?")) {
    item.remove();
  }
  checkUI();

  removeItemFromStorage(item.textContent);
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  //filter out removed items
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //reset local storage

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearAll(e) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  //clearing from local storage
  localStorage.removeItem("items");

  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();

  const items = list.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value = "";

  const items = list.querySelectorAll("li");
  console.log(items);
  if (items.length === 0) {
    filter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filter.style.display = "block";
    clearBtn.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

function init() {
  //Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  list.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAll);
  filter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
