function submitQuery(){
    let new_query = document.getElementById("query").value;
    if (new_query != ''){
        localStorage.setItem("query", new_query);
        window.location.assign("price_tracker.html")
        console.log("Added " + query + " to 'query' key in local storage");
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page Loaded!")
    document.getElementById("query").addEventListener("keydown", (event) => {
        if (event.key == "Enter"){
            event.preventDefault();
            submitQuery();
        }
    });
    document.getElementById("submit-query").addEventListener("click", submitQuery);
    populateFavorites();
})

firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        // Do something for the current logged-in user here: 
        console.log(user.uid);
        //go to the correct user document by referencing to the user uid
        currentUser = db.collection("users").doc(user.uid);
        //get the document for current user.
        currentUser.get()
            .then(userDoc => {
                localStorage.setItem('name', userDoc.data().name)
                localStorage.setItem('email', userDoc.data().email)
            })
    } else {
        // No user is signed in.
        console.log("no user");
    }
});

function populateFavorites(){
    let template = document.getElementById("favs");
    let target_div = document.getElementById("carousel");

    let uid = localStorage.getItem("ID");
    db.collection("favorite").doc(uid).get().then(function (doc) {
        let favs = doc.data().favorites
        if (favs.length == 0){
            displayErrorMessage(target_div, "Nothing yet!");
        } else {
            db.collection("sampleAPI").where("id", "in", favs).onSnapshot((products) => {
                populatePage(products, template, target_div);
            })
        }
    })
    
}

function carouselScroll(){
    const carousel = document.getElementById('carousel');
    carousel.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
        carousel.style.cursor = 'grabbing';
        carousel.style.userSelect = 'none';

      pos = {
        left: carousel.scrollLeft,
        top: carousel.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      // Scroll the element
      carousel.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        carousel.style.cursor = 'grab';
        carousel.style.removeProperty('user-select');

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    carousel.addEventListener('mousedown', mouseDownHandler);
}

carouselScroll()