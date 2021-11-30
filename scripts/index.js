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
    db.collection("favorite").doc(uid).onSnapshot(function (doc) {
        let favs = doc.data().favorites
        if (favs.length == 0){
            displayErrorMessage(target_div, "Nothing yet!");
        } else {
            db.collection("sampleAPI").where("id", "in", favs).get().then((products) => {
                populatePage(products, template, target_div);
            })
        }
    })
    
}