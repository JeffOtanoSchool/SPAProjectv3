let itemArray = [];
let cartArray = [];

let selectedItemType = "not selected";
let selectedPriority = "not selected";

const GroceryItem = function(
  pItemName,
  pItemType,
  pPriority,
  pItemCost,
  pQuantity,
) {
  this.ItemName = pItemName;
  this.ItemType = pItemType;
  this.Priority = pPriority;
  this.ItemCost = pItemCost;
  this.Quantity = pQuantity;
  this.Id = undefined;
};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("buttonAdd").addEventListener("click", function() {
    let newGroceryItem = new GroceryItem(
      document.getElementById("itemName").value,
      selectedItemType,
      selectedPriority,
      document.getElementById("itemCost").value,
      document.getElementById("quantity").value
    );
    addNewGroceryItem(newGroceryItem);
    clearForm();
  });

  $(document).bind("change", "#select-type", function(event, ui) {
    selectedItemType = $("#select-type").val();
  });
  $(document).bind("change", "#select-priority", function(event, ui) {
    selectedPriority = $("#select-priority").val();
  });

  document
    .getElementById("buttonSortAlph")
    .addEventListener("click", function() {
      itemArray = itemArray.sort(compareItemName);
      createList();
    });

  document
    .getElementById("buttonSortType")
    .addEventListener("click", function() {
      itemArray = itemArray.sort(compareType);
      createList();
    });

  document
    .getElementById("buttonClearCart")
    .addEventListener("click", function() {
      clearCart();
    });
});

$(document).on("pagebeforeshow", "#sortOrder", function(event) {
  FillArrayFromServer();
});

$(document).on("pagebeforeshow", "#cart", function(event) {
  FillCartFromServer();
});


$(document).on("pagebeforeshow", "#addGrocery", function(event) {
  document.getElementById("itemName").value = "";
  document.getElementById("itemCost").value = "";
  document.getElementById("quantity").value = "";
});

$(document).on("pagebeforeshow", "#recipe", function(event) {
  let localItemName = document.getElementById("IDparmHere").innerHTML;
  for (let i = 0; i < itemArray.length; i++) {
    if ((itemArray[i].itemName = localItemName)) {
      document.getElementById("oneItemName").innerHTML =
        "The itemName is: " + itemArray[i].itemName;
      document.getElementById("onePriority").innerHTML =
        "priority released " + itemArray[i].priority;
      document.getElementById("oneItemType").innerHTML =
        "ItemType " + itemArray[i].ItemType;
      document.getElementById("oneItemQuantity").innerHTML =
        "Leading itemQuantity " + itemArray[i].itemQuantity;
      document.getElementById("oneItemCost").innerHTML =
        "Leading itemCost " + itemArray[i].itemCost;
    }
  }
});

function createList() {
  const divUserList = document.getElementById("divUserList");
  while (divUserList.firstChild) {
    divUserList.removeChild(divUserList.firstChild);
  }

  let id = 0;
  const ul = document.createElement("ul");
  itemArray.forEach(element => {
    const li = document.createElement("li");
    li.innerHTML =
      "<input type='button' value='Add to cart' onclick='addToCart(" + id + ")' >" +
      "     " +
      element.ItemName +
      "     " +
      "</input> ";

      element.Id = id;
      id++;
    ul.appendChild(li);
  });

  const totalCostDiv = "Total Cost before taxes: $" + calculateCost(itemArray);

  divUserList.appendChild(ul);
  divUserList.append(totalCostDiv);
}

function addToCart(id) {
  cartArray.push(itemArray.filter(item => item.Id === id)[0]);
}

function clearCart() {
  while (divUserCart.firstChild) {
    divUserCart.removeChild(divUserCart.firstChild);
  }

  cartArray.length = 0;
}

function createCart() {
  const divUserCart = document.getElementById("divUserCart");
  while (divUserCart.firstChild) {
    divUserCart.removeChild(divUserCart.firstChild);
  }

  const ul = document.createElement("ul");
  cartArray.forEach(element => {
    const li = document.createElement("li");
    li.innerHTML = element.ItemName;
    ul.appendChild(li);
  });

  const totalCostDiv = "Total Cost before taxes: $" + calculateCost(cartArray);

  divUserCart.appendChild(ul);
  divUserCart.append(totalCostDiv);
}

function compareItemName(a, b) {
  const itemA = a.ItemName.toUpperCase();
  const itemB = b.ItemName.toUpperCase();

  let comparison = 0;
  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }
  return comparison;
}

function compareType(a, b) {
  const itemA = a.ItemType.toUpperCase();
  const itemB = b.ItemType.toUpperCase();

  let comparison = 0;
  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }
  return comparison;
}

function FillArrayFromServer() {
  fetch("/users/sortOrder")
    .then(function(theResponsePromise) {
      return theResponsePromise.json();
    })
    .then(function(serverData) {
      console.log(serverData);
      itemArray.length = 0;
      itemArray = serverData;
      createList();
    })
    .catch(function(err) {
      console.log(err);
    });
}

function FillCartFromServer() {
  fetch("/users/sortOrder")
    .then(function(theResponsePromise) {
      return theResponsePromise.json();
    })
    .then(function(serverData) {
      console.log(serverData);
      createCart();
    })
    .catch(function(err) {
      console.log(err);
    });
}

function addNewGroceryItem(newGroceryItem) {
  const request = new Request("/users/addGrocery", {
    method: "POST",
    body: JSON.stringify(newGroceryItem),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  });

  fetch(request)
    .then(theResponsePromise => theResponsePromise.json())
    .then(
      theResponsePromiseJson => console.log(theResponsePromiseJson),
      (document.location.href = "#sortOrder")
    )
    .catch(function(err) {
      console.log(err);
    });
}

function clearForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemCost").value = "";
  document.getElementById("quantity").value = "";
}

function calculateCost(array) {
  let totalCost = 0;
  array.forEach(item => (totalCost += Number(item.ItemCost)));
  return totalCost;
}
