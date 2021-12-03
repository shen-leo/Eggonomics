var ui = new firebaseui.auth.AuthUI(firebase.auth());

//Sign in existing users
function signIn() {
    var password = document.getElementById("password1").value
    var email = document.getElementById("email1").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            localStorage.setItem("ID", user.uid);
            location.href = "html/main.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}

//Sign up new account for new users
function signUp() {
    var password = document.getElementById("password2").value
    var email = document.getElementById("email2").value
    var name = document.getElementById("name").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            localStorage.setItem("ID", user.uid);
            console.log("created")
            db.collection("users").doc(user.uid).set({     //write to firestore. We are using the UID for the ID in users collection
                name: name,                                //"users" collection
                email: user.email                          //with authenticated user's ID (user.uid)
            })
            .then(function () {
                db.collection("favorite").doc(user.uid).set({
                    user: user.uid,
                    favorites: []
                }).then(function () {
                    console.log("New user added to firestore");
                    window.location.assign("./../html/main.html");       //re-direct to main.html after signup
                })
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}

var authContainer = document.getElementById("auth-container")
var signUpContainer = document.getElementById("signup-container")
var authOption = document.getElementById("auth-option")

//Show and hide sign up and sign in window based on button clicked
document.getElementById("old-user").addEventListener("click", function() {
    authOption.style.display = "none";
    authContainer.style.display = "block";
})
document.getElementById("new-user").addEventListener("click", function() {
    authOption.style.display = "none";
    signUpContainer.style.display = "block";
})

document.getElementById("back1").addEventListener("click", function() {
    authOption.style.display = "flex";
    authContainer.style.display = "none";
})

document.getElementById("back2").addEventListener("click", function() {
    authOption.style.display = "flex";
    signUpContainer.style.display = "none";
})