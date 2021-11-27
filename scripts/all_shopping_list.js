const cardContainer = document.getElementById("card-container")

// let hikeID = localStorage.getItem("hikeID");
//     console.log(hikeID)
//     function setHikeData(id) {
//         localStorage.setItem('hikeID', id);
//     }

function openList(listId) {
  localStorage.setItem('listId', listId);
  localStorage.setItem('newList', false);
  location.href = "single_shopping_list.html"
}

function newList() {
  let newId = "0";
  if(!cardContainer.lastChild){
    newId = "1";
  }
  else{
    newId = (parseInt(cardContainer.lastChild.id) + 1).toString();
  }
  localStorage.setItem('listId', newId);
  localStorage.setItem('newList', true);
  location.href = "single_shopping_list.html"
}


function populate() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("shoppinglist").doc(user.uid).collection("lists").get().then(snap => {
        snap.forEach(doc => {
          let listName = doc.data().name;
          if (!doc.data().name){
            listName = "unnamed shopping list"
          }
          let listImg = doc.data().img;
          if (!doc.data().img){
            listImg = "https://www.gannett-cdn.com/media/2021/07/09/USATODAY/usatsports/fresh-grocery-assortment.jpg"
          }

          let card = document.createElement("div")
          card.setAttribute('id', `${doc.id}`)
          card.setAttribute('class', "card")
          card.setAttribute('onclick', `openList("${doc.id}")`)

          let cardName = document.createElement("div")
          cardName.innerHTML = `${listName}`
          cardName.setAttribute('class', "card-name")

          let cardImg = document.createElement("img")
          cardImg.setAttribute('class', "card-img")
          cardImg.setAttribute('src', `${listImg}`)

          // let deleteButton = document.createElement("button")
          // deleteButton.setAttribute('onclick', `deleteItem("${card.id}")`)
          // deleteButton.setAttribute('class', "delete-btn")

          card.appendChild(cardImg)
          card.appendChild(cardName)
          // card.appendChild(deleteButton)

          cardContainer.appendChild(card)
        })
      })
    }
  })
}
populate()