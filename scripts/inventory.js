var itemCount = 0
var itemsContainer = document.getElementById("items-container")

function deleteItem(parentID) {
  itemCount -= 1
  document.getElementById(parentID).remove()
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("pantry").doc(user.uid).collection("items").doc(parentID).delete().then(() => {
        console.log("Document successfully deleted!");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }
    if(itemCount == 0) {
      populateEmpty();
    }
  })
}

function addItem() {
  itemCount += 1
  let item = document.createElement("div")
  item.setAttribute('class', "items")
  item.setAttribute('id', `item-${itemCount}`)
  let itemName = document.createElement("input")
  itemName.setAttribute('id', `item-name-${itemCount}`)
  let itemQuantity = document.createElement("input")
  itemQuantity.setAttribute('id', `item-quantity-${itemCount}`)
  itemQuantity.setAttribute("type","number")
  itemQuantity.setAttribute("min","1")
  itemName.setAttribute("placeholder", "Item Name")
  itemQuantity.setAttribute("placeholder", "Amount")
  itemQuantity.classList.add("quantity-input");
  deleteButton = document.createElement("button")
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = "X";
  deleteButton.classList.add("btn-warning");
  deleteButton.setAttribute('onclick', `deleteItem("${item.id}")`)
  item.appendChild(itemName)
  item.appendChild(itemQuantity)
  item.appendChild(deleteButton)
  itemsContainer.appendChild(item)
}

function saveList() {
  itemCount = 0
  items = document.querySelectorAll(".items")
  items.forEach(element => {

    //Remove empty item fields
    if (element.children[0].value == "") {
      itemsContainer.removeChild(element)
      itemCount -= 1
    }

    //Reset all item div id and parameter in the delete button
    itemCount += 1
    element.setAttribute('id', `item-${itemCount}`)
    element.children[2].setAttribute('onclick', `deleteItem("${element.id}")`)

    //Add items to firestore
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let itemNumber = element.id;
        let itemName = element.children[0].value;
        let itemQuantity = element.children[1].value;
        if (itemName != "" && itemQuantity > 0) {
          db.collection("pantry").doc(user.uid).collection("items").doc(itemNumber).set({
            name: itemName,
            quantity: itemQuantity
          });
        }
      }
    })
  })

  // Delete any extra items doc in firestore
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("pantry").doc(user.uid).collection("items").get().then(snap => {
        snap.forEach(doc => {
          existDoc = false
          items = document.querySelectorAll(".items")
          items.forEach(element => {
            if (element.id == doc.id) {
              existDoc = true
            }
          })
          if (!existDoc) {
            db.collection("pantry").doc(user.uid).collection("items").doc(doc.id).delete().then(() => {
              console.log("Document successfully deleted!");
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
          }
        })
      });
    }
  })

}

function populate() {
  console.log("function1")
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("pantry").doc(user.uid).collection("items").get().then(snap => {
        snap.forEach(doc => {
          itemCount += 1
          let itemName = doc.data().name;
          let itemQuantity = doc.data().quantity;
          let item = document.createElement("div")
          item.setAttribute('id', `item-${itemCount}`)
          item.setAttribute('class', "items")
          let itemNameField = document.createElement("input")
          itemNameField.setAttribute('id', `item-name-${itemCount}`)
          let itemQuantityField = document.createElement("input")
          itemQuantityField.classList.add("quantity-input");
          itemQuantityField.setAttribute("type","number")
          itemQuantityField.setAttribute("min","1")
          itemNameField.setAttribute("placeholder", "Item Name")
          itemQuantityField.setAttribute("placeholder", "Sum")
          itemQuantityField.setAttribute('id', `item-quantity-${itemCount}`)
          deleteButton = document.createElement("button")
          deleteButton.classList.add("delete-button");
          deleteButton.innerHTML = "X";
          deleteButton.classList.add("btn-warning");
          deleteButton.setAttribute('onclick', `deleteItem("${item.id}")`)
          item.appendChild(itemNameField)
          item.appendChild(itemQuantityField)
          item.appendChild(deleteButton)
          itemsContainer.appendChild(item)
          itemNameField.value = itemName
          itemQuantityField.value = itemQuantity
        })
      populateEmpty();
      })
    }
  })
}
populate();

function populateEmpty() {
  if (itemCount === 0) {
    itemCount += 1
    let item = document.createElement("div")
    item.setAttribute('class', "items")
    item.setAttribute('id', `item-${itemCount}`)
    let itemName = document.createElement("input")
    itemName.setAttribute('id', `item-name-${itemCount}`)
    let itemQuantity = document.createElement("input")
    itemQuantity.setAttribute('id', `item-quantity-${itemCount}`)
    itemQuantity.setAttribute("type","number")
    itemQuantity.setAttribute("min","1")
    itemName.setAttribute("placeholder", "Item Name")
    itemQuantity.setAttribute("placeholder", "Amount")
    itemQuantity.classList.add("quantity-input");
    deleteButton = document.createElement("button")
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "X";
    deleteButton.classList.add("btn-warning");
    deleteButton.setAttribute('onclick', `deleteItem("${item.id}")`)
    item.appendChild(itemName)
    item.appendChild(itemQuantity)
    item.appendChild(deleteButton)
    itemsContainer.appendChild(item)
  }
}