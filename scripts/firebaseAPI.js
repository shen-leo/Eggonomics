// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAhNKxzS4pKkKDJFVBVcdtnckIn4FoqOmg",
  authDomain: "eggonomics-35c2b.firebaseapp.com",
  projectId: "eggonomics-35c2b",
  storageBucket: "eggonomics-35c2b.appspot.com",
  messagingSenderId: "835560579628",
  appId: "1:835560579628:web:bb20265f9ae90aa31d2789"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, _) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            var user = authResult.user;                            // get the user object from the Firebase authentication database
                    if (authResult.additionalUserInfo.isNewUser) {         //if new user
                        db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
                                name: user.displayName,                    //"users" collection
                                email: user.email                          //with authenticated user's ID (user.uid)
                            }).then(function () {
                                console.log("New user added to firestore");
                                window.location.assign("index.html");       //re-direct to main.html after signup
                            })
                            .catch(function (error) {
                                console.log("Error adding new user: " + error);
                            });
                    } else {
                        return true;
                    }
                    return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'redirect',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

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
