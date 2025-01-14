const listId = localStorage.getItem("listId");

const listNameField = document.getElementById("list-name")
const listImgField = document.getElementById("list-img-url")

//Save list name when input field lose focus
listNameField.addEventListener('blur', () => { saveListName() })

//Delete list
function deleteList() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId).delete().then(() => {
        console.log("Document successfully deleted!");
        location.href = "all_shopping_list.html"
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }
  })
}

//Save list name
function saveListName() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let ref = db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId);
      ref.get().then((res) => {
        if (!res.exists) {
          db.collection("shoppinglist")
            .doc(user.uid).collection("lists").doc(listId)
            .set({
              name: listNameField.value
            });
        }
        db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId).update({
          name: listNameField.value
        })
      })
    }
  })
}

//Save list image name
function saveListImg(imgName) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let ref = db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId);
      ref.get().then((res) => {
        if (!res.exists) {
          db.collection("shoppinglist")
            .doc(user.uid).collection("lists").doc(listId)
            .set({
              img: imgName
            });
        }
        db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId).update({
          img: imgName
        })
      })
    }
  })
}

//Save grocery items in list
function saveItem() {
  let Item = document.getElementById("itemInput").value;
  // if text input not is null or not an empty string proceed with saveItem()
  if (Item !== null && Item !== "") {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        console.log(user);
        var userID = user.uid;

        currentUser.get().then((userDoc) => {
          //get user Email
          var userEmail = userDoc.data().email;
          // Start a new collection and add all data in it.
          var docref = db.collection("shoppinglist").doc(userID).collection("lists").doc(listId);
          var doc = docref.get().then((res) => {
            if (!res.exists) {
              db.collection("shoppinglist")
                .doc(userID).collection("lists").doc(listId)
                .set({
                  UserID: userID,
                  UserEmail: userEmail,
                  Item: firebase.firestore.FieldValue.arrayUnion(Item),
                });
            }
            db.collection("shoppinglist")
              .doc(userID)
              .collection("lists").doc(listId).update({
                Item: firebase.firestore.FieldValue.arrayUnion(Item),
              });
            // create list element for the newly added shopping list item
            var ul = document.getElementById("shopping_list_container");
            var li = document.createElement("li");
            var button = document.createElement("button");
            button.innerHTML = "✓";
            li.classList.add("list-group-item");
            li.classList.add("list-group-item-warning");
            button.classList.add("item-delete-button");
            button.classList.add("btn-warning");
            // wait for arrayUnion before calling arrayRemove
            button.addEventListener("click", () => {
              Delete(Item);
            });
            // removes the front-end UI list items
            button.addEventListener("click", function () {
              this.parentNode.remove();
            });
            li.innerText = Item;
            li.append(button);
            ul.append(li);
          });
        });
      } else {
        // No user is signed in.
        console.log("no user signed in");
      }
    });
  }
}

//Upload image to cloud storage
function uploadFile() {

  saveListName()

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      currentUser.get().then((userDoc) => {
        // Start a new collection and add all data in it.
        var docref = db.collection("shoppinglist").doc(userID).collection("lists").doc(listId);
        var doc = docref.get().then((res) => {
          console.log(listId)
          listImgName = userID + listId + ".img"
          console.log(listImgName)
          // Created a Storage Reference with root dir
          var storageRef = firebase.storage().ref();
          // Get the file from DOM
          var file = document.getElementById("files").files[0];
          console.log(file.name);

          // Set reference to the file name
          var thisRef = storageRef.child(listImgName);

          saveListImg(file.name)

          // Put request upload file to firebase storage
          thisRef.put(file).then(function (snapshot) {
            pictureModal();
          });
        });
      })
    }
  })
}

//Upload image button listener
imgBtn = document.getElementById("add-img-btn")
imgBtn.addEventListener("click", () => {
  filesBtn = document.getElementById("files")
  filesBtn.click()
});

//Populate list name and items on list
function populateItem() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here:
      console.log(user.uid);
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      itemList = db.collection("shoppinglist").doc(user.uid).collection("lists").doc(listId);
      //get the document for current user.
      itemList.get().then((listDoc) => {
        var listName = listDoc.data().name;
        var listImgUrl = listDoc.data().img;
        var itemArray = listDoc.data().Item;
        var ul = document.getElementById("shopping_list_container");

        if (listName) { listNameField.value = listName }

        // auto-populates shopping list items UI with forEach loop
        itemArray.forEach(function (e) {
          var arrayItem = e;
          var li = document.createElement("li");
          var button = document.createElement("button");
          button.innerHTML = "✓";
          li.classList.add("list-group-item");
          li.classList.add("list-group-item-warning");
          button.classList.add("item-delete-button");
          button.classList.add("btn-warning");
          // wait for arrayUnion before calling arrayRemove
          button.addEventListener("click", () => {
            Delete(arrayItem);
          });
          // deletes the front-end UI list items
          button.addEventListener("click", function () {
            this.parentNode.remove();
          });
          li.innerText = e;
          li.append(button);
          ul.append(li);
        });
      }).catch((error) => {
        console.log("new user");
      });
    } else {
      // No user is signed in.
      console.log("no user");
    }
  });
}

//Calls populateItem() function on page load
populateItem();

//Show delete confirmation popup 
function deletePopup() {
  $('#modal').modal('show')
}

//Hide delete confirmation popup 
function hidePopup() {
  $('#modal').modal('hide')
}

//Remove list items
function Delete(arrayItem) {
  console.log(arrayItem);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      currentUser.get().then((userDoc) => {
        var docref = db.collection("shoppinglist").doc(userID).collection("lists").doc(listId);
        var doc = docref.get().then((res) => {
          db.collection("shoppinglist")
            .doc(userID).collection("lists").doc(listId)
            .update({
              Item: firebase.firestore.FieldValue.arrayRemove(arrayItem),
            });
        });
      });
    } else {
      // No user is signed in.
      console.log("no user signed in");
    }
  });
}

//Clears items textbox
function clearTextBox() {
  document.getElementById("itemInput").value = "";
}

//Calls clearTextBox function on enter keypress
function search() {
  if (event.key === "Enter") {
    saveItem();
    clearTextBox();
  }
}

//Prevents the page from submitting the "form" on enter keypress
$("#itemInput").bind("keypress keydown keyup", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
  }
});

//Upload image confirmation Modal
var modal = document.getElementById("myModal");

var btn = document.getElementById("save");

var span = document.getElementsByClassName("close")[0];

function pictureModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}