var ui = new firebaseui.auth.AuthUI(firebase.auth());

function signIn() {
    var password = document.getElementById("password").value
    var email = document.getElementById("email").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // console.log(user.uid)
            location.href = "index.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}

function signUp() {
    var password = document.getElementById("password").value
    var email = document.getElementById("email").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log("created")
            db.collection("users").doc(user.uid).set({     //write to firestore. We are using the UID for the ID in users collection
                name: user.displayName,                    //"users" collection
                email: user.email                          //with authenticated user's ID (user.uid)
            }).then(function () {
                console.log("New user added to firestore");
                window.location.assign("index.html");       //re-direct to main.html after signup
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}
