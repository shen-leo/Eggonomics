function submitForm(){
    document.getElementById("submit-query").addEventListener("click", function(event){
        console.log("Hello!")
        let query = document.getElementById("query").value;
        localStorage.setItem('query', query)

        console.log("Added " + query + " to 'query' key in local storage");

        window.location.assign("price_tracker.html")
    })
}

document.addEventListener("DOMContentLoaded", function(event){
    console.log("Page Loaded!")
    submitForm();
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