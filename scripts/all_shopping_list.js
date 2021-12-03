const cardContainer = document.getElementById("card-container")

//Open existing shopping list
function openList(listId) {
  localStorage.setItem('listId', listId);
  localStorage.setItem('newList', false);
  location.href = "single_shopping_list.html"
}

//Open new and empty shopping list
function newList() {
  let newId = "0";
  if (!cardContainer.lastChild) {
    newId = "1";
  }
  else {
    newId = (parseInt(cardContainer.lastChild.id) + 1).toString();
  }
  localStorage.setItem('listId', newId);
  localStorage.setItem('newList', true);
  location.href = "single_shopping_list.html"
}

//Populate exisisting shopping lists
function populate() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var userID = user.uid;
      db.collection("shoppinglist").doc(user.uid).collection("lists").get().then(snap => {
        snap.forEach(doc => {
          let listName = doc.data().name;
          if (!doc.data().name) {
            listName = "unnamed shopping list"
          }
          let listImg = doc.data().img;

          let card = document.createElement("div")
          card.setAttribute('id', `${doc.id}`)
          card.setAttribute('class', "card")
          card.setAttribute('onclick', `openList("${doc.id}")`)

          let cardName = document.createElement("div")
          cardName.innerHTML = `${listName}`
          cardName.setAttribute('class', "card-name")

          let cardImg = document.createElement("img")
          cardImg.setAttribute('class', "card-img")
          if (!doc.data().img) {
            listImg = "https://www.gannett-cdn.com/media/2021/07/09/USATODAY/usatsports/fresh-grocery-assortment.jpg"
            cardImg.setAttribute('src', `${listImg}`)
          }
          else {
            cardImg.setAttribute('data-img', `${userID+doc.id+".img"}`)
          }

          card.appendChild(cardImg)
          card.appendChild(cardName)

          cardContainer.appendChild(card)
        })
      }).then(() => {
        getImg()
      })
    }
  })
}
populate()

//Download list images from cloud storage
function getImg() {
  var storageRef = firebase.storage().ref();
  images = document.querySelectorAll(".card-img")
  images.forEach(function (image) {
    if (image.dataset.img) {
      storageRef.child(image.dataset.img).getDownloadURL()
        .then((url) => {
          //`url` is the download URL for 'images.jpg'

          //This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();

          //Inserted into an <img> element
          image.setAttribute("src", url)
        })
        .catch((error) => {
          console.log("error")
          // Handle any errors
        });
    }
  })
}